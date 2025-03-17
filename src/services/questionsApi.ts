import { api } from "./clientApi";
import { Question, Answer } from "../types/reduxTypes";

const API_URL = "/tests";

/// **Создание вопроса**
export const createQuestionApi = async (
  testId: string,
  questionData: Omit<Question, "id">
): Promise<Question> => {
  try {
    const formData = new FormData();
    formData.append("text", questionData.text);
    formData.append("type", questionData.type);

    if (questionData.image instanceof File) {
      formData.append("image", questionData.image);
    }

    formData.append("answers", JSON.stringify(questionData.answers));

    const response = await api.post<Question>(
      `${API_URL}/${testId}/questions`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Fehler beim Erstellen der Frage.");
  }
};

/// **Получение всех вопросов теста (фикс `populate("answers")`)**
export const fetchQuestionsApi = async (
  testId: string
): Promise<Question[]> => {
  try {
    const response = await api.get<Question[]>(
      `${API_URL}/${testId}/questions`
    );

    return response.data.map((question) => ({
      id: question.id,
      text: question.text,
      type: question.type,
      image: question.image || undefined,
      answers: question.answers.map((answer: Answer) => ({
        id: answer.id,
        text: answer.text,
        score: answer.score,
      })),
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Fehler beim Abrufen der Fragen.");
  }
};

/// **Обновление вопроса**
export const updateQuestionApi = async (
  testId: string,
  questionId: string,
  questionData: Omit<Question, "id">
): Promise<Question> => {
  try {
    const formData = new FormData();
    formData.append("text", questionData.text);
    formData.append("type", questionData.type);

    if (questionData.image instanceof File) {
      formData.append("image", questionData.image);
    }

    formData.append("answers", JSON.stringify(questionData.answers));

    const response = await api.put<Question>(
      `${API_URL}/${testId}/questions/${questionId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Fehler beim Aktualisieren der Frage.");
  }
};

/// **Удаление вопроса**
export const deleteQuestionApi = async (
  testId: string,
  questionId: string
): Promise<string> => {
  try {
    await api.delete(`${API_URL}/${testId}/questions/${questionId}`);
    return questionId;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Fehler beim Löschen der Frage.");
  }
};

/// **Добавление ответа (фикс: `text` и `score`)**
export const addAnswerApi = async (
  testId: string,
  questionId: string,
  answerData: { text: string; score: number }
): Promise<Answer> => {
  try {
    const response = await api.post<Answer>(
      `${API_URL}/${testId}/questions/${questionId}/answers`,
      answerData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw new Error("Fehler beim Hinzufügen der Antwort.");
  }
};

/// **Обновление ответа**
export const updateAnswerApi = async (
  testId: string,
  questionId: string,
  answerId: string,
  answerData: { text: string; score: number }
): Promise<Answer> => {
  try {
    const response = await api.patch<Answer>(
      `${API_URL}/${testId}/questions/${questionId}/answers/${answerId}`,
      answerData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating answer:", error);
    throw new Error("Fehler beim Aktualisieren der Antwort.");
  }
};

/// **Удаление ответа**
export const deleteAnswerApi = async (
  testId: string,
  questionId: string,
  answerId: string
): Promise<string> => {
  try {
    await api.delete(
      `${API_URL}/${testId}/questions/${questionId}/answers/${answerId}`
    );
    return answerId;
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw new Error("Fehler beim Löschen der Antwort.");
  }
};
