import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ChoosingCharacter.module.css";
import MagicParticles from "../components/MagicParticles";

interface Character {
  id: number;
  name: string;
  class: string;
  startingFieldId: number;
  imageId: number | null;
  hp: number;
  strength: number;
  will: number;
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
  const [selectionSoundPlayed, setSelectionSoundPlayed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const navigate = useNavigate();

  // Detekce mobilního zařízení
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Efekt pro přehrání zvuku při načtení - jen na desktopu
  useEffect(() => {
    if (isMobile) return; // Přeskočení zvuků na mobilních zařízeních
    
    try {
      const audioElement = new Audio('/sounds/magic-ambient.mp3');
      audioElement.volume = 0.3;
      audioElement.loop = true;
      
      // Přehrání zvuku až po interakci uživatele
      const playAudio = () => {
        audioElement.play().catch(e => console.log('Audio play failed:', e));
        document.removeEventListener('click', playAudio);
      };
      
      document.addEventListener('click', playAudio);

      return () => {
        audioElement.pause();
        document.removeEventListener('click', playAudio);
      };
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [isMobile]);

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
    // Přehrání zvuku výběru - jen na desktopu
    if (!isMobile) {
      try {
        if (!selectionSoundPlayed) {
          const selectSound = new Audio('/sounds/magic-select.mp3');
          selectSound.volume = 0.5;
          selectSound.play().catch(e => console.log('Audio play failed:', e));
          setSelectionSoundPlayed(true);
        } else {
          const changeSound = new Audio('/sounds/character-change.mp3');
          changeSound.volume = 0.5;
          changeSound.play().catch(e => console.log('Audio play failed:', e));
        }
      } catch (e) {
        console.log('Audio not supported');
      }
    }

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
      // Přehrání zvuku potvrzení - jen na desktopu
      if (!isMobile) {
        try {
          const confirmSound = new Audio('/sounds/game-start.mp3');
          confirmSound.volume = 0.6;
          confirmSound.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
          console.log('Audio not supported');
        }
      }

      // Uložení do místního úložiště
      const characterToSave = {
        ...selectedCharacter,
        strength: selectedCharacter.strength || 10,
        will: selectedCharacter.will || 10,
        maxHP: selectedCharacter.hp || 10,
      };
      localStorage.setItem("selectedCharacter", JSON.stringify(characterToSave));
      
      // Animace přechodu
      document.body.classList.add('pageTransition');

      // Přechod na herní stránku s mírným zpožděním pro animaci
      setTimeout(() => {
        navigate(`/game/${selectedCharacter.startingFieldId}`);
      }, 1200);
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
      
      {/* Kouzelné částice - na mobilních zařízeních méně */}
      <MagicParticles count={isMobile ? 30 : 60} />
  
      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Načítám postavy...</p>}
  
        {!loading && (
          <h1 className={styles.pageTitle}>Vyberte si svého hrdinu</h1>
        )}
  
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
                  <h3>Příběh</h3>
                  <p>{selectedCharacterDetail.backstory}</p>
                </div>
                <img src={characterImages[selectedCharacter.id] || ""} alt={selectedCharacter.name} />
                <div className={styles.abilities}>
                  <h3>Schopnosti</h3>
                  <p>{selectedCharacterDetail.ability}</p>
                  
                  <div className={styles.statsContainer}>
                                        </div>
                   
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
          {!selectedCharacter ? "Nejprve vyberte postavu" : "Zahájit dobrodružství"}
        </button>
      </div>
    </div>
  );
};

export default ChoosingCharacter;