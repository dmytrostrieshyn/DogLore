import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
                    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
                    setDogId(snap.exists() ? (snap.data().dogId ?? null) : null);
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
