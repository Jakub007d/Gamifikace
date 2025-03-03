import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Progress from "react-native-progress";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { B } from "@expo/html-elements";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { CourseCompletion } from "@/constants/props";

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
  const getColorBasedOnPercentage = (percentage: number) => {
    let red, green, blue;

    if (percentage <= 50) {
      // Gradual transition from red to orange (0% to 50%)
      red = 255;
      green = Math.round(percentage * 5.1); // Gradually increases green
      blue = 0;
    } else {
      // Gradual transition from orange to green (50% to 100%)
      red = Math.round(255 - (percentage - 50) * 5.1); // Gradually decrease red
      green = 255;
      blue = 0;
    }

    return `rgb(${red}, ${green}, ${blue})`; // Return the interpolated color
  };

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
            pathname: "/courses/course_detail/[course_id]",
            params: {
              course_id: props.course_id,
              name: props.name,
              user_name: props.user_name,
            },
          })
        }
      >
        <Box className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <HStack className="justify-between items-center">
            <VStack className="space-y-2">
              <Text className="font-bold text-xl text-gray-800">
                {props.name}
              </Text>
              <Text className="text-gray-600">{props.short_descripstion}</Text>
              <Text className="text-gray-600">{props.grade}</Text>
            </VStack>
            <AnimatedCircularProgress
              size={50}
              width={5}
              fill={completionPercentage} // Percento dokončenia (0 až 100)
              tintColor={getColorBasedOnPercentage(completionPercentage)}
              backgroundColor="#D3D3D3"
              rotation={0}
            >
              {(fill) => <Text>{`${Math.round(fill)}%`}</Text>}
            </AnimatedCircularProgress>
          </HStack>
        </Box>
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
