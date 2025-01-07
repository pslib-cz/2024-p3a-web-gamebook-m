import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components/common";
import '../signup.css';


const SignUpPage = () => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const registerUser = async (username: string, email: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch("/api/Users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: username, email, password }),
            });
            if (!response.ok) {
                throw new Error("Registrace nebyla úspěšná");
            }
            // Přesměrování na FrontPage po úspěšné registraci
            navigate("/choosingcharacter");
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            } else {
                setError(new Error("Registrace nebyla úspěšná"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signupbg">
            <div className="signup-container">
        <h2 className="registrace"> ZALOŽTE SI ÚČET</h2>         
           {error && <Alert message={error.message} type="error" />}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.target as HTMLFormElement;
                    const username = form.username.value;
                    const email = form.email.value;
                    const password = form.password.value;
                    registerUser(username, email, password);
                }}
            >
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-group">
                <button  type="submit" disabled={loading}>
                    Registrovat
                </button>
                </div>

            </form>
        </div>
        </div>

    );
};

export default SignUpPage;
