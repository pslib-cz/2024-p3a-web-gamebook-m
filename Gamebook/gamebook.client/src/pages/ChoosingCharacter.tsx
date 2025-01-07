import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

interface ApiResponse {
  items: Character[];
  total: number;
  count: number;
  page: number;
  size: number;
}

const ChoosingCharacter = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [images, setImages] = useState<Record<number, string>>({});
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCharacterDetail, setSelectedCharacterDetail] = useState<CharacterDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/characters");
        if (!response.ok) {
          throw new Error(`Server vrátil chybu: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (!data.items || !Array.isArray(data.items)) {
          throw new Error("Data z API nejsou ve správném formátu (chybí 'items').");
        }

        setCharacters(data.items);

        // Načtení obrázků
        for (const character of data.items) {
          if (character.imageId) {
            fetchImage(character.imageId);
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const fetchImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/Files/${imageId}/base64`);
      if (!response.ok) {
        throw new Error(`Nepodařilo se načíst obrázek ID: ${imageId}`);
      }

      const imageData = await response.json();
      const base64String = imageData.Base64Content;
      setImages((prev) => ({ ...prev, [imageId]: base64String }));
    } catch (err) {
      console.error(`Chyba při načítání obrázku ID: ${imageId}`, err);
    }
  };

  const handleCharacterClick = async (character: Character) => {
    setSelectedCharacter(character);

    // Získání detailů o postavě
    try {
      const response = await fetch(`/api/characters/${character.id}`);
      if (!response.ok) {
        throw new Error(`Nepodařilo se načíst detaily postavy ID: ${character.id}`);
      }

      const detail: CharacterDetail = await response.json();
      setSelectedCharacterDetail(detail);

      // Dynamická změna pozadí podle ID postavy
      document.body.classList.remove("background1", "background2", "background3");
      document.body.classList.add(`background${character.id}`);
    } catch (err) {
      setError("Chyba při načítání detailů postavy.");
    }
  };

  const handleStartGameClick = () => {
    if (selectedCharacter) {
      navigate("/game");
    }
  };

  return (
    <div className="container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Načítám postavy...</p>}

      <div className="character-list">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleCharacterClick(character)}
            className={`character-item ${selectedCharacter?.id === character.id ? "selected" : ""}`}
          >
            {character.imageId && images[character.imageId] ? (
              <img src={images[character.imageId]} alt={character.name} />
            ) : (
              <p>No image available</p>
            )}
           {character.name}
          </div>
        ))}
      </div>

      {selectedCharacterDetail && (
        <div className="character-details">
         <div className="FIRSTTOP">
           <div className="NAME"><h2>{selectedCharacterDetail.name}</h2></div>
          {selectedCharacter && <div className="classname">{selectedCharacter.class}</div>}
          </div>

          <div className="character-details-content">
            <div className="character-details-text">
          <strong className="About">Backstory</strong> 
          {selectedCharacterDetail.backstory}</div>
          <div className="character-details-text">
              <strong className="About">Ability</strong> {selectedCharacterDetail.ability}
              </div>
          </div>
        </div>
      )}

      <button onClick={handleStartGameClick} className="start-game-button" disabled={!selectedCharacter}>
        Vybrat postavu
      </button>
    </div>
  );
};

export default ChoosingCharacter;
