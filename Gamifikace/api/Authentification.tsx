import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import fetchUserID from "./Downloaders/fetchUserID";
interface User {
  username: string;
  password: string;
}

interface TokenResponse {
  access: string; // Change based on your API response
  refresh: string; // Change based on your API response
}
export async function Authentification(user: User): Promise<boolean> {
  console.log("Logovanie");
  try {
    const response = await axios.post("https://gamifikace.lol/token/", user, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });

    // Clear stored tokens
    {
      /*
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        await AsyncStorage.removeItem("user_id");
      */
    }

    // Store tokens using AsyncStorage
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.setItem("access_token", response.data.access);
    console.log(response.data.access);
    await AsyncStorage.setItem("refresh_token", response.data.refresh);
    const userID = await fetchUserID(response.data.access);
    await AsyncStorage.setItem("user_id", userID);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    return true;
  } catch (error) {
    return false;
  }
}
