import React, { useState } from "react";
import "../styles/Dice.modul.css";

interface DiceProps {
  onRoll?: (result: number) => void; // Callback pro vrácení výsledku
  canRoll?: boolean; // Určuje, jestli je hod kostkou povolen
}

const Dice: React.FC<DiceProps> = ({ onRoll, canRoll = true }) => {
  const [side, setSide] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (!canRoll || rolling) return; // Kontrola, jestli je povolené házet nebo animace běží

    const result = Math.floor(Math.random() * 6) + 1; // Náhodný výsledek
    setRolling(true);
    setSide(result);

    setTimeout(() => {
      setRolling(false);
      if (onRoll) {
        onRoll(result); // Vrácení výsledku pomocí callbacku
      }
    }, 1500); // Doba trvání animace
  };

  return (
    <div>
      <div
        id="dice"
        data-side={side}
        className={rolling ? "reRoll" : ""}
        onClick={rollDice}
        style={{ cursor: canRoll && !rolling ? "pointer" : "not-allowed" }} // Dynamický styl kurzoru
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`sides side-${i + 1}`}>
            {[...Array(i + 1)].map((_, j) => (
              <span key={j} className={`dot dot-${j + 1}`}></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dice;
