import { useNavigate } from "react-router-dom";
import styles from "../styles/StartPage.module.css"; // Importujeme CSS modul

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.startPageContainer}>
      <div className={styles.startPage}>
        <button className={styles.buttonStart} onClick={() => navigate("/signin")}>
          Přihlásit se a hrát
        </button>
        <button className={styles.buttonStart} onClick={() => navigate("/ChoosingCharacter")}>
          Hrát anonymně
        </button>
      </div>
    </div>
  );
};

export default StartPage;
