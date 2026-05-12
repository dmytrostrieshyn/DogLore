import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export const getCollectionData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Універсальна функція для отримання підколекцій (наприклад, щоденник конкретної собаки)
export const getSubcollectionData = async (path) => {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Універсальна функція для створення нового документа
export const createDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(), // Автоматично додаємо час створення
    });
    return docRef.id; // Повертаємо ID нової собаки
};

// Універсальна функція для створення документа в підколекції (або за будь-яким шляхом)
export const createSubdocument = async (path, data) => {
    const docRef = await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};