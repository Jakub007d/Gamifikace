import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { CourseCompletion } from "../props";
import * as Progress from "react-native-progress";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { B } from "@expo/html-elements";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface CourseInfoCardProps {
  course_id: string;
  name: string;
  description: string;
  short_descripstion: string;
  grade: string;
  user_name: string;
  compleated_list: CourseCompletion[];
}
//TODO ZMEN V BACKENDE NA ID NIE NA NAME !!!!!
function CourseItem(props: CourseInfoCardProps) {
  const courseCompletion = props.compleated_list.find(
    (item) => item.course === props.name
  );

  const completionPercentage = courseCompletion?.completion_percentage ?? 0;
  console.log("Completion Percentage:", completionPercentage);
  return (
    <>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/courses/course_detail/[id]",
            params: {
              id: props.course_id,
              name: props.name,
              user_name: props.user_name,
            },
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white", // bg-white
            borderRadius: 8, // rounded-lg
            padding: 16, // p-4
            marginBottom: 16, // mb-4
          }}
        >
          <Box>
            <Text className="text-3xl font-bold flex-1">{props.name}</Text>
          </Box>

          <VStack className="flex-1 items-start">
            <Text className="text-md">{props.short_descripstion}</Text>
            <Text className="text-sm">{props.grade}</Text>
          </VStack>
          <Box className="flex-1 items-end">
            <AnimatedCircularProgress
              size={50}
              width={5}
              fill={completionPercentage} // Percento dokončenia (0 až 100)
              tintColor="#000000"
              backgroundColor="#D3D3D3"
              rotation={0}
            >
              {(fill) => <Text>{`${Math.round(fill)}%`}</Text>}
            </AnimatedCircularProgress>
          </Box>
        </View>
      </Pressable>
    </>
  );
}

export default CourseItem;
