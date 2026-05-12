import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { getSubcollectionData } from "../dbService.js";

// Отримати дані однієї собаки за ID + дані її породи
export const fetchDogFullProfile = async (dogId) => {
    try {
        const dogRef = doc(db, "dogs", dogId);
        const dogSnap = await getDoc(dogRef);

        if (dogSnap.exists()) {
            const dogData = dogSnap.data();

            // Отримуємо дані про породу, використовуючи breed_id зі сторінки собаки
            const breedRef = doc(db, "breeds", dogData.breed_id);
            const breedSnap = await getDoc(breedRef);

            return {
                id: dogSnap.id,
                ...dogData,
                breedInfo: breedSnap.exists() ? breedSnap.data() : null
            };
        }
        return null;
    } catch (error) {
        console.error("Помилка профілю:", error);
    }
};

// Отримати історію ваги для графіка (твоя підколекція health_logs)
export const fetchDogWeightHistory = (dogId) => {
    return getSubcollectionData(`dogs/${dogId}/health_logs`);
};


export const fetchDogJournal = (dogId) => {
    // Тут ми звертаємось до підколекції training_logs щоб отримати данні із щоденника собаки
    return getSubcollectionData(`dogs/${dogId}/training_logs`);
};