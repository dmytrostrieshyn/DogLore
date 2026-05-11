import { getCollectionData } from "../dbService";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Отримати всі породи (для початкового завантаження)
export const fetchAllBreeds = () => getCollectionData("breeds");

// Пошук породи за назвою
export const searchBreeds = async (searchTerm) => {
    const breedsRef = collection(db, "breeds");
    // Важливо: пошук у Firestore чутливий до регістру, 
    // тому краще робити фільтрацію вже на фронтенді, якщо порід < 100
    const q = query(breedsRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};