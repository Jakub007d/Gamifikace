import { Question } from "@/constants/props";
import { API_URL } from "../constants";
//Funkcia pre získanie otázok pre okruh.
async function fetchQuestions(okruhID: String): Promise<Question[]> {
  try {
    const response = await fetch(
      API_URL + "/question/querry?format=json&okruhID=" + okruhID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchQuestions;
