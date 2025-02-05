import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CreatorPasswordModal } from "../../components";
import { authApi, groupApi } from "../../services/api"; 
import { authActions } from "../../redux"; 
import { roles } from "../../constants"; 
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [role, setRole] = useState<number>(roles.USER);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.search.includes("role=creator")) {
      setRole(roles.TEST_CREATOR);
      setShowCreatorModal(true);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupApi.getGroups();
        setGroups(data);
      } catch {
        setError("Fehler beim Laden der Gruppen.");
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      const user = await authApi.registerUser({
        username,
        email,
        password,
        role,
        groupId: role === roles.USER ? groupId : null,
      });

      dispatch(authActions.login({ user }));

      if (user.role === roles.USER) {
        navigate("/tests");
      } else if (user.role === roles.TEST_CREATOR) {
        navigate("/admin/groups");
      }
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const handleCreatorSignup = () => {
    navigate("/register?role=creator");
  };

  const handleCreatorSuccess = () => {
    setShowCreatorModal(false);
  };

  return (
    <div className={styles.container}>
      <h2>Registrieren</h2>

      {showCreatorModal && (
        <CreatorPasswordModal
          onSuccess={handleCreatorSuccess}
          onClose={() => setShowCreatorModal(false)}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <label>Benutzername:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>E-Mail:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Passwort:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Passwort bestätigen:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {role === roles.USER && (
          <>
            <label>Gruppe:</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
            >
              <option value="">Gruppe auswählen</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </>
        )}

        <button type="submit" className={styles.submitButton}>
          Registrieren
        </button>

        {role === roles.USER && (
          <p className={styles.creatorSignup}>
            Als Testersteller registrieren?{" "}
            <span className={styles.creatorLink} onClick={handleCreatorSignup}>
              Hier klicken
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
