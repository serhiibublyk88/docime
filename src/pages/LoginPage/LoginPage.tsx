import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/api";
import { login as loginAction } from "../../redux/authSlice";
import { TEST_CREATOR, USER } from "../../constants/roles";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Отправка запроса на логин
      const user = await loginApi(email, password);

      // Проверка наличия пользователя
      if (!user) {
        throw new Error("Ошибка: отсутствуют данные пользователя.");
      }

      // Сохранение пользователя в Redux Store
      dispatch(loginAction({ user }));

      // Редирект в зависимости от роли пользователя
      switch (user.role) {
        case USER:
          navigate("/tests", { replace: true });
          break;
        case TEST_CREATOR:
          navigate("/admin/groups", { replace: true });
          break;
        default:
          setError("Unbekannte Rolle. Bitte wenden Sie sich an den Support.");
      }
    } catch  {
      setError(
        "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut."
      );
    }
  };

  const handleSignup = () => {
    navigate("/register");
  };

  return (
    <div className={styles.container}>
      <h2>Anmelden</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="email">E-Mail:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Passwort:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.submitButton}>
          Anmelden
        </button>

        <button
          type="button"
          className={`${styles.submitButton} ${styles.signupButton}`}
          onClick={handleSignup}
        >
          Registrieren
        </button>

        <p className={styles.signupHint}>
          Noch kein Konto? Klicken Sie auf Registrieren
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
