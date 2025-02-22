import api from "../api";

export const fetchUserCourseCompletion = async () => {
  try {
    const response = await api.get("/user/completion/"); // Django endpoint
    console.log(response.data);
    return response.data; // Zoznam kurzov a percentá dokončenia
  } catch (error) {
    console.error("Error fetching course completion data:", error);
    throw error;
  }
};
