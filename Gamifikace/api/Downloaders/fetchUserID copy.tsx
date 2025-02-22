import { API_URL } from "../constants";
import axios from "axios";
//Funkcia pre získanie ID užívateľa
async function fetchUserID(access_token: String): Promise<string> {
  try {
    const { data } = await axios.post(API_URL + "/userID/", {
      access_token: access_token,
    });
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return "ERR";
  }
}
export default fetchUserID;
