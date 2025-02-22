import { Okruh } from "@/constants/props";
import { API_URL } from "../constants";

async function fetchLectureDetails(lecture_id: string): Promise<Okruh[]> {
  try {
    const response = await fetch(
      API_URL + "/okruhs/byID?format=json&okruhID=" + lecture_id
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return [];
  }
}
export default fetchLectureDetails;
