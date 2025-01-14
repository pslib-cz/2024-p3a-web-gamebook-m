import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/common";
import useAuth from "../hooks/useAuth";
import { SET_TOKEN } from "../providers/authProvider";
import styles from "../styles/SignPage.module.css";

const SignInPage = () => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Sending login request with", email, password); // Debugging
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Přihlášení nebylo úspěšné");

      const data = await response.json();
      console.log("Received data from API:", data); // Debugging

      if (data.username && data.accessToken) {
        // Uložení uživatelského jména do localStorage
        localStorage.setItem("username", data.username);
        dispatch({ type: SET_TOKEN, token: data.accessToken });
        navigate("/choosingcharacter");
      } else {
        throw new Error("Chybí uživatelské jméno nebo token.");
      }
    } catch (error) {
      console.error("Login error:", error); // Debugging error
      setError(error instanceof Error ? error : new Error("Chyba přihlášení"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signbg}>
      <div className={styles.signContainer}>
        <h2 className={styles.registrace}>Přihlášení</h2>
        {error && <Alert message={error.message} type="error" />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const email = form.email.value;
            const password = form.password.value;
            console.log("Form submitted with", email, password); // Debugging
            loginUser(email, password);
          }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Heslo</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" disabled={loading}>
              Přihlásit
            </button>
          </div>
        </form>
        <button className={styles.signupButton} onClick={() => navigate("/signup")}>
          Registrovat se
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
