import { Answer } from "@/constants/props";
import { API_URL } from "../constants";
//Funkcia pre získanie odpovedí podla questionID.
async function fetchAnswers(questionID: String): Promise<Answer[]> {
  try {
    const response = await fetch(
      API_URL + "/answer/querry?format=json&questionID=" + questionID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchAnswers;
