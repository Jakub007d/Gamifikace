import { Button, ButtonText } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import React from "react";
import { Check, Square, SquareCheck } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import fetchQuestions from "@/api/Downloaders/fetchQuestions";
import fetchAnswers from "@/api/Downloaders/fetchAnswers";
import { Answer } from "@/constants/props";
import { Center } from "@/components/ui/center";
import StudyCardWindow from "../components/StudyWindow";

const QuizView = () => {
  const navigation = useNavigation();
  const [question_position, setPosition] = useState(0);
  const [selected_answers, setSelectedAnswer] = useState<Answer[]>([]);
  const [textCorrectAnswers, setTextCorrectedAnswers] = useState(0);
  const [answers_sent, setAnswersSent] = useState(false);
  const { lectureID, courseID } = useLocalSearchParams();
  const [score, setScore] = useState(0);
  const [bad, setBad] = useState(0);
  const [bad_index, setBadIndex] = useState<String[]>([]);
  const [correct_answers, setCorrectAnswers] = useState(0);
  const [answer_text, setAnswerText] = useState("");
  const { status: questions_status, data: questions } = useQuery({
    queryKey: ["questions", lectureID],
    enabled: !!lectureID,
    queryFn: () =>
      fetchQuestions(
        typeof lectureID === "string" ? lectureID : lectureID.join(", ")
      ),
  });
  const { status: answer_status, data: answers } = useQuery({
    queryKey: ["answers", questions?.[question_position]?.id],
    enabled: !!questions,
    queryFn: () => fetchAnswers(questions![question_position].id),
  });

  useEffect(() => {
    if (answers) {
      let correct = 0;
      answers.forEach((answer) => {
        if (answer.answer_type == true) {
          correct += 1;
          setCorrectAnswers(correct_answers + 1);
        }
      });
      setCorrectAnswers(correct);
    }
  }, [answers]);
  useEffect(() => {
    navigation.setOptions({
      title: "Quiz",
    });
  }, [navigation]);

  const toggleAnswerSelection = (answer: Answer) => {
    // Skontroluje, či už je odpoveď vybraná
    if (selected_answers.some((selected) => selected.id === answer.id)) {
      // Ak je odpoveď vybraná, odstráni ju zo zoznamu
      setSelectedAnswer(
        selected_answers.filter((selected) => selected.id !== answer.id)
      );
    } else {
      // Ak odpoveď nie je vybraná, pridá ju do zoznamu
      setSelectedAnswer([...selected_answers, answer]);
    }
  };

  function getQuestionPosition(next_position: number) {
    const maxSize: number = questions!.length;
    if (question_position + next_position >= maxSize) {
      setPosition(0);
    } else if (question_position <= 0) {
      setPosition(maxSize - 1);
    } else {
      setPosition(question_position + next_position);
    }
  }
  function validateSelectedAnswers() {
    var correctSelectedAnswers = 0;
    var corectAnswers = 0;
    if (selected_answers.length == 0) {
      setBad(bad + 1);
      console.log("question_position:" + question_position);
      setBadIndex((prevBadIndex) =>
        prevBadIndex.includes(String(question_position))
          ? prevBadIndex
          : [...prevBadIndex, String(question_position)]
      );
      return;
    }
    selected_answers.forEach((answer) => {
      if (answer.answer_type) {
        correctSelectedAnswers += 1;
      } else {
        setBad(bad + 1);
        setBadIndex((prevBadIndex) =>
          prevBadIndex.includes(String(question_position))
            ? prevBadIndex
            : [...prevBadIndex, String(question_position)]
        );
      }
    });
    answers?.slice(0, 4).forEach((answer) => {
      if (answer.answer_type) {
        corectAnswers += 1;
      }
    });
    setScore(correctSelectedAnswers / corectAnswers);
    setScore(score + textCorrectAnswers);
  }

  function getCorrectAnswers(): string[] {
    return answers!
      .filter((answer: Answer) => answer.answer_type === true) // Filtruje správne odpovede
      .map((answer: Answer) => answer.text); // Extrahuje text správnych odpovedí
  }
  function handleAnswerColor(answer: Answer): string | undefined {
    if (answers_sent) {
      if (
        answer.answer_type == true &&
        selected_answers.some((selected) => selected.id === answer.id)
      ) {
        return "#28a745";
      }
      if (
        answer.answer_type == true &&
        !selected_answers.some((selected) => selected.id === answer.id)
      ) {
        return "orange";
      }
      if (
        answer.answer_type == false &&
        selected_answers.some((selected) => selected.id === answer.id)
      ) {
        return "red";
      }
    } else {
      return selected_answers.some((selected) => selected.id === answer.id)
        ? "green"
        : "#00bcd4";
    }
  }

  function handleTextAnswer(answer: string, input: string) {
    if (input == answer) {
      setTextCorrectedAnswers(textCorrectAnswers + 1);
      return;
    }
    setBad(bad + 1);
    setBadIndex((prevBadIndex) =>
      prevBadIndex.includes(String(question_position))
        ? prevBadIndex
        : [...prevBadIndex, String(question_position)]
    );
  }

  return (
    <Center>
      <View style={{ width: "90%" }}>
        {questions_status === "success" && answer_status === "success" && (
          <>
            <View style={{ height: "40%" }}>
              <StudyCardWindow
                question={questions[question_position].text}
                answer={getCorrectAnswers()}
                answer_shown={false}
                setShown={() => {}}
              />
            </View>
            {answers.length > 1 && (
              <>
                <View style={{ height: "50%", marginTop: 15 }}>
                  {answers.slice(0, 4).map((answer: Answer, index) => (
                    <View style={{ padding: 10 }} key={index}>
                      <Button
                        className="h-12"
                        style={
                          answers_sent
                            ? {
                                backgroundColor: handleAnswerColor(answer),
                              }
                            : {}
                        }
                        onPress={
                          !answers_sent
                            ? () => toggleAnswerSelection(answer)
                            : () => {}
                        }
                      >
                        <View className="flex-row items-center justify-between w-full">
                          {selected_answers.some(
                            (selected) => selected.id === answer.id
                          ) ? (
                            <Icon as={SquareCheck} size="md" color="white" />
                          ) : (
                            <Icon as={Square} size="md" color="white" />
                          )}

                          <ButtonText className="absolute left-1/2 -translate-x-1/2 text-white">
                            {answer.text}
                          </ButtonText>
                        </View>
                      </Button>
                    </View>
                  ))}
                </View>
                <View style={{ padding: 10, height: "10%" }}>
                  {!answers_sent && (
                    <Button
                      className="h-12"
                      onPress={() => {
                        setAnswersSent(true);
                        validateSelectedAnswers();
                      }}
                    >
                      <ButtonText>
                        {answers_sent ? "Dalej" : "Zadaj"}
                      </ButtonText>
                    </Button>
                  )}
                  {answers_sent && (
                    <Button
                      className="h-12"
                      onPress={() => {
                        if (question_position + 1 < questions.length) {
                          setPosition(question_position + 1);
                        } else {
                          router.push({
                            pathname: "/summary/sumaryView",
                            params: {
                              score: score,
                              bad: bad,
                              lectureID: lectureID,
                              bad_index: String(bad_index),
                            },
                          });
                        }
                        setAnswersSent(false);
                      }}
                    >
                      <ButtonText>
                        {answers_sent ? "Dalej" : "Zadaj"}
                      </ButtonText>
                    </Button>
                  )}
                </View>
              </>
            )}
            {answers.length == 1 && (
              <>
                <View
                  style={{
                    height: "45%",
                    marginTop: 30,
                    width: "80%",
                    marginHorizontal: "auto",
                  }}
                >
                  <Input isDisabled={answers_sent}>
                    <InputField
                      placeholder="Zadaj odpoveď"
                      value={answer_text}
                      onChangeText={(text: string) => setAnswerText(text)}
                      className={`rounded-lg shadow-md h-10 ${
                        answers_sent && answers[0]?.text === answer_text
                          ? "bg-green-200" // Light Green for correct answer
                          : answers_sent && answers[0]?.text !== answer_text
                          ? "bg-red-200" // Light Red for incorrect answer
                          : "bg-transparent" // Transparent if not sent
                      }`}
                    />
                  </Input>
                </View>
                <View style={{ padding: 10, height: "10%" }}>
                  {!answers_sent && (
                    <Button
                      onPress={() => {
                        setAnswersSent(true);
                        handleTextAnswer(answers[0].text, answer_text);
                      }}
                    >
                      <ButtonText>
                        {answers_sent ? "Dalej" : "Zadaj"}
                      </ButtonText>
                    </Button>
                  )}
                  {answers_sent && (
                    <Button
                      onPress={() => {
                        if (question_position + 1 < questions.length) {
                          setPosition(question_position + 1);
                        } else {
                          router.push({
                            pathname: "/summary/sumaryView",
                            params: {
                              score: score,
                              bad: bad,
                              lectureID: lectureID,
                              bad_index: String(bad_index),
                            },
                          });
                        }
                        setAnswersSent(false);
                      }}
                    >
                      <ButtonText>
                        {answers_sent ? "Dalej" : "Zadaj"}
                      </ButtonText>
                    </Button>
                  )}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </Center>
  );
};

export default QuizView;
