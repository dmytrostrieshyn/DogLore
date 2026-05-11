import { getCollectionData } from "../dbService";

export const fetchAllBreeds = () => getCollectionData("breeds");