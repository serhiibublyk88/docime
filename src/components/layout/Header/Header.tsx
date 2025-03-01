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
import { HeaderProps } from "../../../types/uiTypes";

export const Header: React.FC<HeaderProps> = ({
  onLeftMenuToggle,
  onRightMenuToggle,
  shouldShowBurgers,
  shouldShowRightBurger,
}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach((el) => {
      Tooltip.getInstance(el)?.dispose();
      new Tooltip(el);
    });

    return () => {
      tooltips.forEach((el) => Tooltip.getInstance(el)?.dispose());
    };
  }, [user?.role]);

  const handleNavigation = (path: string, action?: () => void) => {
    document
      .querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((el) => Tooltip.getInstance(el)?.hide());
    if (action) action();
    navigate(path);
  };

  return (
    <Navbar
      className="px-3 shadow position-fixed top-0 start-0 w-100"
      fixed="top"
      bg="dark"
      variant="dark"
      style={{ height: "60px", zIndex: "1050" }}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center px-4"
      >
        {user && shouldShowBurgers && (
          <button
            className="btn position-absolute d-xl-none start-0 ms-1"
            data-menu-toggle="left"
            aria-label="Menu"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLeftMenuToggle?.(); // ✅ Проверяем существование перед вызовом
            }}
          >
            <FaBars className="icon" />
          </button>
        )}

        <Navbar.Brand as={Link} to="/" className="ps-5">
          DOKIME
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          {user && shouldShowRightBurger && (
            <button
              className="btn position-absolute d-xl-none end-0 me-1"
              data-menu-toggle="right"
              aria-label="Context Menu"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRightMenuToggle?.(); // ✅ Проверяем существование перед вызовом
              }}
            >
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
