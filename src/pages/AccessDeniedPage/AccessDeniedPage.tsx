import { Link } from "react-router-dom";

export const AccessDeniedPage = () => {
  return (
    <div className="main-content">
      <h1 className="display-4 text-danger">403 - Zugriff verweigert</h1>
      <p className="fs-5 mb-4">
        Sie haben keine Berechtigung, auf diese Seite zuzugreifen.
      </p>
      <Link
        to="/"
        className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold fs-4"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
};
