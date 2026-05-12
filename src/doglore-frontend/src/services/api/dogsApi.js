import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// Імпортуємо твої універсальні інструменти
import {
    getSubcollectionData,
    createDocument,
    createSubdocument
} from "../dbService.js";

/**
 * 1. Отримати ПОВНИЙ профіль собаки
 * (Використовуємо прямий getDoc, бо нам потрібен конкретний ID + дані породи)
 */
export const fetchDogFullProfile = async (dogId) => {
    try {
        const dogRef = doc(db, "dogs", dogId);
        const dogSnap = await getDoc(dogRef);

        if (dogSnap.exists()) {
            const dogData = dogSnap.data();
            // Тягнемо інфу про породу через її ID
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
        console.error("Помилка отримання профілю:", error);
        throw error;
    }
};

/**
 * 2. Реєстрація нової собаки
 * (Використовуємо твій createDocument)
 */
export const registerDog = (dogData) => createDocument("dogs", dogData);

/**
 * 3. Оновлення приміток та Календаря
 * (Тут updateDoc, бо ми змінюємо існуючий документ собаки)
 */
export const updateTrainingNotes = async (dogId, newNotes) => {
    const dogRef = doc(db, "dogs", dogId);
    return await updateDoc(dogRef, {
        trainingNotes: newNotes,
        // Додаємо дату в масив для персикових кіл на календарі
        completedTrainingDates: arrayUnion(new Date().toISOString().split('T')[0])
    });
};

/**
 * 4. Отримати історію ваги (health_logs)
 * (Використовуємо твій getSubcollectionData)
 */
export const fetchDogWeightHistory = (dogId) => {
    return getSubcollectionData(`dogs/${dogId}/health_logs`);
};

/**
 * 5. Отримати список команд (training_logs)
 * (Використовуємо твій getSubcollectionData)
 */
export const fetchTrainingLogs = (dogId) => {
    return getSubcollectionData(`dogs/${dogId}/training_logs`);
};

/**
 * 6. Додати нову команду (Training Log)
 * (Використовуємо твій createSubdocument)
 */
export const addNewCommand = (dogId, commandName) => {
    return createSubdocument(`dogs/${dogId}/training_logs`, {
        name: commandName,
        progress: 0
    });
};

/**
 * 7. Отримати галерею (chronology)
 * (Використовуємо твій getSubcollectionData)
 */
export const fetchDogGallery = (dogId) => {
    return getSubcollectionData(`dogs/${dogId}/chronology`);
};

/**
 * 8. Оновити профіль собаки (довільні поля)
 */
export const updateDogProfile = async (dogId, fields) => {
    const dogRef = doc(db, 'dogs', dogId);
    return await updateDoc(dogRef, fields);
};