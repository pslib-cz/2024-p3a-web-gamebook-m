import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Field {
    fieldId: number;
    title: string;
    description: string;
    difficulty: number;
    numOfCards: number;
    diceRollResults: string[]; // Odkazy na ID místností
    enemyId?: number | null;
    imageId?: number | null;
    [key: string]: any; // Pro další možné atributy
}

const RoomNavigation = () => {
    const [currentField, setCurrentField] = useState<Field | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Získání ID z URL

    // Funkce pro načtení místnosti podle ID
    const fetchField = async (fieldId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error(`Nepodařilo se načíst místnost s ID ${fieldId}`);
            }

            const data: Field = await response.json();
            setCurrentField(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Funkce pro hod kostkou a přesun do jiné místnosti
    const rollDiceAndMove = () => {
        if (!currentField || !currentField.diceRollResults || currentField.diceRollResults.length === 0) {
            setError("Nelze hodit kostkou. Aktuální místnost nemá definované výsledky hodu.");
            return;
        }

        const diceRoll = Math.floor(Math.random() * 6); // Hod 0 až (počet výsledků - 1)
        const nextFieldId = currentField.fieldId + (diceRoll + 1);

        console.log(`Hod kostkou: ${diceRoll + 1}, další místnost ID: ${nextFieldId}`);
        navigate(`/game/${nextFieldId}`); // Změna URL na novou místnost
    };

    // Načtení aktuální místnosti při změně ID v URL
    useEffect(() => {
        if (id) {
            const fieldId = parseInt(id, 10);
            if (!isNaN(fieldId)) {
                fetchField(fieldId);
            } else {
                setError("Neplatné ID místnosti v URL.");
            }
        }
    }, [id]);

    return (
        <div>
            <h1>Posun v místnostech</h1>

            {/* Chybové hlášky */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Zobrazení aktuální místnosti */}
            {loading ? (
                <p>Načítám místnost...</p>
            ) : currentField ? (
                <div>
                    <h2>{currentField.title}</h2>
                    <p>{currentField.description}</p>
                    <p><strong>Obtížnost:</strong> {currentField.difficulty}</p>
                    <p><strong>Počet karet:</strong> {currentField.numOfCards}</p>
                    {currentField.enemyId && <p><strong>Enemy ID:</strong> {currentField.enemyId}</p>}
                    {currentField.imageId && (
                        <img
                            src={`/api/images/${currentField.imageId}`} // Předpokládáme endpoint pro načtení obrázku
                            alt={currentField.title}
                            style={{ width: "200px", height: "auto", borderRadius: "8px" }}
                        />
                    )}
                    <pre>{JSON.stringify(currentField, null, 2)}</pre>
                </div>
            ) : (
                <p>Načtěte místnost.</p>
            )}

            {/* Tlačítka */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => navigate(`/game/1`)} // Načíst místnost s ID = 1
                    style={{ padding: "10px 20px", fontSize: "16px", marginRight: "10px" }}
                >
                    Načíst místnost s ID 1
                </button>
                <button
                    onClick={rollDiceAndMove}
                    style={{ padding: "10px 20px", fontSize: "16px" }}
                    disabled={!currentField || loading}
                >
                    Hodit kostkou a přesunout se
                </button>
            </div>
        </div>
    );
};

export default RoomNavigation;
