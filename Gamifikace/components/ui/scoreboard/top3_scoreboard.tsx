import { Score } from "@/constants/props";
import { Text } from "../text";
import React from "react";
import { VStack } from "../vstack";
import { Avatar } from "../avatar";
import getInitials from "@/func/getInitials";
import { Box } from "../box";
import { HStack } from "../hstack";

interface ScoreBoardProps {
  score: Score[];
  userID: string;
}

const Top3Scoreboard = (props: ScoreBoardProps) => {
  return (
    <HStack className="justify-between pr-10 pl-10">
      <VStack className="flex items-center justify-center mt-10">
        <Text className="font-bold text-[#C0C0C0] text-xl "> 2nd</Text>
        <Box
          className={`bg-white  rounded-lg p-4 mb-4 flex items-center justify-center ${
            props.userID == props.score?.[1]?.user ? "border border-black" : ""
          }`}
        >
          <Avatar size="md">
            <Text size="lg" className="text-white">
              {getInitials(props.score?.[1]?.username ?? "Unknown")}
            </Text>
          </Avatar>
          <Text>{props.score?.[1]?.username ?? "Unknown"}</Text>
          <Text>{props.score?.[1]?.points ?? "0"} b</Text>
        </Box>
      </VStack>

      <VStack className="flex items-center justify-center">
        <Text className="font-bold text-yellow-500 text-xl"> 1st</Text>
        <Box
          className={`bg-white  rounded-lg p-4 mb-4 flex items-center justify-center ${
            props.userID == props.score?.[0]?.user ? "border border-black" : ""
          }`}
        >
          <Avatar size="md">
            <Text size="lg" className="text-white">
              {getInitials(props.score?.[0]?.username ?? "Unknown")}
            </Text>
          </Avatar>
          <Text>{props.score?.[0]?.username ?? "Unknown"}</Text>
          <Text>{props.score?.[0]?.points ?? "0"} b</Text>
        </Box>
      </VStack>

      <VStack className="flex items-center justify-center mt-10">
        <Text className="font-bold text-[#CD7F32] text-xl "> 3rd</Text>
        <Box
          className={`bg-white  rounded-lg p-4 mb-4 flex items-center justify-center ${
            props.userID == props.score?.[2]?.user ? "border border-black" : ""
          }`}
        >
          <Avatar size="md">
            <Text size="lg" className="text-white">
              {getInitials(props.score?.[2]?.username ?? "Unknown")}
            </Text>
          </Avatar>
          <Text>{props.score?.[2]?.username ?? "Unknown"}</Text>
          <Text>{props.score?.[2]?.points ?? "0"} b</Text>
        </Box>
      </VStack>
    </HStack>
  );
};
export default Top3Scoreboard;
