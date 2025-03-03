import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import fetchQuestions from "@/api/Downloaders/fetchQuestions";
import { API_URL } from "@/api/constants";
import { Question } from "@/constants/props";
const SumaryView = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { score, bad, lectureID, bad_index } = useLocalSearchParams(); // Hook musí byť vnútri komponenty
  const [token, setToken] = useState("");
  const [isLectureCompleted, setIsLectureCompleted] = useState(false);
  const { status: questions_status, data: questions } = useQuery({
    queryKey: ["questions", lectureID],
    enabled: !!lectureID,
    queryFn: () =>
      fetchQuestions(
        typeof lectureID === "string" ? lectureID : lectureID.join(", ")
      ),
  });
  useEffect(() => {
    navigation.setOptions({
      title: "Súhrn",
    });
  }, [navigation]);
  // Funkcia na načítanie tokenu
  const retrieveToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("access_token");
      if (userToken) {
        setToken(userToken);
        console.log(userToken);
      } else {
        alert("Chyba pri získavaní tokenu.");
      }
    } catch (error) {
      console.error("Chyba pri získavaní tokenu:", error);
    }
  };

  // Funkcia na dokončenie okruhu
  const handleCompleteLecture = async (accessToken: string) => {
    try {
      const response = await axios.post(
        API_URL + `/lecture/${String(lectureID)}/complete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLectureCompleted(true);
        alert(response.data.message);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    const initialize = async () => {
      await retrieveToken();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (token && !isLectureCompleted) {
      handleCompleteLecture(token);
    }
  }, [token]);
  console.log("lecture ide je " + lectureID);
  if (questions_status === "success") {
    if (Number(String(bad)) > 0 || Number(String(score)) === 0)
      return (
        <VStack className="flex-1">
          <Text>
            Mal si viacej ako jednu nesprávnu odpoved. Skús to znovu aby si
            dokončil okruh úspešne.
          </Text>
          <Text className="text-center">Počet nesprávnych odpovedí: {bad}</Text>
          <View>
            {questions!.map((question: Question, index) => (
              <Box
                key={index}
                className={`w-[90%] max-w-md border-2 mt-2 border-black text-center p-4 rounded-lg mx-auto flex justify-center items-center ${
                  bad_index.includes(String(index))
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
              >
                <Text className="text-center">{question.name}</Text>
              </Box>
            ))}
          </View>
          <View className="mt-auto flex flex-col w-full px-4 pb-4 space-y-4">
            <Button
              className="h-12"
              onPress={() => {
                router.back();
                router.back();
              }}
            >
              <ButtonText>Späť na detail okruhu</ButtonText>
            </Button>
            <Button
              className="h-12 mt-10"
              onPress={() => {
                router.back();
                router.back();
                router.back();
              }}
            >
              <ButtonText>Späť na detail predmetu</ButtonText>
            </Button>
          </View>
        </VStack>
      );
    else
      return (
        <VStack>
          <Text className="text-center">Skóre : {score}</Text>
          <View>
            {questions!.map((question: Question, index) => (
              <Box
                key={index}
                className={`w-[90%] max-w-md border-2 mt-2 border-black text-center p-4 rounded-lg mx-auto flex justify-center items-center ${
                  bad_index.includes(String(index))
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
              >
                <Text className="text-center">{question.name}</Text>
              </Box>
            ))}
          </View>
          <Button>
            <ButtonText>Domov</ButtonText>
          </Button>
        </VStack>
      );
  } else {
    return (
      <>
        <Spinner size="small" />
      </>
    );
  }
};

export default SumaryView;
