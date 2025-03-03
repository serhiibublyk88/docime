import { Spinner } from "react-bootstrap";
import { LoaderProps } from "../../../types/uiTypes";

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "light",
  centered = true,
  text = "",
}) => {
  const spinnerSize = size === "sm" ? "sm" : undefined;

  return centered ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Spinner animation="border" variant={variant} size={spinnerSize} />
      {text && <span className="ms-2">{text}</span>}
    </div>
  ) : (
    <div className="d-flex align-items-center">
      <Spinner animation="border" variant={variant} size={spinnerSize} />
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
};
