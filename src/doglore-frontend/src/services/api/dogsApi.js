import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { getSubcollectionData, createDocument, createSubdocument } from "../dbService.js";

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

// приклад, як треба передаавти данні у функцію
//const newDog = {
//    dogName: "укцк",
//    breed_id: "ID_ПОРОДИ_З_ЕНЦИКЛОПЕДІЇ", // Обов'язково ID документа з колекції breeds
//    gender: "Male",
//    chip: "123-456-789",
//    nutrition: "Natural food",
//    trainingNotes: "", // Поки що порожньо
//};

export const registerDog = async (dogData) => {
    try {
        // Перевіряємо, чи передали id породи, щоб не було порожніх профілів
        if (!dogData.breed_id) throw new Error("Необхідно вказати ID породи");

        const newDogId = await createDocument("dogs", dogData);
        console.log("Собаку успішно зареєстровано з ID:", newDogId);
        return newDogId;
    } catch (error) {
        console.error("Помилка при реєстрації собаки:", error);
        throw error;
    }
};

//const healthData = {
//    weight: 42.5,
//    status: "Чудовий",
//    lastCheckup: "Вакцинація пройшла успішно"
//};

// Додавання запису в Health Log
export const addHealthLog = (dogId, healthData) =>
    createSubdocument(`dogs/${dogId}/health_logs`, healthData);


//const trainingData = {
//    command: "Сидіти",
//    mastery: 85,
//    notes: "Добре реагує на ласощі"
//};

// Додавання запису в Training Log
export const addTrainingLog = (dogId, trainingData) =>
    createSubdocument(`dogs/${dogId}/training_logs`, trainingData);