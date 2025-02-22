import { User } from "@/constants/props";
import { API_URL } from "../constants";

//Funkcia pre získanie uživateľského mena pre ID.
async function fetchUserName(userID: String): Promise<User[]> {
  try {
    const response = await fetch(
      API_URL + "/user/querry?format=json&user_id=" + userID
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
export default fetchUserName;
