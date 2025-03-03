// context/DataContext.tsx

import { Answer } from "@/constants/props";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface AnswerContentType {
  answers: Answer[];
  addAnswer: (answer: Answer, pos?: number) => void; // Optional `pos`
}

// Initialize the context with an empty object
const DataContext = createContext<AnswerContentType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Function to add a single answer to the array
  const addAnswer = (answer: Answer, pos?: number) => {
    if (pos === undefined) {
      // If `pos` is undefined or out of range, add to the end
      setAnswers((prevAnswers) => [...prevAnswers, answer]);
    } else {
      // Create a new array with the answer inserted at the specified position
      if (answers.length < 2) setAnswers([answer]);
      else if (answers.length == 2) {
        if (pos == 0) {
          setAnswers([answer, answers[1]]);
        } else {
          setAnswers([answers[0], answer]);
        }
      } else {
        var leftSide = answers.slice(0, pos);
        var rightSide = answers.slice(pos + 1);
        setAnswers([...leftSide, answer, ...rightSide]);
      }
    }
  };

  return (
    <DataContext.Provider value={{ answers, addAnswer }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
