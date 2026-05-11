import { getCollectionData } from "../dbService";

export const fetchAllDogs = () => getCollectionData("dogs");