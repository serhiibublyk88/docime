import { useState } from "react";
import { ListGroup, Image } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { QuestionModal } from "../QuestionModal/QuestionModal"; // ✅ Подключаем модалку
import { Question, Answer } from "../../../types/reduxTypes";
import styles from "../ItemList/ItemList.module.css"; // ✅ Используем стили `ItemList`

interface QuestionListProps {
  questions: Question[];
  onSave: (id: string, updatedQuestion: Question) => void;
  onDelete: (id: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // 🔹 Открываем модалку с редактируемым вопросом
  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  // 🔹 Сохраняем изменения и закрываем модалку
  const handleSave = (updatedQuestion: Omit<Question, "id">) => {
    if (editingQuestion) {
      onSave(editingQuestion.id, {
        ...updatedQuestion,
        id: editingQuestion.id,
      }); // ✅ Добавляем `id`
      setIsEditing(false);
      setEditingQuestion(null);
    }
  };

  return (
    <>
      <ListGroup className={styles.listGroup}>
        {questions.map((question, index) => (
          <ListGroup.Item
            key={question.id}
            className={`list-group-item-action border-0 fs-5 ${styles.item}`}
          >
            {/* 🔹 Верхний блок: текст вопроса + иконки справа */}
            <div className="d-flex align-items-center">
              <span className={`flex-grow-1 ${styles.questionText}`}>
                {index + 1}. {question.text}
              </span>
              <div className={`d-flex ms-auto ${styles.iconContainer}`}>
                <FaEdit
                  className={`${styles.icon} ${styles.editIcon}`}
                  title="Bearbeiten"
                  onClick={() => handleEdit(question)}
                />
                <FaTrash
                  className={`${styles.icon} ${styles.deleteIcon}`}
                  title="Löschen"
                  onClick={() => onDelete(question.id)}
                />
              </div>
            </div>

            {/* 🔹 Изображение вопроса (если есть) */}
            {question.image && (
              <Image
                src={
                  typeof question.image === "string"
                    ? question.image
                    : URL.createObjectURL(question.image)
                }
                className="mt-2"
                fluid
              />
            )}

            {/* 🔹 Список ответов (если есть) */}
            {question.answers.length > 0 && (
              <div className="mt-2">
                <ul className="list-unstyled ms-3 mt-1">
                  {question.answers.map((answer: Answer, ansIndex: number) => (
                    <li key={ansIndex} className="d-flex align-items-center">
                      <span>
                        - {answer.text}{" "}
                        {answer.score > 0 ? `(${answer.score} Punkte)` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* 🔹 Модалка редактирования вопроса */}
      {isEditing && editingQuestion && (
        <QuestionModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave} // ✅ Передаём `Omit<Question, "id">`
          type={editingQuestion.type}
          initialData={editingQuestion} // ✅ Передаём существующие данные
        />
      )}
    </>
  );
};
