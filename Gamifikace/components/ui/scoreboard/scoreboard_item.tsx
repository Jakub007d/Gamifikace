import { View, StyleSheet, Button } from "react-native";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import getInitials from "@/func/getInitials";
interface ScoreboardItem {
  score: number;
  user_name: string;
  user_id: string;
  current_user: string;
  possition: string;
}
const ScoreboardItem = (props: ScoreboardItem) => {
  return (
    //TODO Fix focus
    <Box
      className={`bg-white w-full rounded-lg p-4 mb-4 ${
        props.current_user == props.user_id ? "border border-black" : ""
      }`}
    >
      <HStack space="md" className="items-center justify-start">
        <Text>{props.possition}</Text>
        <Avatar size="md">
          <Text size="lg" className="text-white">
            {getInitials(props.user_name)}
          </Text>
        </Avatar>
        <Text size="lg">{props.user_name}</Text>
        <Text size="lg" bold={true} className="ml-auto">
          {props.score} b
        </Text>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  score_item: {
    width: "80%",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between", // Vertikálne vycentrovanie
    alignItems: "center", // Horizontálne vycentrovanie
  },
});
export default ScoreboardItem;
