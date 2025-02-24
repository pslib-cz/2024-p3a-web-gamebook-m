import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RoomNavigate.module.css";
import cedule from '/img/neco.png';
import Button from '../components/Button/Button.tsx';
import { API_BASE_URL } from "../api/apiConfig";
import FieldCardsDisplay from "../components/FieldsCardDisplay";
import Inventory from "../components/Inventory";
import EquippedItemBonuses from "../components/EquippedItemBonuses";
import ItemCard from "../components/ItemCard";
import BossCard from "../components/BossCard";
import EnemyCard from "../components/EnemyCard"; // Import the EnemyCard component

interface Field {
    fieldId: number;
    title: string;
    description: string;
    difficulty: number;
    numOfCards: number;
    diceRollResults: { [key: number]: string };
    imageId: number | null;
    enemyId: number | null;
    items?: Item[];
    type: string;
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
    CurrentStrength?: number;
    CurrentWill?: number;
    CurrentHP?: number;
}

interface Card {
    id: number;
    cardId?: number;
    title: string;
    type: string;
    description: string;
    specialAbilities: string | null;
    bonusWile: number | null;
    bonusStrength: number | null;
    bonusHP: number | null;
    classOnly: string | null;
    diceRollResults: { [key: number]: string } | null;
    imageId: number | null;
    enemyId: number | null;
    enemyName?: string | null;
    imageName?: string | null;
}

interface Enemy {
    enemyId: number;
    name: string;
    description: string;
    strength: number;
    will: number;
    imageId?: number | null;
    imageName?: string | null;
}

interface Item {
    itemId: number;
    name: string;
    description: string;
    imageId: number | null;
    bonusWile?: number | null;
    bonusStrength?: number | null;
    bonusHP?: number | null;
}

type AttackType = "strength" | "will";

