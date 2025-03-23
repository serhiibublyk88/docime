// src/hooks/useTestAttempt.ts
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchCreateTestAttempt,
  fetchSubmitTestAttempt,
} from "../redux/testAttempt/testAttemptActions";
import {
  selectAttemptId,
  selectAttemptLoading,
  selectAttemptQuestions,
  selectTestResult,
  selectAttemptTimeLimit,
} from "../redux";

type AnswersMap = Record<string, string | string[]>;

export const useTestAttempt = () => {
  const dispatch = useAppDispatch();
  const { testId } = useParams<{ testId: string }>();

  const attemptId = useAppSelector(selectAttemptId);
  const questions = useAppSelector(selectAttemptQuestions);
  const result = useAppSelector(selectTestResult);
  const loading = useAppSelector(selectAttemptLoading);
  const timeLimit = useAppSelector(selectAttemptTimeLimit);

  const [answers, setAnswers] = useState<AnswersMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Установить ответ
  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    []
  );

  // Завершить тест
  const handleSubmit = useCallback(() => {
    if (!testId || !attemptId) return;

    setIsSubmitting(true);

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    dispatch(
      fetchSubmitTestAttempt({ testId, attemptId, answers: formattedAnswers })
    )
      .unwrap()
      .finally(() => setIsSubmitting(false));
  }, [dispatch, testId, attemptId, answers]);

  // Создание попытки
  useEffect(() => {
    if (testId) {
      dispatch(fetchCreateTestAttempt(testId));
    }
  }, [dispatch, testId]);

  // Инициализация и запуск таймера
  useEffect(() => {
    if (!timeLimit || result) return;

    setTimeLeft(timeLimit * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, result, handleSubmit]);

  return {
    attemptId,
    questions,
    answers,
    setAnswer,
    submit: handleSubmit,
    loading,
    result,
    timeLeft,
    isTimeUp,
    isSubmitting,
  };
};
