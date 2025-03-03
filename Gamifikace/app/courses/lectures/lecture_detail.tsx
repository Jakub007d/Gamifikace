import { Button, ButtonText } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "expo-router";
import fetchLectureDetails from "@/api/Downloaders/fetchLectureDetails";
import ComponentWindow from "../components/ComponentWindow";
import { BookOpen, Brain, HelpCircle, Plus } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";

const LectureDetail = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      // Táto akcia sa vykoná, keď sa užívateľ vráti na túto obrazovku
      // Vyprazdenie kontextu
    }, [])
  );
  const { lectureID, courseID } = useLocalSearchParams();
  console.log(lectureID);
  const { status: lecture_status, data: lecture } = useQuery({
    queryKey: [lectureID],
    queryFn: () =>
      fetchLectureDetails(
        typeof lectureID === "string" ? lectureID : lectureID.join(", ")
      ),
  });
  useEffect(() => {
    navigation.setOptions({
      title:
        lecture_status === "success"
          ? lecture?.[0]?.name ?? "Default Name"
          : "Loading...",
    });
  }, [navigation, lecture]);
  return (
    <>
      <View>
        <ComponentWindow>
          {lecture_status === "success" && (
            <Text>{lecture[0]!.description}</Text>
          )}
          {lecture_status === "pending" && <Text>Loading</Text>}
          {lecture_status === "success" && lecture[0]!.description == "" && (
            <Text>Ešte nebol poskytnutý popis Okruhu</Text>
          )}
        </ComponentWindow>
        <Box flex={1} bg="$backgroundLight50" p="$5">
          {/* Výber režimu */}
          <VStack space="md">
            <Pressable
              className="h-20 ml-5 mr-5 mt-5 mb-2.5 bg-primary-500 rounded-2xl shadow-lg flex items-center justify-center"
              onPress={() =>
                router.push({
                  pathname: "/study/flash_cards/flash_cards",
                  params: {
                    lectureID: lectureID,
                    lecture_name: lecture![0].name,
                  },
                })
              }
            >
              <Icon as={Brain} size="xl" color="white" />
              <Text className="text-white font-bold mt-2">Pamäťové Karty</Text>
            </Pressable>

            <Pressable
              className="h-20 ml-5 mr-5 mt-2.5 mb-2.5 bg-secondary-500 rounded-2xl shadow-lg flex items-center justify-center"
              onPress={() =>
                router.push({
                  pathname: "/study/quiz/quiz",
                  params: { lectureID: lectureID },
                })
              }
            >
              <Icon as={HelpCircle} size="xl" color="white" />
              <Text className="text-white font-bold mt-2">Quiz</Text>
            </Pressable>
          </VStack>

          {/* Plávajúce tlačidlo na pridanie otázky */}
        </Box>
      </View>
      <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
        onPress={() =>
          router.push({
            pathname: "/study/add_screens/add_question_screen",
            params: {
              lectureID: lectureID,
              lectureName: lecture![0].name,
              courseID: courseID,
            },
          })
        }
      >
        <FabIcon as={Plus} color="white" />
        <FabLabel>Pridať otázku</FabLabel>
      </Fab>
    </>
  );
};

export default LectureDetail;
