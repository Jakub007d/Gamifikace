import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import fetchScore from "@/api/Downloaders/fetchScoreboard";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import React from "react";
import ScoreboardItem from "./scoreboard_item";
import Top3Scoreboard from "./top3_scoreboard";
import { Score } from "@/constants/props";
import { UserIcon } from "lucide-react-native";

interface ScoreBoardProps {
  user_id: string;
  course_id: string;
}
const getScoreBoardForUser = (
  score: Score[],
  userIndex: number
): (Score & { originalIndex: number })[] => {
  if (userIndex < 3) {
    return score.slice(userIndex + 3, userIndex + 5).map((item, index) => ({
      ...item,
      originalIndex: score.indexOf(item),
    }));
  }

  const endIndex = Math.min(userIndex + 2, score.length);
  return score.slice(userIndex - 1, endIndex).map((item, index) => ({
    ...item,
    originalIndex: score.indexOf(item),
  }));
};

const ScoreBoard = (props: ScoreBoardProps) => {
  const { status, data: scores } = useQuery({
    queryKey: ["score", props.course_id],
    queryFn: () => fetchScore(props.course_id),
  });

  if (status === "success") {
    const userIndex = scores.findIndex(
      (score) => String(score.user) === String(props.user_id)
    );
    const refinedScore = getScoreBoardForUser(scores, userIndex);
    console.log;
    return (
      <VStack>
        <Box className="bg-gray-200 p-4 rounded-lg w-9/10 mx-auto min-w-[90%] mt-5">
          <Center>
            <Text className="text-2xl font-bold">Rebríček</Text>
          </Center>
          <Top3Scoreboard
            score={scores.splice(0, 3)}
            userID={props.user_id}
          ></Top3Scoreboard>
          <VStack>
            {refinedScore.map((score_1, index) => {
              return (
                <ScoreboardItem
                  key={index}
                  score={score_1.points}
                  user_name={score_1.username}
                  user_id={score_1.user}
                  current_user={props.user_id}
                  possition={`${score_1.originalIndex + 1}.`}
                />
              );
            })}
          </VStack>
          <Button className="bg-blue-500 py-2 px-4 rounded-md mt-4">
            <Text className="text-white text-lg">Viac</Text>
          </Button>
        </Box>
      </VStack>
    );
  }

  if (status === "pending") {
    return (
      <View className="w-4/5 h-3/5 mx-auto mt-4 flex justify-center items-center border-2 border-gray-400 rounded-lg p-2">
        <HStack className="flex-row space-x-2 justify-center">
          <Spinner
            className="text-blue-500"
            accessibilityLabel="Loading posts"
          />
          <Heading className="text-blue-500 text-md">
            <Text>Loading</Text>
          </Heading>
        </HStack>
      </View>
    );
  }

  if (status === "error")
    return <View className="w-4/5 h-3/5 mx-auto mt-4"></View>;
};

export default ScoreBoard;
