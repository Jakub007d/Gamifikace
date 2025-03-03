import { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface StudyCardWindowInterface {
  question: string;
  answer: string | string[];
  answer_shown: boolean;
  setShown: () => void;
}

const StudyCardWindow = (props: StudyCardWindowInterface) => {
  return (
    <Pressable onPress={() => props.setShown()}>
      <Box className="bg-gray-200 p-4 rounded-lg w-9/10 mx-auto min-w-[90%] min-h-[90%] mt-5 flex items-center justify-center">
        {props.answer_shown && (
          <View>
            {Array.isArray(props.answer) ? (
              props.answer.map((ans, index) => (
                <Text size="xl" key={index} style={{ paddingBottom: 10 }}>
                  {index + 1}) {ans}
                </Text>
              ))
            ) : (
              <Text size="xl">{props.answer}</Text>
            )}
          </View>
        )}

        {!props.answer_shown && <Text size="xl">{props.question}</Text>}
      </Box>
    </Pressable>
  );
};

export default StudyCardWindow;
const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    padding: 10,
    justifyContent: "center", // Vertikálne vycentrovanie
    alignItems: "center", // Horizontálne vycentrovanie
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "gray",
  },
});
