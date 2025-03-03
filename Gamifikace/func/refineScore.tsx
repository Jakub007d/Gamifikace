import { Refined_Score, Score } from "@/constants/props";

export default function refineScore(
  score: Score[],
  userIndex: number
): Refined_Score[] {
  const newList: Refined_Score[] = [];
  if ((userIndex = 0)) {
    newList.push({});
  }
  return newList;
}
