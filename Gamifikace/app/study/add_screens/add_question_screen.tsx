import { Switch, Text, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useData } from "./components/answers_context";
import { useToast } from "@/components/ui/toast";
import fetchLecturesForCourse from "@/api/Downloaders/fetchLectureForCourse";
import { Answer } from "@/constants/props";
import { Center } from "@/components/ui/center";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { CheckIcon, ChevronDown } from "lucide-react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import postQuestionWithAnswers from "@/api/Uploaders/uploadQuestion";

export default function addQuestionScreen() {
  const navigation = useNavigation();

  const { answers, addAnswer } = useData();
  const { lectureID, lectureName, courseID } = useLocalSearchParams();
  const [selectedLectureID, setSelectedLectureID] = useState("");
  const [question_name, setQuestionName] = useState("");
  const [question_text, setQuestionText] = useState("");
  const toast = useToast();
  const [question_pos, setQuestionPos] = useState(0);
  const { status: lecture_status, data: lectures } = useQuery({
    queryKey: ["lectures", courseID],
    enabled: !!courseID,
    queryFn: () => fetchLecturesForCourse(courseID[0]!),
  });
  const [answers_v2, setAnswers_v2] = useState<Answer[]>([
    {
      id: "",
      text: "",
      answer_type: false,
      question: "",
    },
  ]);
  const handleAddAnswer = () => {
    setAnswers_v2((prevAnswers) => [
      ...prevAnswers,
      {
        id: "",
        text: "",
        answer_type: false,
        question: "",
      },
    ]);
  };
  const handleOnAnswerNameChange = (text: string, index: number) => {
    const updatedAnswers = [...answers_v2];
    updatedAnswers[index].text = text;
    setAnswers_v2(updatedAnswers);
  };
  const handleOnAnswerTypeChange = (type: boolean, index: number) => {
    const updatedAnswers = [...answers_v2];
    updatedAnswers[index].answer_type = type;
    setAnswers_v2(updatedAnswers);
  };
  //TODO FIX THIS YOU STUPIT HUMAN
  useEffect(() => {
    if (lecture_status === "success" && lectures && lectures.length > 0) {
      if (lectureID !== "-1" && lectureID) {
        setSelectedLectureID(String(lectureID));
      } else {
        const defaultLecture = lectures.find((lecture) => lecture.available);
        if (defaultLecture) {
          setSelectedLectureID(defaultLecture.id);
        }
      }
    }
  }, [lecture_status, lectures, lectureID]);
  useEffect(() => {
    navigation.setOptions({
      title: "Pridavanie otázky",
    });
  }, [navigation]);
  return (
    <Center>
      {lecture_status === "success" && (
        <Select
          className="w-52 border border-gray-300 rounded-lg bg-white shadow-sm"
          selectedValue={selectedLectureID}
          onValueChange={setSelectedLectureID}
        >
          <SelectTrigger className="p-3 text-gray-700 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
            <SelectInput
              placeholder="Vyber okruh"
              className="text-sm text-gray-700"
            />
            {/* Add the ChevronDown icon from lucide-react-native */}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </SelectTrigger>

          <SelectPortal>
            <SelectBackdrop className="bg-opacity-50" />
            <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-300 mt-1">
              {lectures.map((lecture) => (
                <SelectItem
                  key={lecture.id}
                  value={String(lecture.id)}
                  className={`p-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between transition-colors duration-150 ${
                    lecture.available ? "" : "opacity-50 pointer-events-none"
                  }`}
                  label={String(lecture.name)}
                >
                  {lecture.name}
                  {selectedLectureID === String(lecture.id) && (
                    <CheckIcon className="w-4 h-4 text-blue-500" />
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      )}
      <View className="w-full max-w-md p-4">
        {/* Label for TextArea */}
        <Text className="text-lg font-medium text-gray-700 mb-1">
          Text otázky
        </Text>

        {/* TextArea */}
        <Textarea className="w-full h-24 border border-gray-300 rounded-lg p-3 text-gray-700">
          <TextareaInput
            placeholder="Text Otázky"
            value={question_text}
            onChangeText={setQuestionText}
          />
        </Textarea>

        {/* Answers Section */}
        <View className="mt-4">
          <VStack>
            {/* Answers Header */}
            <HStack className="justify-between mb-2">
              <Text className="text-base font-medium">Odpovede</Text>
              <Text className="text-base font-medium">Je správna</Text>
            </HStack>

            {/* Answers List */}
            {answers_v2.map((answer, index) => (
              <HStack key={index} className="items-center mb-2 space-x-2">
                <Input className="w-4/5 border border-gray-300 rounded-lg p-2">
                  <InputField
                    placeholder="Odpoveď"
                    value={answer.text}
                    onChangeText={(text) =>
                      handleOnAnswerNameChange(text, index)
                    }
                  />
                </Input>
                <Switch
                  value={answer.answer_type}
                  onValueChange={(value) =>
                    handleOnAnswerTypeChange(value, index)
                  }
                  className="ml-2"
                />
              </HStack>
            ))}

            {/* Add Answer Button */}
            <Button
              variant="outline"
              className="mt-3 border-dashed border-gray-500"
              onPress={handleAddAnswer}
            >
              <ButtonText>+</ButtonText>
            </Button>
          </VStack>
        </View>

        {/* Submit Button */}
        <Button
          className="mt-4"
          onPress={() => {
            postQuestionWithAnswers(
              true,
              question_name,
              question_text,
              String(selectedLectureID),
              answers_v2
            );
            toast.show({ description: "Otázka a odpovede úspešne pridané" });
            router.back();
          }}
        >
          <ButtonText>Odoslať</ButtonText>
        </Button>
      </View>
    </Center>
  );
}
