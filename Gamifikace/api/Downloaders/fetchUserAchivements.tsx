import { API_URL } from "../constants";
import { Achievement } from "@/constants/props";

async function fetchAchievements(userId: string): Promise<Achievement[]> {
  try {
    const response = await fetch(
      API_URL + "/user/" + userId + "/achievements/?format=json"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Achivements:", error);
    return [];
  }
}
export default fetchAchievements;
