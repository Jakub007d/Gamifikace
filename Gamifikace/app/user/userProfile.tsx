import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trophy } from "lucide-react-native";
import getInitials from "@/func/getInitials";
import { Achievement } from "@/constants/props";
import fetchAchievements from "@/api/Downloaders/fetchUserAchivements";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

export default function userProfile() {
  const { user_id, user_name } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { status: achievements_status, data: achievements } = useQuery({
    queryKey: ["achievments", user_id],
    queryFn: () => fetchAchievements(String(user_id)),
  });
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["achievments", user_id],
    });
  });
  return (
    <VStack className="space-y-4 items-center p-4 rounded-lg bg-backgroundLight shadow-md">
      <HStack className="items-center space-x-4">
        <Avatar className="bg-green-600 w-12 h-12 flex items-center justify-center">
          <Text className="text-white font-bold">
            {getInitials(String(user_name))}
          </Text>
        </Avatar>
        <Divider className="h-full w-1 bg-emerald-500" />
        <Text className="text-xl font-bold">
          {user_name} {user_id}
        </Text>
      </HStack>

      <Divider className="h-1 bg-emerald-500" />
      <Text className="text-lg font-semibold">Odmeny</Text>

      {achievements_status === "success" &&
        achievements.map((achievement) => (
          <HStack
            key={achievement.id}
            className="space-x-3 items-center bg-gray-100 p-2 rounded-lg shadow-sm"
          >
            <Icon as={Trophy} className="w-5 h-5 text-yellow-500" />
            <Text className="text-md font-medium">{achievement.name}</Text>
          </HStack>
        ))}

      {achievements_status === "pending" && (
        <Spinner className="text-emerald-500" />
      )}
      {achievements_status === "error" && (
        <Text className="text-red-500">Chyba pri načítaní</Text>
      )}

      <Divider className="h-1 bg-emerald-500" />
      <Text className="text-lg font-semibold">Štatistiky</Text>
      <Box className="p-3 bg-gray-200 rounded-lg">
        <Text className="text-md">Stats:</Text>
      </Box>
    </VStack>
  );
}
