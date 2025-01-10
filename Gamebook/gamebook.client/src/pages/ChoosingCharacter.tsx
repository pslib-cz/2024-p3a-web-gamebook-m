import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ChoosingCharacter.module.css";

interface Character {
  id: number;
  name: string;
  class: string;
  startingFieldId: number;
  imageId: number | null;
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
      setSelectedCharacterDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba");
    }
  };

  const handleStartGameClick = () => {
    if (selectedCharacter) {
      navigate(`/game/${selectedCharacter.startingFieldId}`);
    }
  };

  return (
    <div className={styles.container}>
      {backgroundImage && (
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
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
              <p>{character.name}</p>
            </div>
          ))}
        </div>

        {selectedCharacter && selectedCharacterDetail && (
          <div className={styles.characterDetailsContent}>
            <div className={styles.characterImageContainer}>
              <img
                src={characterImages[selectedCharacter.id] || ""}
                alt={selectedCharacter.name}
              />
              <div className={styles.characterName}>
                {selectedCharacter.name}
              </div>
            </div>

            <div className={styles.characterDetailsText}>
              <h2>{selectedCharacter.name}</h2>
              <p className={styles.characterClass}>{selectedCharacter.class}</p>
              <div className={styles.characterBackstory}>
                <strong>Backstory:</strong> {selectedCharacterDetail.backstory}
              </div>
              <div className={styles.characterAbility}>
                <strong>Ability:</strong> {selectedCharacterDetail.ability}
              </div>
            </div>
          </div>
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