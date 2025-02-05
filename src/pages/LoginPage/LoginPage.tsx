import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import { authActions } from "../../redux"; 
import { roles } from "../../constants"; 
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
      
      const user = await authApi.login(email, password);

      
      if (!user) {
        throw new Error("Fehler: Benutzerdaten fehlen.");
      }

      
      dispatch(authActions.login({ user }));

      
      switch (user.role) {
        case roles.USER:
          navigate("/tests", { replace: true });
          break;
        case roles.TEST_CREATOR:
          navigate("/admin/groups", { replace: true });
          break;
        default:
          setError("Unbekannte Rolle. Bitte wenden Sie sich an den Support.");
      }
    } catch {
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
