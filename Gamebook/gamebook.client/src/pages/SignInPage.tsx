import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/common";
import useAuth from "../hooks/useAuth";
import { SET_TOKEN } from "../providers/authProvider";
import '../signin.css';

const SignInPage = () => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const loginUser = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch("/api/account/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error("Přihlášení nebylo úspěšné");
            const data = await response.json();
            dispatch({ type: SET_TOKEN, token: data.accessToken });
            navigate("/choosingcharacter");
        } catch (error) {
            setError(error instanceof Error ? error : new Error("Chyba přihlášení"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signinbg">
        <div className="signin-container">
            <h2 className="registrace">Přihlášení</h2> {/* Use the same heading class */}
            {error && <Alert message={error.message} type="error" />}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    loginUser(form.email.value, form.password.value);
                }}
            >
                <div className="form-group"> {/* Use form-group for styling */}
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-group"> {/* Wrap the button in a form-group */}
                    <button type="submit" disabled={loading}>
                        Přihlásit
                    </button>
                </div>
            </form>
            <button onClick={() => navigate("/signup")}>Registrovat se</button>
        </div>
    </div>
);
};

export default SignInPage;
