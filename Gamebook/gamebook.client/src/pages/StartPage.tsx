import { useNavigate } from "react-router-dom";

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Vítejte!</h1>
            <p>Vyberte si, jak chcete pokračovat:</p>
            <div>
                <button onClick={() => navigate("/signin")}>
                    Přihlásit se
                </button>
                <button onClick={() => navigate("/ChoosingCharacter")}>
                    Hrát anonymně
                </button>
            </div>
        </div>
    );
};

export default StartPage;
