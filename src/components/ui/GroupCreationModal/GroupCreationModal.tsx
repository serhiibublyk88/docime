import React from "react";

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupCreationModal: React.FC<GroupCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      style={{
        display: "flex",
        position: "fixed",
        top: "60px", // Учитываем Header (60px)
        left: "0",
        width: "100%",
        height: "calc(100vh - 60px)", // Учитываем Header (60px)
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050, // Bootstrap модалки используют 1050
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content p-4">
          <h2 className="mb-3 text-center">Введите имя новой группы</h2>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Название группы"
          />
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={() => alert("Группа создана!")}
            >
              Сохранить
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
