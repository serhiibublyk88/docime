import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="main-content">
      <h1 className="display-4 text-danger">404 - Seite nicht gefunden</h1>
      <p className="fs-5 mb-4">Die Seite, die Sie suchen, existiert nicht.</p>
      <Link
        to="/"
        className="link-light link-offset-3 link-underline-opacity-25 link-underline-opacity-100-hover fw-bold fs-4"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
};
