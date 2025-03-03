import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Answer, Question } from "@/constants/props";
let refresh = false;
axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      console.log(localStorage.getItem("refresh_token"));
      const response = await axios.post(
        API_URL + "/token/refresh/",
        {
          refresh: localStorage.getItem("refresh_token"),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        axios.defaults.headers.common["Authorization"] = `Bearer 
        ${response.data["access"]}`;
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        return axios(error.config);
      }
    }
    refresh = false;
    return error;
  }
);
async function retrieveAccessToken(): Promise<string> {
  const accessToken = await AsyncStorage.getItem("user_id");
  return accessToken!;
}
/**
 *
 * Funkcia postQuestionWithAnswers nahrá novo vytvorené otázky aj s odpovedami na backend.
 * @param {boolean} props.is_text_question - Určuje či sa jedná o textovú otázku.
 * @param {string} props.question_name - Meno otázky.
 * @param {string} props.question_text - Text otázky.
 * @param {string} props.question_okruh - Okruh otázky.
 * @param {Answer[]} props.answers - Pole odpovedí.
 */
async function postQuestionWithAnswers(
  is_text_question: boolean,
  question_name: string,
  question_text: string,
  question_okruh: string,
  answers: Answer[]
) {
  // Function to retrieve the access token from AsyncStorage
  var today = new Date();

  retrieveAccessToken().then(async (user_id: string) => {
    const question: Question = {
      id: "",
      approved: false,
      created_at: today,
      created_by: user_id,
      is_text_question: is_text_question,
      likes: 0,
      name: question_name,
      okruh: question_okruh,
      text: question_text,
      visible: true,
    }; // Create the POST requuest
    const { data } = await axios.post(API_URL + "/newQuestion/", question, {
      headers: { "Content-Type": "application/json" },
    });
    // Initialize the access & refresh token in localstorage.
    for (let answer of answers) {
      answer.question = data;
    }
    await axios.post(API_URL + "/newAnswers/", answers, {
      headers: { "Content-Type": "application/json" },
    });
  });
}

export default postQuestionWithAnswers;
