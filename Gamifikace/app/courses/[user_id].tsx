import CourseItem from "./components/course_item";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useEffect, useLayoutEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course } from "../../constants/props";
import { Text } from "@/components/ui/text";
import { Avatar } from "@/components/ui/avatar";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetIcon,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { Icon, EditIcon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import fetchCourseByID from "@/api/Downloaders/fetchCourseByID";
import fetchCourses from "@/api/Downloaders/fetchAllCourses";
import getInitials from "@/func/getInitials";
import fetchUserName from "@/api/Downloaders/userNameDownloader";
import { fetchUserCourseCompletion } from "@/api/Downloaders/lectureCompleationDownloader";
const HomePage = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [user_id, setUserID] = useState<string>(""); // State for access token
  const [isOpen, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [visitedCoursesIds, setVisitedCoursesIds] = useState<string[]>([]);

  // Function to retrieve the access token from AsyncStorage
  const retrieveUserID = async () => {
    const userID = await AsyncStorage.getItem("user_id");
    setUserID(String(userID));
  };

  // Use effect to retrieve the access token when the component mounts
  useEffect(() => {
    retrieveUserID();
  }, []);
  const { status: usernStatus, data: user } = useQuery({
    queryKey: ["user"],
    enabled: !!user_id,
    queryFn: () => fetchUserName(user_id!),
  });
  const { status: allCoursesStatus, data: allCourses } = useQuery({
    queryKey: ["allCourses"],
    enabled: !!user_id,
    queryFn: () => fetchCourses(),
  });
  const { status: course_status, data: courses } = useQuery({
    queryKey: ["userCourses"],
    enabled: !!user_id,
    queryFn: () => fetchCourseByID(user_id!),
  });
  const { status: compleated, data: compleated_list } = useQuery({
    queryKey: ["compleated"],
    queryFn: () => fetchUserCourseCompletion(),
  });
  useEffect(() => {
    navigation.setOptions({
      title: "Navštevované predmety",
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {usernStatus === "success" && (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/user/userProfile",
                  params: { user_id: user[0].id, user_name: user[0].username },
                });
              }}
            >
              <Avatar size="md">
                <Text size="lg" className="text-white">
                  {getInitials(String(user![0].username))}
                </Text>
              </Avatar>
            </Pressable>
          )}
          {/* Tlačidlo + */}
          <Button
            className="bg-white"
            onPress={() => {
              setOpen(true);
            }}
          >
            <ButtonText size="xl" className="text-black">
              +
            </ButtonText>
          </Button>
        </View>
      ),
    });
  }, [navigation, usernStatus]);
  useEffect(() => {
    if (course_status === "success" && courses) {
      const ids = courses.map((course) => course.id); // Extractovanie id navstevovaných kurzov
      setVisitedCoursesIds(ids);
      setSelectedItems(ids);
    }
  }, [course_status, courses]);
  const toggleSelection = (item: string) => {
    setSelectedItems((prevSelected: string[]) => {
      if (prevSelected.includes(item)) {
        removeVisitedCourse(user_id!, item, queryClient);
        return prevSelected.filter((i) => i !== item);
      } else {
        uploadVisitedCourse(user_id!, item, queryClient);
        return [...prevSelected, item];
      }
    });
  };

  return (
    <View>
      <Actionsheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <ActionsheetContent>
          <Text size="xl" bold={true}>
            Vyberte predmety
          </Text>

          <ScrollView style={{ maxHeight: 300, width: "100%" }}>
            <VStack space="md">
              {allCourses?.map((item) => (
                <HStack
                  key={item.id}
                  px="$4"
                  py="$2"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  borderBottomWidth={1}
                  borderColor="$gray300"
                >
                  {/* Zarovnanie názvu predmetu doľava */}
                  <Text size="md">{item.name}</Text>

                  {/* Checkbox na pravej strane bez duplicitného názvu */}
                  <Checkbox
                    value={item.id}
                    isChecked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    aria-label={`Select ${item.name}`}
                  >
                    <CheckboxIndicator>
                      <Icon as={Check} size="md" color="white" />
                    </CheckboxIndicator>
                  </Checkbox>
                </HStack>
              ))}
            </VStack>
          </ScrollView>

          <Button onPress={() => setOpen(false)}>
            <ButtonText>Uložiť výber</ButtonText>
          </Button>
        </ActionsheetContent>
      </Actionsheet>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {!!user_id &&
          course_status === "success" &&
          allCoursesStatus === "success" &&
          compleated == "success" &&
          courses!.map((course: Course) => (
            <CourseItem
              key={course.id}
              course_id={course.id}
              description={course.full_name}
              name={course.name}
              grade="TBA"
              short_descripstion={course.full_name}
              user_name={String(user![0].username)}
              compleated_list={compleated_list}
            ></CourseItem>
          ))}
        {/* Display the access token retrieved from AsyncStorage */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
  },
  rightColumn: {
    flex: 2,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default HomePage;
function removeVisitedCourse(
  arg0: string,
  item: string,
  queryClient: QueryClient
) {
  throw new Error("Function not implemented.");
}

function uploadVisitedCourse(
  arg0: string,
  item: string,
  queryClient: QueryClient
) {
  throw new Error("Function not implemented.");
}
