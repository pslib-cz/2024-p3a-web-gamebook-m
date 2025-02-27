import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ChoosingCharacter.module.css";
import { useGameContext } from "../context/GameContext.tsx"; // Import the context

interface Character {
  id: number;
  name: string;
  class: string;
  startingFieldId: number;
  imageId: number | null;
  hp: number;
  strength: number;
  willpower: number;
}

interface CharacterDetail {
  id: number;
  name: string;
  backstory: string;
  ability: string;
}

const ChoosingCharacter: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCharacterDetail, setSelectedCharacterDetail] = useState<CharacterDetail | null>(null);
  const [characterImages, setCharacterImages] = useState<Record<number, string>>({});
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Use the game context instead of localStorage
  const { setCharacter } = useGameContext();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/characters");
        if (!response.ok) {
          throw new Error("Chyba při načítání postav.");
        }

        const data = await response.json();
        setCharacters(data.items || []);

        // Load images for each character
        data.items.forEach((character: Character) => {
          if (character.imageId) {
            fetchCharacterImage(character.imageId, (imageUrl) => {
              setCharacterImages((prev) => ({ ...prev, [character.id]: imageUrl }));
            });
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Neznámá chyba");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const fetchCharacterImage = useCallback(async (imageId: number, callback: (url: string) => void) => {
    try {
      const response = await fetch(`/api/Files/${imageId}`);
      if (!response.ok) {
        throw new Error("Nepodařilo se načíst obrázek.");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      callback(imageUrl);
    } catch (err) {
      console.error("Chyba při načítání obrázku:", err);
    }
  }, []);

  const handleCharacterClick = async (character: Character) => {
    setSelectedCharacter(character);
    if (character.imageId) {
      setBackgroundImage(characterImages[character.id] || null);
    }

    try {
      const response = await fetch(`/api/characters/${character.id}`);
      if (!response.ok) {
        throw new Error("Chyba při načítání detailů postavy.");
      }

      const detail = await response.json();
      setSelectedCharacterDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba");
    }
  };

  const handleStartGameClick = () => {
    if (selectedCharacter) {
      // 1. Store in context
      setCharacter({
        ...selectedCharacter,
        hp: selectedCharacter.hp || 10,
        maxHP: selectedCharacter.hp || 10,
        will: selectedCharacter.willpower || 10,
        pointsOfDestiny: 3, // Default value
      });
      
      // 2. Store in localStorage for backward compatibility until migration is complete
      const characterToSave = {
        ...selectedCharacter,
        strength: selectedCharacter.strength || 10,
        will: selectedCharacter.willpower || 10,
        maxHP: selectedCharacter.hp || 10,
      };
      localStorage.setItem("selectedCharacter", JSON.stringify(characterToSave));
      
      // 3. Navigate to the game
      navigate(`/game/${selectedCharacter.startingFieldId}`);
    }
  };

  return (
    <div className={styles.container}>
      {backgroundImage && (
        <>
          <div
            className={styles.background}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className={styles.overlay} />
        </>
      )}
  
      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Načítám postavy...</p>}
  
        <div className={styles.characterList}>
          {characters.map((character) => (
            <div
              key={character.id}
              className={`${styles.characterItem} ${
                selectedCharacter?.id === character.id ? styles.selected : ""
              }`}
              onClick={() => handleCharacterClick(character)}
            >
              <img
                src={characterImages[character.id] || ""}
                alt={character.name}
                className={styles.characterImage}
              />
            </div>
          ))}
        </div>
  
        {selectedCharacter && selectedCharacterDetail && (
          <>
            <div className={styles.characterImageContainer}>
              <div className={styles.jmeno}>
                <h2>{selectedCharacter.name}</h2>
                <p className={styles.characterClass}>{selectedCharacter.class}</p>
              </div>
              <div className={styles.characterDetails}>
                <div className={styles.about}>
                  <h3>Backstory</h3>
                  <p>{selectedCharacterDetail.backstory}</p>
                </div>
                <img src={characterImages[selectedCharacter.id] || ""} alt={selectedCharacter.name} />
                <div className={styles.abilities}>
                  <h3>Abilities</h3>
                  <p>{selectedCharacterDetail.ability}</p>
                </div>
              </div>
            </div>
          </>
        )}
  
        <button
          className={styles.startButton}
          onClick={handleStartGameClick}
          disabled={!selectedCharacter}
        >
          Vybrat postavu
        </button>
      </div>
    </div>
  );
};

export default ChoosingCharacter;