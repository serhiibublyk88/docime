import { AlertMessageProps } from "../../../types/uiTypes"; 
export const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = "danger",
  onClose,
  zIndex = 1045,
}) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} shadow-sm`}
      style={{
        position: "fixed",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "350px",
        zIndex,
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-between align-items-start">
        <span className="me-1">{message}</span>
        {onClose && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
          />
        )}
      </div>
    </div>
  );
};
