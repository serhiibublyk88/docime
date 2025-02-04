import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../../redux/authSlice";
import styles from "./Header.module.css";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); 
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <Navbar
      className={`${styles.header} px-3 shadow-sm`}
      fixed="top"
      bg="dark"
      variant="dark"
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center px-4"
      >
        <Navbar.Brand as={Link} to="/" className={styles.logo}>
          DOKIME
        </Navbar.Brand>

        <div className={styles.rightSection}>
          {user ? (
            <div className={styles.userInfo}>
              <FaUserCircle className={styles.userIcon} />
              <span className={styles.userName}>{user.username}</span>
              <FaSignOutAlt
                className={styles.logoutIcon}
                onClick={handleLogout}
                title="Abmelden"
              />
            </div>
          ) : (
            !isLoginPage && (
              <Button
                variant="outline-light"
                onClick={() => navigate("/login")}
                className={styles.loginButton}
              >
                Anmelden
              </Button>
            )
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
