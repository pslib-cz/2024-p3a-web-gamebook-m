import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Character {
    id: number;
    name: string;
    class: string;
    startingFieldId: number;
    imageId: number | null;
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
            const response = await fetch(`/api/images/${imageId}`);
            if (!response.ok) {
                throw new Error(`Nepodařilo se načíst obrázek ID: ${imageId}`);
            }

            const imageData = await response.json();

            // Předpokládáme, že `Content` je Base64
            const base64String = `data:${imageData.contentType};base64,${imageData.content}`;
            setImages((prev) => ({ ...prev, [imageId]: base64String }));
        } catch (err) {
            console.error(`Chyba při načítání obrázku ID: ${imageId}`, err);
        }
    };

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character);
    };

    const handleStartGameClick = () => {
        if (selectedCharacter) {
            navigate("/game");
        }
    };

    return (
        <div>
            <h1>Vyberte svou postavu</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Načítám postavy...</p>}

            {/* Zobrazujeme seznam postav */}
            <div style={{ display: "flex", gap: "20px", overflowX: "scroll" }}>
                {characters.length > 0 ? (
                    characters.map((character) => (
                        <div
                            key={character.id}
                            onClick={() => handleCharacterClick(character)}
                            style={{
                                cursor: "pointer",
                                textAlign: "center",
                                border: selectedCharacter?.id === character.id ? "2px solid blue" : "none",
                                padding: "10px",
                            }}
                        >
                            {character.imageId && images[character.imageId] ? (
                                <img
                                    src={images[character.imageId]}
                                    alt={character.name}
                                    style={{ width: "150px", height: "auto", borderRadius: "8px" }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                            <p>{character.name}</p>
                        </div>
                    ))
                ) : !loading ? (
                    <p>Žádné postavy nejsou dostupné.</p>
                ) : null}
            </div>

            {/* Detaily vybrané postavy */}
            {selectedCharacter && (
                <div style={{ marginTop: "20px" }}>
                    <h2>{selectedCharacter.name}</h2>
                    <p><strong>Třída:</strong> {selectedCharacter.class}</p>
                    <p><strong>Startovní pole ID:</strong> {selectedCharacter.startingFieldId}</p>
                </div>
            )}

            {/* Tlačítko pro start hry */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={handleStartGameClick}
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                    disabled={!selectedCharacter}
                >
                    Začít hru
                </button>
            </div>
        </div>
    );
};

export default ChoosingCharacter;
