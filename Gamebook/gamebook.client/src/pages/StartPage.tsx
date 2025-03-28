import { useNavigate } from "react-router-dom";
import styles from "../styles/StartPage.module.css"; // Importujeme CSS modul


import bgImage from "/img/BG_Start.avif";

const styles1 = {
  backgroundImage: `url(${bgImage})`,
};

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles1} className={styles.startPageContainer}>
      <div className={styles.startPage}>
        <button className={styles.buttonStart} onClick={() => navigate("/signin")}>
          Přihlásit se a hrát
        </button>
        <button className={styles.buttonStart} onClick={() => navigate("/choosingcharacter")}>
          Hrát anonymně
        </button>
      </div>
    </div>
  );
};

export default StartPage;
