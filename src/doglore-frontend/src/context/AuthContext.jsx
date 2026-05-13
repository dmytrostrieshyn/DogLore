import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [dogId, setDogId] = useState(null);
    // true until Firebase resolves the initial auth state (prevents flash of wrong UI)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Set user immediately so ProtectedRoute passes before the Firestore read
                setUser(firebaseUser);
                try {
                    const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));

                    let resolvedDogId = userSnap.exists() ? (userSnap.data().dogId ?? null) : null;

                    // Fallback: if users doc is missing or has no dogId, find dog by userId field
                    if (!resolvedDogId) {
                        const q = query(collection(db, 'dogs'), where('userId', '==', firebaseUser.uid));
                        const dogsSnap = await getDocs(q);
                        if (!dogsSnap.empty) {
                            resolvedDogId = dogsSnap.docs[0].id;
                            await setDoc(doc(db, 'users', firebaseUser.uid), { dogId: resolvedDogId }, { merge: true });
                        }
                    }

                    setDogId(resolvedDogId);
                } catch {
                    setDogId(null);
                }
            } else {
                setUser(null);
                setDogId(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, dogId, setDogId, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
