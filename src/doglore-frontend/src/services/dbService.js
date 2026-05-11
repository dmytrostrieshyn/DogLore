import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const getCollectionData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Універсальна функція для отримання підколекцій (наприклад, щоденник конкретної собаки)
export const getSubcollectionData = async (path) => {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};