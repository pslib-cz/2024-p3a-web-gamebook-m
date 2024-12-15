import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Character {
    id: number;
    name: string;
    class: string;
    startingFieldId: number;
    imageId: number | null;
    strength: number;
    will: number;
    pointsOfDestiny: number;
    backstory: string;
    ability: string;
    maxHP: number;
    maxDifficulty: number;
}

const ChoosingCharacter = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch("/api/characters");
                if (!response.ok) {
                    throw new Error("Nepodařilo se načíst postavy.");
                }

                const data = await response.json();
                // Kontrola formátu dat
                if (data && Array.isArray(data.items)) {
                    setCharacters(data.items);
                } else {
                    throw new Error("Data nejsou ve správném formátu.");
                }
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchCharacters();
    }, []);

    const handleCharacterClick = async (characterId: number) => {
        try {
            const response = await fetch(`/api/characters/${characterId}`);
            if (!response.ok) {
                throw new Error("Nepodařilo se načíst detaily postavy.");
            }

            const character = await response.json();
            setSelectedCharacter(character);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    // Tlačítko pro navigaci na jinou stránku
    const handleStartGameClick = () => {
        if (selectedCharacter) {
            navigate("/game");  // Měníme na route, kam chceme uživatele poslat
        }
    };

    return (
        <div>
            <h1>Vyberte svou postavu</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {/* Zobrazíme obrázky postav */}
            <div style={{ display: "flex", gap: "20px", overflowX: "scroll" }}>
                {characters.length > 0 ? (
                    characters.map((character) => (
                        <div key={character.id} onClick={() => handleCharacterClick(character.id)} style={{ cursor: "pointer" }}>
                            {character.imageId ? (
                                <img
                                    src={`/api/images/${character.imageId}`} // Ověřte správnost tohoto endpointu pro načítání obrázků
                                    alt={character.name}
                                    style={{ width: "150px", height: "auto", borderRadius: "8px" }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Načítám postavy...</p>
                )}
            </div>

            {/* Pokud je vybraná postava, zobrazíme její detaily */}
            {selectedCharacter && (
                <div style={{ marginTop: "20px" }}>
                    <h2>{selectedCharacter.name}</h2>
                    <p><strong>Třída:</strong> {selectedCharacter.class}</p>
                    <p><strong>Síla:</strong> {selectedCharacter.strength}</p>
                    <p><strong>Vůle:</strong> {selectedCharacter.will}</p>
                    <p><strong>Body osudu:</strong> {selectedCharacter.pointsOfDestiny}</p>
                    <p><strong>Max. životy:</strong> {selectedCharacter.maxHP}</p>
                    <p><strong>Max. obtížnost:</strong> {selectedCharacter.maxDifficulty}</p>
                    <p><strong>Popis:</strong> {selectedCharacter.backstory}</p>
                    <p><strong>Schopnost:</strong> {selectedCharacter.ability}</p>
                    <p><strong>Startovní pole ID:</strong> {selectedCharacter.startingFieldId}</p>

                    {selectedCharacter.imageId ? (
                        <img
                            src={`/api/images/${selectedCharacter.imageId}`} // Předpokládáme správnou URL pro obrázky
                            alt={selectedCharacter.name}
                            style={{ width: "200px", height: "auto", borderRadius: "8px" }}
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
            )}

            {/* Tlačítko pro start hry - deaktivováno, pokud není postava vybraná */}
            <div style={{ marginTop: "20px" }}>
                <button 
                    onClick={handleStartGameClick} 
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }} 
                    disabled={!selectedCharacter}  // Tlačítko je deaktivované, pokud není vybraná postava
                >
                    Začít hru
                </button>
            </div>
        </div>
    );
};

export default ChoosingCharacter;
