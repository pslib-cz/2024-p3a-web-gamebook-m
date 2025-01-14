import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RoomNavigate.module.css";
import { all } from "axios";

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
  const startingFieldId = id ? parseInt(id, 10) : null;
  const baseURL = "https://localhost:58186/api";

  const fetchFieldImage = useCallback(async (imageId: number | null) => {
    if (!imageId) {
      setFieldImage(null);
      return;
    }
    try {
      const response = await fetch(`${baseURL}/files/${imageId}`);
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
  }, [baseURL]);

  useEffect(() => {

    const loadData = async () => {
      if (!startingFieldId) {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/fields/${startingFieldId}`);
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba při načítání pole.");
      } finally {
        setLoading(false);
      }
    };

    const loadCharacter = async () => {
      const storedCharacter = localStorage.getItem("selectedCharacter");
      const storedUsername = localStorage.getItem("username");
      
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter) as Character;
        character.username = storedUsername || "Neznámé uživatelské jméno";
        setSelectedCharacter(character);
      } else {
        setError("Žádná postava nebyla vybrána.");
      }
    };

    loadData();
    loadCharacter();
  }, [startingFieldId, navigate, fetchFieldImage, baseURL]);

  const handleFilterAndMove = async () => {
    if (!canRoll) return;

    setIsRolling(true);
    setCanRoll(false);

    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      setDiceRollResult(randomNumber);
      setIsRolling(false);
    }, 3000);
  };

  const handleMove = async (direction: "left" | "right") => {
    if (!field || diceRollResult === null) return;

    try {
      const response = await fetch(`${baseURL}/fields`);
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

  return (
    <div
      className={`${styles.container} ${fieldImage ? styles.withBackground : ""}`}
      style={fieldImage ? { backgroundImage: `url(${fieldImage})` } : {}}
    >
      <div className={styles.content}>
        {selectedCharacter && (
          <div className={styles.characterCard}>
            <img
              src={selectedCharacter.imageId ? `${baseURL}/files/${selectedCharacter.imageId}` : "/default-character.png"}
              alt={selectedCharacter.name}
              className={styles.characterImage}
            />
            <div className={styles.characterInfo}>
              <p className={styles.characterUsername}>{selectedCharacter.username}</p>
              <p>Síla: {localStorage.getItem("strength")}</p>
              <p>Vůle: {localStorage.getItem("will")}</p>
              <p>Body osudu: {localStorage.getItem("pointsOfDestiny")}</p>
              <p>HP: {localStorage.getItem("hp")}</p>
            </div>
          </div>
        )}
        <h1>{field.title}</h1>
        <p>{field.description}</p>
        <p>Obtížnost: {field.difficulty}</p>

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

        <button
          onClick={handleFilterAndMove}
          disabled={isRolling || isMoved}
          className={styles.rollDiceButton}
        >
          {isRolling ? "Hod kostkou..." : "Hodit kostkou"}
        </button>
      </div>
    </div>
  );
};

export default RoomNavigate;
