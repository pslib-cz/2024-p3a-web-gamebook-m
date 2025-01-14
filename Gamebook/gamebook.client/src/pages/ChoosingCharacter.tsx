import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ChoosingCharacter.module.css";

interface Character {
  id: number;
  name: string;
  class: string;
  startingFieldId: number;
  imageId: number | null;
  maxHP: number; // HP postavy
  strength: number; // Síla postavy
  will: number; // Vůle postavy
  pointsOfDestiny: number; // Body osudu postavy
  backstory: string;
  ability: string;
}



const ChoosingCharacter: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterImages, setCharacterImages] = useState<Record<number, string>>({});
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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

        // Načtení obrázků pro každou postavu
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
      console.log(detail)

      setSelectedCharacter(detail);
      console.log(selectedCharacter)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba");
    }
  };

  const handleStartGameClick = () => {
    if (selectedCharacter) {
      console.log(selectedCharacter)
      localStorage.setItem("strength", selectedCharacter.strength.toString());
      localStorage.setItem("will", selectedCharacter.will.toString());
      localStorage.setItem("pointsOfDestiny", selectedCharacter.pointsOfDestiny.toString());
      localStorage.setItem("hp", selectedCharacter.maxHP.toString());
      navigate(`/game/${selectedCharacter.startingFieldId}`);
    }
  };

  useEffect(() => {
    // Načtení vybrané postavy z localStorage
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      const character: Character = JSON.parse(storedCharacter);
      setSelectedCharacter(character);
      // Můžete načíst další herní údaje, například HP, sílu apod.
      console.log('HP:', character.maxHP); // Například zobrazíme HP
    }
  }, []);

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
  
        {selectedCharacter && (
          <>
            <div className={styles.characterImageContainer}>
              <div className={styles.jmeno}>
                <h2>{selectedCharacter.name}</h2>
                <p className={styles.characterClass}>{selectedCharacter.class}</p>
              </div>
              <div className={styles.characterDetails}>
                <div className={styles.about}>
                  <h3>Backstory</h3>
                  <p>{selectedCharacter.backstory}</p>
                </div>
                <img src={characterImages[selectedCharacter.id] || ""} alt={selectedCharacter.name} />
                <div className={styles.abilities}>
                  <h3>Abilities</h3>
                  <p>{selectedCharacter.ability}</p>
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