const RoomNavigate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [field, setField] = useState<Field | null>(null);
    const [fieldImage, setFieldImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [strength, setStrength] = useState(0);
    const [will, setWill] = useState(0);
    const [hp, setHp] = useState(0);

    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [diceRollResult, setDiceRollResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [isMoved, setIsMoved] = useState<boolean>(false);
    const [canRoll, setCanRoll] = useState<boolean>(true);
    const [fightResult, setFightResult] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [isFighting, setIsFighting] = useState<boolean>(false);
    const [hasWonFight, setHasWonFight] = useState<boolean>(false);
    const [inventory, setInventory] = useState<number[]>([]);
    const [equippedItem, setEquippedItem] = useState<Card | null>(null);
    const [showDiceRollButton, setShowDiceRollButton] = useState(false);
    const [showBossButtons, setShowBossButtons] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
    const [attackType, setAttackType] = useState<AttackType | null>(null); // Store the determined attack type

    const startingFieldId = id ? parseInt(id, 10) : null;

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

    const resetGame = () => {
        setGameOver(false);
        setFightResult(null);
        const initialHP = selectedCharacter?.maxHP || 10;
        localStorage.setItem("hp", initialHP.toString());
        if (startingFieldId)
            navigate(`/game/${startingFieldId}`);
        setIsFighting(false);
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
            setFightResult(null);
            setHasWonFight(false);
            setShowDiceRollButton(false);
            setAttackType(null); // Reset typ útoku

            // NEW LOGIC: Check if the field type is "Boss"
            const isBossField = fetchedField.type === "Boss";

            console.log("Fetched Field:", fetchedField);
            console.log("field.type:", fetchedField.type);
            console.log("isBossField:", isBossField);

            setShowBossButtons(isBossField);
            console.log("showBossButtons:", isBossField);

    } catch (err) {
        setError("Nastala chyba");
    } finally {
        setLoading(false);
    }
};

    const loadCharacter = async () => {
        const storedCharacter = localStorage.getItem("selectedCharacter");
        const storedUsername = localStorage.getItem("username");
        const equippedItemId = localStorage.getItem("equippedItemId");

        if (storedCharacter) {
            try {
                const character = JSON.parse(storedCharacter) as Character;
                character.username = storedUsername || "Neznámé uživatelské jméno";
                setSelectedCharacter(character);

                let equippedCard: Card | null = null;
                if (equippedItemId) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/cards/${equippedItemId}`);
                        if (response.ok) {
                            equippedCard = await response.json() as Card;
                            console.log("loadCharacter - Loaded equippedCard from API:", equippedCard);
                            setEquippedItem(equippedCard);
                        } else {
                            console.error("Failed to load equipped item:", response.status);
                            localStorage.removeItem("equippedItemId");
                        }
                    } catch (error) {
                        console.error("Error loading equipped item:", error);
                        localStorage.removeItem("selectedCharacter");
                    }
                }

                updateCharacterStats(character, equippedCard);

            } catch (error) {
                console.error("Error parsing character from localStorage:", error);
                setError("Chyba při načítání postavy.");
                localStorage.removeItem("selectedCharacter");
            }

        } else {
            setError("Žádná postava nebyla vybrána.");
        }
    };

    const updateCharacterStats = useCallback(
        (character: Character, equippedItem: Card | null) => {
            console.log("updateCharacterStats called", character, equippedItem);
            console.log("Equipped Item:", equippedItem);
            if (!character) return;

            let newStrength = character.strength;
            let newWill = character.will;
            let newHp = character.maxHP;
            console.log("Stats before:", newStrength, newWill, newHp)
            if (equippedItem) {
                console.log("Bonuses:", equippedItem?.bonusStrength, equippedItem?.bonusWile, equippedItem?.bonusHP);
                newStrength += equippedItem.bonusStrength || 0;
                newWill += equippedItem.bonusWile || 0;
                newHp += equippedItem.bonusHP || 0;
            }

            setStrength(newStrength);
            setWill(newWill);
            setHp(newHp);
            console.log("Stats after:", newStrength, newWill, newHp)

            localStorage.setItem("strength", newStrength.toString());
            localStorage.setItem("will", newWill.toString());
            localStorage.setItem("hp", newHp.toString());

        },
        []
    );

    useEffect(() => {
        if (selectedCharacter) {
            updateCharacterStats(selectedCharacter, equippedItem);
        }
    }, [selectedCharacter, equippedItem, updateCharacterStats]);

    const handleFight = useCallback(
        async (enemyStrength: number, enemyWill: number, attackType: AttackType) => {
            if (gameOver) return;

            const playerStrength = strength;
            const playerWill = will;
            const playerRoll = Math.floor(Math.random() * 6) + 1;
            const enemyRoll = Math.floor(Math.random() * 6) + 1;

            const playerTotal = attackType === "strength" ? playerStrength + playerRoll : playerWill + playerRoll;
            const enemyTotal = attackType === "strength" ? enemyStrength + enemyRoll : enemyWill + enemyRoll;

            let resultMessage = "";
            let damage = 0;

            if (playerTotal > enemyTotal) {
                damage = playerTotal - enemyTotal;
                resultMessage = `You win! (You: ${playerTotal}, Enemy: ${enemyTotal}).  You deal ${damage} damage!`;
                setHasWonFight(true);
                setShowDiceRollButton(true);

            } else if (enemyTotal > playerTotal) {
                resultMessage = `You lose! (You: ${playerTotal}, Enemy: ${enemyTotal}). You take 1 damage!`;
                setHp(prevHp => {
                    const newHp = Math.max(0, prevHp - 1);
                    localStorage.setItem("hp", newHp.toString());
                    return newHp;
                });

                if (hp <= 0) {
                    setGameOver(true);
                    setIsFighting(false);
                    return;
                }
            } else {
                resultMessage = `It's a draw! (You: ${playerTotal}, Enemy: ${enemyTotal})`;
                setHasWonFight(false);
            }
            setIsFighting(false);
            setAttackType(null); // Reset typ útoku
            setFightResult(resultMessage);
        },
        [strength, will, hp, setShowDiceRollButton]
    );

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
            setShowDiceRollButton(false);
        } catch (err) {
            console.error("Error in handleMove:", err);
            setError("Chyba při načítání polí.");
        }
        setIsFighting(false);
        setHasWonFight(false);
    };

    const handleAddItemToInventory = (item: Item) => {
        setInventory((prevInventory) => [...prevInventory, item.itemId]);
    };

    const handleRemoveItemFromInventory = (itemId: number) => {
        setInventory((prevInventory) =>
            prevInventory.filter((item) => item !== itemId)
        );
    };

    const handleItemInteraction = (item: Item) => {
        handleAddItemToInventory(item);
    };

    const handleEquipItem = useCallback(
        async (card: Card) => {
            console.log("handleEquipItem called with card:", card);
            if (!selectedCharacter) {
                console.error("No character selected to equip item to.");
                return;
            }

            if (card.id) {
                setEquippedItem(card);
                localStorage.setItem("equippedItemId", card.id.toString());

                setInventory((prevInventory) => {
                    if (!prevInventory.includes(card.id!)) {
                        return [...prevInventory, card.id!];
                    }
                    return prevInventory;
                });

                try {
                    const inventoryId = 1;
                    const response = await fetch(`${API_BASE_URL}/inventories/add-card`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            inventoryId: inventoryId,
                            cardId: card.id,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to add card to inventory: ${response.status}`);
                    }

                    console.log("Card added to inventory on the server.");
                    if (selectedCharacter) {
                        updateCharacterStats(selectedCharacter, card);
                    }
                    setShowDiceRollButton(true);

                } catch (error) {
                    console.error("Error adding card to inventory:", error);
                }
            } else {
                console.error("Card ID is undefined, cannot equip.");
            }
        },
        [API_BASE_URL, selectedCharacter, updateCharacterStats]
    );

    const handleUnequipItem = useCallback(async () => {
        if (!equippedItem || !selectedCharacter) return;

        try {
            const inventoryId = 1;
            const response = await fetch(`${API_BASE_URL}/inventories/remove-card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inventoryId: inventoryId,
                    cardId: equippedItem.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove card from inventory: ${response.status}`);
            }

            console.log('Card removed from inventory on the server.');
            setEquippedItem(null);
            localStorage.removeItem("equippedItemId");
            updateCharacterStats(selectedCharacter, null);
            setShowDiceRollButton(false);

        } catch (error) {
            console.error('Error removing card from inventory:', error);
        }
    }, [API_BASE_URL, equippedItem, selectedCharacter, updateCharacterStats]);

    const handleFightBoss = () => {
         console.log("handleFightBoss called");
        if (field?.enemyId) {
            console.log("Attempting to fetch enemy with ID:", field.enemyId);
            fetch(`${API_BASE_URL}/enemies/${field.enemyId}`)
                .then(response => {
                     console.log("Enemy fetch response:", response);
                    return response.json();
                })
                .then((enemy: Enemy) => {
                    if (enemy) {
                        console.log("Fetched enemy:", enemy);
                        setCurrentEnemy(enemy);
                        setIsFighting(true);
                    } else {
                        console.error("Boss enemy not found!");
                    }
                })
                .catch(error => console.error("Error fetching boss enemy:", error));
        } else {
            console.error("No enemy ID associated with this boss field.");
        }
    };

    const handleDontFightBoss = () => {
         console.log("handleDontFightBoss called");
        alert("You chose not to fight the boss. Something else happens...");
    };

    //  removing the handleAttack function, as the attacking will now be triggered from the EnemyCard component.
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
                            <p>Síla: {strength}</p>
                            <p>Vůle: {will}</p>
                        </div>
                        <div className={styles.characterStats}>
                            <p>Body osudu: {localStorage.getItem("pointsOfDestiny")}</p>
                            <p>HP: {hp}</p>
                        </div>
                    </div>
                )}

                <div className={styles.fieldInfo}>
                    <h1>{field.title}</h1>
                </div>
                <p>{field.description}</p>

                {showBossButtons ? (
                    <>
                        <BossCard
                            title={field.title}
                            type={field.type}
                            description={field.description}
                        />
                        {currentEnemy && (
                            <EnemyCard
                                {...currentEnemy}
                                onFight={(enemyStrength, enemyWill, attackType) => {
                                    setIsFighting(true);
                                    handleFight(enemyStrength, enemyWill, attackType);
                                }}
                            />
                        )}
                        <div className={styles.bossButtons}>
                            <Button text="Fight" onClick={handleFightBoss} />
                            <Button text="Don't Fight" onClick={handleDontFightBoss} />
                        </div>
                    </>
                ) : (
                    startingFieldId && !isFighting && !hasWonFight && <FieldCardsDisplay fieldId={startingFieldId} onFight={handleFight} onEquipItem={handleEquipItem} />
                )}

                {fightResult && isFighting && <p>{fightResult}</p>}

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

                {showDiceRollButton && (
                    <Button text="Hodit kostkou" onClick={handleFilterAndMove} disabled={gameOver} />
                )}

                {fightResult && isFighting && <p>{fightResult}</p>}

                {field.items && field.items.length > 0 && (
                    <div className={styles.fieldItems}>
                        <h3>Items in this Room:</h3>
                        <ul>
                            {field.items.map((item) => (
                                <li key={item.itemId}>
                                    <ItemCard
                                        name={item.name}
                                        description={item.description}
                                        imageId={item.imageId}
                                        cardId={item.itemId}
                                        onEquip={handleEquipItem}
                                        bonusWile={item.bonusWile || 0}
                                        bonusStrength={item.bonusStrength || 0}
                                        bonusHP={item.bonusHP || 0}
                                    />
                                    <button onClick={() => handleItemInteraction(item)}>
                                        Take Item
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Inventory
                    inventory={inventory}
                    onRemoveItem={handleRemoveItemFromInventory}
                    equippedItemId={equippedItem?.id || null}
                    onEquipItem={handleEquipItem}
                    onUnequipItem={handleUnequipItem}
                />
            </div>
        </div>
    );
};

export default RoomNavigate;