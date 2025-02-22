import { MaterialIcons } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useToast, Toast } from "@/components/ui/toast";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Authentification } from "../api/Authentification";
import { router } from "expo-router";
import { Input, InputField, InputSlot } from "@/components/ui/input";
interface User {
  username: string;
  password: string;
}

interface TokenResponse {
  access: string; // Change based on your API response
  refresh: string; // Change based on your API response
}

const login = () => {
  const toast = useToast();
  const [show, setShow] = React.useState(false);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Heslo123123!");
  const [isTokenSet, setIsTokenSet] = useState(false); // Track if token is set
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setIsTokenSet(true);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    checkToken();
  }, []);
  async function handleLogin(user: User) {
    setLoading(true);
    try {
      const result = await Authentification(user);

      if (result) {
        router.push({
          pathname: "/courses/[user_id]",
          params: { user_id: username },
        });
      } else {
        setLoading(false);
        toast.show({ description: "Zle zadané údaje" });
      }
    } catch (error) {
      setLoading(false);
      toast.show({ description: "Chyba prihlásenia" });
    }
  }
  return (
    <Center className="flex flex-1 bg-white">
      <VStack className="space-y-4 w-full items-center">
        {/* Username Input */}
        <Input className="border border-gray-300 rounded-lg px-3 py-2 w-4/5">
          <InputSlot className="pl-3">
            <Icon
              as={MaterialIcons}
              name="person"
              size="md"
              className="text-gray-500"
            />
          </InputSlot>
          <InputField
            placeholder="Meno"
            value={username}
            onChangeText={setUsername}
            className="text-base text-gray-700 flex-1"
          />
        </Input>

        {/* Password Input */}
        <Input className="border border-gray-300 rounded-lg px-3 py-2 w-4/5">
          <InputField
            placeholder="Heslo"
            type={show ? "text" : "password"}
            value={password}
            onChangeText={setPassword}
            className="text-base text-gray-700 flex-1"
          />
          <InputSlot className="pr-3">
            <Pressable onPress={() => setShow(!show)}>
              <Icon
                as={MaterialIcons}
                name={show ? "visibility" : "visibility-off"}
                size="md"
                className="text-gray-500"
              />
            </Pressable>
          </InputSlot>
        </Input>

        {/* Login Button */}
        {isLoading ? (
          <Spinner className="text-blue-500" />
        ) : (
          <Button
            className="bg-blue-500 rounded-lg w-4/5 h-14"
            onPress={() => handleLogin({ username, password })}
          >
            <ButtonText className="text-white text-lg font-semibold">
              Prihlásiť sa
            </ButtonText>
          </Button>
        )}
      </VStack>
    </Center>
  );
};
export default login;
