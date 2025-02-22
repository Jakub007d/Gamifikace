import { Question } from "@/constants/props";
import { API_URL } from "../constants";
//Funkcia pre získanie otázok pre mód výzva
async function fetchChallange(courseID: String): Promise<Question[]> {
  try {
    const response = await fetch(
      API_URL + "/challange/querry?format=json&courseID=" + courseID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchChallange;
