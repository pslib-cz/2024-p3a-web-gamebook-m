import { useNavigate } from "react-router-dom";
import '../StartPage.css';
const StartPage = () => {
    const navigate = useNavigate();

    return (
       
            <div className="start-page-container">
            <div className="start-page">
                <button className="buttonstart" onClick={() => navigate("/signin")}>
                    Přihlásit se a hrát
                </button>
                <button  className="buttonstart" onClick={() => navigate("/ChoosingCharacter")}>
                    Hrát anonymně
                </button>
            </div>
            </div>
    );
};

export default StartPage;
