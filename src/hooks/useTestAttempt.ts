import { useEffect, useState, useCallback, useRef } from "react";
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
  const { id: testId } = useParams<{ id: string }>();

  const attemptId = useAppSelector(selectAttemptId);
  const questions = useAppSelector(selectAttemptQuestions);
  const result = useAppSelector(selectTestResult);
  const loading = useAppSelector(selectAttemptLoading);
  const timeLimit = useAppSelector(selectAttemptTimeLimit);

  const [answers, setAnswers] = useState<AnswersMap>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Установить ответ на вопрос
  const setAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  // Завершить тест и отправить ответы
  const handleSubmit = useCallback(() => {
    if (!testId || !attemptId || isSubmitting) return;

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
  }, [dispatch, testId, attemptId, answers, isSubmitting]);

  // Создание попытки при загрузке страницы
  useEffect(() => {
    if (testId) {
      dispatch(fetchCreateTestAttempt(testId));
    }
  }, [dispatch, testId]);

  // Инициализация таймера
  useEffect(() => {
    const shouldStartTimer =
      attemptId && questions.length > 0 && timeLimit > 0 && !result;

    if (shouldStartTimer) {
      setTimeLeft(timeLimit * 60);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [attemptId, timeLimit, questions.length, result, handleSubmit]);

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
