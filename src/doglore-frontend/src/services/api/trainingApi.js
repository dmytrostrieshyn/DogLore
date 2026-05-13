import { db } from "../firebase.js";
import { doc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { getSubcollectionData } from "../dbService.js";

// Отримати всі команди (training_logs)
export const fetchTrainingLogs = (dogId) => {
    return getSubcollectionData(`dogs/${dogId}/training_logs`);
};

// Переключити день тренування (додати або прибрати з completedTrainingDates)
export const toggleTrainingDate = async (dogId, dateStr, wasCompleted) => {
    const dogRef = doc(db, "dogs", dogId);
    return updateDoc(dogRef, {
        completedTrainingDates: wasCompleted ? arrayRemove(dateStr) : arrayUnion(dateStr),
    });
};

// Зберегти нотатку з текстового поля (textarea)
export const updateTrainingNotes = async (dogId, noteText) => {
    try {
        const dogRef = doc(db, "dogs", dogId);
        await updateDoc(dogRef, {
            trainingNotes: noteText,
            notesUpdatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Помилка збереження нотатки:", error);
        return false;
    }
};