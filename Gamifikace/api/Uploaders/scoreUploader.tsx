import axios from "axios";
import { API_URL } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { Score_POST } from "@/constants/props";
/**
 * Funkcia ScoreUploader nahráva aktualne získané skóre užívateľa na backend.
 * @param {string} props.courseID - ID kurzu.
 * @param {string} props.points - získané skóre.
 * @param {string} props.user_id - získané skóre.
 */
async function ScoreUploader(
  courseID: String,
  points: number,
  user_id: String
) {
  const score: Score_POST = {
    user_id: user_id,
    courseID: courseID,
    point: points,
  }; // Create the POST requuest
  const { data } = await axios.post(API_URL + "/score/entry", score, {
    headers: { "Content-Type": "application/json" },
  });
  console.log(data);
}

export default ScoreUploader;
