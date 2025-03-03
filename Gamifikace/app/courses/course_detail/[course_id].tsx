import NavigationPanel from "@/components/navigation/NavigationPanel";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import getInitials from "@/func/getInitials";
import ScoreBoard from "@/components/ui/scoreboard/scoreboard";
import { Icon } from "@/components/ui/icon";
import { BookOpen, Plus, Sword } from "lucide-react-native";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";

const CourseDetail = () => {
  const navigation = useNavigation();
  const [user_id, setUserID] = useState<string | null>(null); // State for access token
  const { course_id } = useLocalSearchParams();
  const { name } = useLocalSearchParams();
  const { user_name } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const retrieveUserID = async () => {
    const userID = await AsyncStorage.getItem("user_id");
    setUserID(userID);
  };
  useFocusEffect(
    useCallback(() => {
      retrieveUserID();
      queryClient.invalidateQueries({
        queryKey: ["score", course_id],
      });
      return () => {};
    }, [course_id, queryClient]) // Dependencies
  );
  useEffect(() => {
    navigation.setOptions({
      title: "Detail predmetu " + name,
      headerRight: () => (
        <Avatar size="md">
          <Text size="lg" className="text-white">
            {getInitials(String(user_name))}
          </Text>
        </Avatar>
      ),
    });
  }, [navigation]);
  return (
    <VStack className="flex flex-col h-full p-5 bg-backgroundLight50">
      {/* Scoreboard */}
      <View className="mb-auto">
        <ScoreBoard course_id={String(course_id)} user_id={String(user_id)} />
      </View>

      {/* Výber režimu */}
      <View className="mb-auto">
        <Pressable
          className="h-20 mb-4 bg-primary-500 rounded-2xl shadow-lg flex items-center justify-center"
          onPress={() =>
            router.push({
              pathname: "/courses/lectures/lecture_list",
              params: { id: course_id, name: name, user_name: user_name },
            })
          }
        >
          <Icon as={BookOpen} size="xl" color="white" />
          <Text className="text-white font-bold mt-2">Štúdium</Text>
        </Pressable>

        <Pressable
          className="h-20 mb-4 bg-secondary-500 rounded-2xl shadow-lg flex items-center justify-center"
          onPress={() =>
            router.push({
              pathname: "/challenge",
              params: { id: String(course_id) },
            })
          }
        >
          <Icon as={Sword} size="xl" color="white" />
          <Text className="text-white font-bold mt-2">Výzva</Text>
        </Pressable>
      </View>

      <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
        onPress={() =>
          router.push({
            pathname: "/study/add_screens/add_question_screen",
            params: {
              lectureID: "-1",
              lectureName: "-1",
              courseID: course_id,
            },
          })
        }
      >
        <FabIcon as={Plus} color="white" />
        <FabLabel>Pridať otázku</FabLabel>
      </Fab>
    </VStack>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 10,
    display: "flex",
    gap: 10,
  },
});
export default CourseDetail;
