import { useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions, selectUser } from "../../../redux";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";
import { Tooltip } from "bootstrap";
import { HeaderProps } from "../../../types/uiTypes"; // ✅ Используем `HeaderProps` из `uiTypes.ts`

export const Header = ({
  onLeftMenuToggle,
  onRightMenuToggle,
  children,
}: HeaderProps) => {
  const user = useSelector(selectUser); // ✅ Убрали `RootState`
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      Tooltip.getInstance(el)?.dispose();
      new Tooltip(el);
    });

    return () => {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
        Tooltip.getInstance(el)?.dispose();
      });
    };
  }, [user?.role]); // ✅ Добавили очистку Tooltip для предотвращения утечек памяти

  const handleNavigation = (path: string, action?: () => void) => {
    document
      .querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((el) => Tooltip.getInstance(el)?.hide());
    if (action) action();
    navigate(path);
  };

  return (
    <Navbar
      className="px-3 shadow"
      fixed="top"
      bg="dark"
      variant="dark"
      style={{ height: "60px" }}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center px-4"
      >
        {onLeftMenuToggle && (
          <button className="btn" onClick={onLeftMenuToggle}>
            <FaBars className="icon" />
          </button>
        )}

        <Navbar.Brand as={Link} to="/" className="mx-md-3 ps-3">
          DOKIME
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          {children}

          {onRightMenuToggle && (
            <button className="btn" onClick={onRightMenuToggle}>
              <FaBars className="icon" />
            </button>
          )}

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <FaUserCircle className="icon" />
              <span className="fw">{user.username}</span>
              <button
                className="btn"
                data-bs-toggle="tooltip"
                title="Abmelden"
                onClick={() =>
                  handleNavigation("/", () => dispatch(authActions.logout()))
                }
              >
                <FaSignOutAlt className="icon" />
              </button>
            </div>
          ) : (
            <button
              className="btn"
              data-bs-toggle="tooltip"
              title="Anmelden"
              onClick={() => handleNavigation("/login")}
            >
              <FaSignInAlt className="icon" />
            </button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};
