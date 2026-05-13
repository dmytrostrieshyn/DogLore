import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, arrayUnion, collection } from "firebase/firestore";
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

            let breedInfo = null;
            if (dogData.breed_id) {
                const breedSnap = await getDoc(doc(db, "breeds", dogData.breed_id));
                breedInfo = breedSnap.exists() ? breedSnap.data() : null;
            }

            return {
                id: dogSnap.id,
                ...dogData,
                breedInfo
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

/**
 * 9. Додати запис ваги в health_logs
 */
export const addWeightEntry = (dogId, value, label) =>
    createSubdocument(`dogs/${dogId}/health_logs`, { value: Number(value), label });

/**
 * 11. Додати фото до галереї (chronology)
 */
export const addGalleryPhoto = (dogId, imageURL, ageLabel = '') =>
    createSubdocument(`dogs/${dogId}/chronology`, { imageURL, ageLabel });

/**
 * 12. Оновити прогрес команди в training_logs
 */
export const updateCommandProgress = async (dogId, commandId, progress) => {
    const cmdRef = doc(db, 'dogs', dogId, 'training_logs', commandId);
    return updateDoc(cmdRef, { progress: Math.min(100, Math.max(0, progress)) });
};

/**
 * 13. Отримати записи щоденника (journal)
 */
export const fetchJournalEntries = (dogId) =>
    getSubcollectionData(`dogs/${dogId}/journal`);

/**
 * 14. Додати запис до щоденника
 */
export const addJournalEntry = (dogId, imageURL, description) =>
    createSubdocument(`dogs/${dogId}/journal`, { imageURL, description });