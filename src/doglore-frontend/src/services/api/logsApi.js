import { getSubcollectionData } from "../dbService";

// Тут одногрупнику треба буде просто передати ID собаки
export const fetchDogHealthLogs = (dogId) => getSubcollectionData(`dogs/${dogId}/health_logs`);
export const fetchDogTrainingLogs = (dogId) => getSubcollectionData(`dogs/${dogId}/training_logs`);