// src/pages/RoomNavigate.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RoomNavigate.module.css";
import cedule from '/img/neco.png';
import Button from '../components/Button/Button.tsx';
import InventoryDisplay from "../components/Inventory";
import { API_BASE_URL } from "../api/apiConfig";
import FieldCardsDisplay from "../components/FieldsCardDisplay";

interface Field {
  fieldId: number;
  title: string;
  description: string;
  difficulty: number;
  numOfCards: number;
  diceRollResults: { [key: number]: string };
  imageId: number | null;
  enemyId: number | null;
}

interface Character {
  id: number;
  name: string;
  class: string;
  strength: number;
  will: number;
  pointsOfDestiny: number;
  backstory: string;
  ability: string;
  maxHP: number;
  maxDificulty: number;
  startingFieldId: number;
  imageId: number | null;
  username?: string;
}

const RoomNavigate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [fieldImage, setFieldImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [diceRollResult, setDiceRollResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoved, setIsMoved] = useState<boolean>(false);
  const [canRoll, setCanRoll] = useState<boolean>(true);
  const [fightResult, setFightResult] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isFighting, setIsFighting] = useState(false); // Track if we're in a fight
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentEnemy, setCurrentEnemy] = useState<{strength: number; will: number} | null>(null); // Store current enemy stats


  const startingFieldId = id ? parseInt(id, 10) : null;
  const characterInventoryId = 1;

    const fetchFieldImage = useCallback(async (imageId: number | null) => {
    if (!imageId) {
      setFieldImage(null);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/files/${imageId}`);
      if (!response.ok) {
        throw new Error("Nepodařilo se načíst obrázek.");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setFieldImage(imageUrl);
    } catch (err) {
      console.error("Chyba při načítání obrázku:", err);
      setFieldImage(null);
      setError("Nepodařilo se načíst obrázek.");
    }
  }, [API_BASE_URL]);

    // --- RESET FUNCTION ---
  const resetGame = () => {
    setGameOver(false);
    setFightResult(null);
     const initialHP = selectedCharacter?.maxHP || 10;
     localStorage.setItem("hp", initialHP.toString());
     if(startingFieldId)
        navigate(`/game/${startingFieldId}`);
    setIsFighting(false);
    setCurrentEnemy(null);
  };

    useEffect(() => {
     loadData();
     loadCharacter();
  }, [startingFieldId, navigate, fetchFieldImage, API_BASE_URL]);

  const loadData = async () => {
      if (!startingFieldId) {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/fields/${startingFieldId}`);
        if (!response.ok) {
          throw new Error("Nepodařilo se načíst pole.");
        }
        const fetchedField = (await response.json()) as Field;
        setField(fetchedField);
        if (fetchedField.imageId) {
          fetchFieldImage(fetchedField.imageId);
        } else {
          setFieldImage(null);
        }
        setIsMoved(false);
        setDiceRollResult(null);
        setCanRoll(true);
          setFightResult(null); // Reset fight result on room change

      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba při načítání pole.");
      } finally {
        setLoading(false);
      }
    };

    const loadCharacter = async () => {
      const storedCharacter = localStorage.getItem("selectedCharacter");
      const storedUsername = localStorage.getItem("username");
       const storedHp = localStorage.getItem("hp");

      if (storedCharacter) {
        const character = JSON.parse(storedCharacter) as Character;
        character.username = storedUsername || "Neznámé uživatelské jméno";
        setSelectedCharacter(character);

        if (storedHp && parseInt(storedHp, 10) <= 0) {
            setGameOver(true);
        }

      } else {
        setError("Žádná postava nebyla vybrána.");
      }
    };
 const handleFight = (enemyStrength: number, enemyWill: number, statToUse: "strength" | "will" = "strength") => {
        if (gameOver) return; // Prevent fighting if game over
        setIsFighting(true);
        setCurrentEnemy({ strength: enemyStrength, will: enemyWill }); // Store for later use
        //Initial fight logic
        continueFight(enemyStrength, enemyWill, statToUse);
    };
    const continueFight = (enemyStrength: number, enemyWill: number, statToUse: "strength" | "will" = "strength") => {
        if (gameOver || !isFighting) return; // Prevent fighting if game over or not fighting

        const playerStrength = parseInt(localStorage.getItem("strength") || "0", 10);
        const playerWill = parseInt(localStorage.getItem("will") || "0", 10);
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const enemyRoll = Math.floor(Math.random() * 6) + 1;
        const playerTotal = statToUse === "strength" ? playerStrength + playerRoll : playerWill + playerRoll;
        const enemyTotal = (statToUse === "strength" ? enemyStrength : enemyWill) + enemyRoll;

        let resultMessage = "";
        let damage = 0;

        if (playerTotal > enemyTotal) {
            damage = playerTotal - enemyTotal;
            resultMessage = `You win! (You: ${playerTotal}, Enemy: ${enemyTotal}).  You deal ${damage} damage!`;
            // TODO: Apply damage to the enemy (you'll need to track enemy HP)
        } else if (enemyTotal > playerTotal) {
            damage = enemyTotal - playerTotal;
            resultMessage = `You lose! (You: ${playerTotal}, Enemy: ${enemyTotal}). You take ${damage} damage!`;
            let currentHp = parseInt(localStorage.getItem("hp") || "0", 10);
            currentHp = Math.max(0, currentHp - damage);
            localStorage.setItem("hp", currentHp.toString());

            if (currentHp <= 0) {
                setGameOver(true);
                 setIsFighting(false);
                return; // Exit if game over
            }
        } else {
            resultMessage = `It's a draw! (You: ${playerTotal}, Enemy: ${enemyTotal})`;
        }

        setFightResult(resultMessage);
    };

  const handleFilterAndMove = async () => {
     if (gameOver || !canRoll) return;

    setIsRolling(true);
    setCanRoll(false);

    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      setDiceRollResult(randomNumber);
      setIsRolling(false);
    }, 3000);
  };

  const handleMove = async (direction: "left" | "right") => {
    if (gameOver || !field || diceRollResult === null) return;

        try {
      const response = await fetch(`${API_BASE_URL}/fields`);
      if (!response.ok) {
        throw new Error("Nepodařilo se načíst pole.");
      }

      const data = await response.json();
      let allFields: Field[] = [];
      console.log(allFields);

      if (Array.isArray(data)) {
        allFields = data;
      } else if (typeof data === 'object' && data !== null) {
        const possibleFields = Object.values(data).find(Array.isArray);
        if (possibleFields) {
          allFields = possibleFields as Field[];
        } else {
          throw new Error("Nepodařilo se najít pole v datech.");
        }
      }

      const difficulty1Fields = allFields.filter((field: Field) => field.difficulty === 1);
      console.log(difficulty1Fields);
      const totalFields = difficulty1Fields.length;
      const currentIndex = difficulty1Fields.findIndex((f: Field) => f.fieldId === field.fieldId);

      if (currentIndex === -1) {
        setError("Aktuální pole nebylo nalezeno v poli s obtížností 1.");
        return;
      }

      const moveBy = direction === "left" ? -diceRollResult : diceRollResult;
      let newIndex = (currentIndex + moveBy) % totalFields;

      if (newIndex < 0) {
        newIndex = totalFields + newIndex;
      }

      const nextField = difficulty1Fields[newIndex];
      navigate(`/game/${nextField.fieldId}`);
      setIsMoved(true);
      setDiceRollResult(null);
    } catch (err) {
      console.error("Error in handleMove:", err);
      setError(err instanceof Error ? err.message : "Chyba při načítání polí.");
    }
  };

  if (loading) return <p>Načítám...</p>;
  if (error) return <p>Chyba: {error}</p>;
  if (!field) return <p>Chyba: Pole s ID {startingFieldId} nebylo nalezeno.</p>;

   if (gameOver) {
    return (
      <div className={styles.gameOver}>
        <h1>Game Over!</h1>
        <p>Your HP reached 0.</p>
        <button onClick={resetGame}>Try Again</button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${fieldImage ? styles.withBackground : ""}`}
      style={fieldImage ? { backgroundImage: `url(${fieldImage})` } : {}}
    >
    {isFighting && <div className={styles.dimmedOverlay} />}
      <div className={styles.content}>
        {selectedCharacter && (
          <div className={styles.characterCard}>
            <img
              src={selectedCharacter.imageId ? `${API_BASE_URL}/files/${selectedCharacter.imageId}` : "/default-character.png"}
              alt={selectedCharacter.name}
              className={styles.characterImage}
            />

            <div className={styles.characterStats2}>
              <p>Síla: {localStorage.getItem("strength")}</p>
              <p>Vůle: {localStorage.getItem("will")}</p>
            </div>
            <div className={styles.characterStats}>
              <p>Body osudu: {localStorage.getItem("pointsOfDestiny")}</p>
              <p>HP: {localStorage.getItem("hp")}</p>
            </div>
          </div>
        )}
        <div className={styles.fieldInfo}>
          <h1>{field.title}</h1>
        </div>
        <p>{field.description}</p>

        <div className={styles.inventoryWrapper}>
          <InventoryDisplay inventoryId={characterInventoryId} />
        </div>

        {startingFieldId && <FieldCardsDisplay fieldId={startingFieldId} onFight={handleFight} />}
		 {fightResult && <p>{fightResult}</p>}

        <div className={styles.diceRollContainer}>
          {isRolling ? (
            <div className={styles.slotAnimation}>
              <div className={styles.slot}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className={styles.slotItem}>
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Výsledek hodu kostkou: {diceRollResult}</p>
          )}
        </div>

        {!isRolling && diceRollResult !== null && !isMoved && (
          <div className={styles.moveButtons}>
            <button onClick={() => handleMove("left")}>Jít vlevo</button>
            <button onClick={() => handleMove("right")}>Jít vpravo</button>
          </div>
        )}
        <div className={styles.cedule}>
          <img src={cedule} alt="Popis obrázku" />
          <img src={cedule} alt="Popis obrázku" />
          <img src={cedule} alt="Popis obrázku" />
        </div>
        <Button text="Hodit kostkou" onClick={handleFilterAndMove} disabled={gameOver}/>
      </div>
    </div>
  );
};

export default RoomNavigate;