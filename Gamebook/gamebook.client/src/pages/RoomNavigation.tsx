import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RoomNavigate.module.css";
import cedule from '/img/neco.png';
import Button from '../components/Button/Button.tsx';
import { API_BASE_URL } from "../api/apiConfig";
import FieldCardsDisplay from "../components/FieldsCardDisplay";
import Inventory from "../components/Inventory";
import ItemCard from "../components/ItemCard";
import BossCard from "../components/BossCard";
import EnemyCard from "../components/EnemyCard";
import { useGameContext } from "../context/Gamecontext";

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

interface Card {
    id: number;
    cardId?: number;
    title: string;
    name?: string;
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

    const contextValues = useGameContext();

    const [localHp, setLocalHp] = useState<number>(10);
    const [localIsMoved, setLocalIsMoved] = useState<boolean>(false);
    const [localGameOver, setLocalGameOver] = useState<boolean>(false);

    const {
        character,
        fetchCharacter,
        inventory = [],
        addItemToInventory = () => {},
        removeItemFromInventory = () => {},
        equippedItemIds: contextEquippedItemIds = [],
        equipItem: contextEquipItem = () => {},
        unequipItem: contextUnequipItem = () => {},
        hp: contextHp,
        setHp: contextSetHp,
        isMoved: contextIsMoved,
        setIsMoved: contextSetIsMoved,
        gameOver: contextGameOver,
        setGameOver: contextSetGameOver,
    } = contextValues;

    const hp = contextHp !== undefined ? contextHp : localHp;
    const setHp = contextSetHp || setLocalHp;
    const isMoved = contextIsMoved !== undefined ? contextIsMoved : localIsMoved;
    const setIsMoved = contextSetIsMoved || setLocalIsMoved;
    const gameOver = contextGameOver !== undefined ? contextGameOver : localGameOver;
    const setGameOver = contextSetGameOver || setLocalGameOver;

    const [field, setField] = useState<Field | null>(null);
    const [fieldImage, setFieldImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [diceRollResult, setDiceRollResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [canRoll, setCanRoll] = useState<boolean>(true);
    const [fightResult, setFightResult] = useState<string | null>(null);
    const [isFighting, setIsFighting] = useState<boolean>(false);
    const [hasWonFight, setHasWonFight] = useState<boolean>(false);
    const [showDiceRollButton, setShowDiceRollButton] = useState(false);
    const [showBossButtons, setShowBossButtons] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
    const [attackType, setAttackType] = useState<AttackType | null>(null);
    const [equippedCard, setEquippedCard] = useState<Card | null>(null);
    const [equippedItemIds, setEquippedItemIds] = useState<number[]>(contextEquippedItemIds);
    const [notification, setNotification] = useState<string | null>(null);

    const startingFieldId = id ? parseInt(id, 10) : null;

    // **Persistent Stat Bonuses from Enemies (with decimals)**
    const [strengthBonusFromEnemies, setStrengthBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("strengthBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });
    const [willBonusFromEnemies, setWillBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("willBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });

    // **Calculate Stats with Bonuses**
    const baseStrength = character?.strength || 0;
    const baseWill = character?.will || 0;
    const baseHP = character?.maxHP || 10;

    const itemStrengthBonus = equippedCard?.bonusStrength || 0;
    const itemWillBonus = equippedCard?.bonusWile || 0;
    const itemHPBonus = equippedCard?.bonusHP || 0;

    const strength = baseStrength + strengthBonusFromEnemies + itemStrengthBonus;
    const will = baseWill + willBonusFromEnemies + itemWillBonus;

    useEffect(() => {
        if (character && typeof setHp === 'function') {
            const totalHP = baseHP + itemHPBonus;
            setHp(totalHP);
            localStorage.setItem("currentHP", totalHP.toString());
        }
    }, [character, baseHP, itemHPBonus, equippedCard, setHp]);

    useEffect(() => {
        const storedHP = localStorage.getItem("currentHP");
        if (storedHP && typeof setHp === 'function') {
            const parsedHP = parseFloat(storedHP);
            if (!isNaN(parsedHP)) {
                setHp(parsedHP);
            }
        }
    }, [setHp]);

    useEffect(() => {
        const loadPersistedData = () => {
            try {
                const storedInventory = localStorage.getItem("playerInventory");
                if (storedInventory) {
                    const parsedInventory = JSON.parse(storedInventory);
                    if (inventory.length === 0 && Array.isArray(parsedInventory)) {
                        parsedInventory.forEach(itemId => {
                            if (typeof addItemToInventory === 'function') {
                                addItemToInventory(itemId);
                            }
                        });
                    }
                }

                const storedEquippedItemId = localStorage.getItem("equippedItemId");
                if (storedEquippedItemId) {
                    const itemId = parseInt(storedEquippedItemId, 10);
                    if (contextEquippedItemIds.length === 0 && !isNaN(itemId)) {
                        if (typeof contextEquipItem === 'function') {
                            contextEquipItem(itemId);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading data from localStorage:", error);
            }
        };

        loadPersistedData();
    }, [addItemToInventory, contextEquipItem, inventory, contextEquippedItemIds]);

    useEffect(() => {
        if (inventory.length > 0) {
            localStorage.setItem("playerInventory", JSON.stringify(inventory));
        }
    }, [inventory]);

    useEffect(() => {
        if (contextEquippedItemIds.length > 0 && contextEquippedItemIds[0]) {
            localStorage.setItem("equippedItemId", contextEquippedItemIds[0].toString());
        } else if (contextEquippedItemIds.length === 0) {
            localStorage.removeItem("equippedItemId");
        }
    }, [contextEquippedItemIds]);

    const fetchFieldImage = useCallback(async (imageId: number | null) => {
        if (!imageId) {
            setFieldImage(null);
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/files/${imageId}`);
            if (!response.ok) {
                throw new Error("Failed to load image.");
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setFieldImage(imageUrl);
        } catch (err) {
            console.error("Error loading image:", err);
            setFieldImage(null);
            setError("Failed to load image.");
        }
    }, []);

    const resetGame = () => {
        setGameOver(false);
        setFightResult(null);
        if (character && typeof setHp === 'function') {
            setHp(character.maxHP || 10);
        }
        localStorage.setItem("currentHP", character?.maxHP.toString() || "10");
        localStorage.setItem("strengthBonusFromEnemies", "0");
        localStorage.setItem("willBonusFromEnemies", "0");
        setStrengthBonusFromEnemies(0);
        setWillBonusFromEnemies(0);
        if (startingFieldId) navigate(`/game/${startingFieldId}`);
        setIsFighting(false);
    };

    useEffect(() => {
        if (contextEquippedItemIds && contextEquippedItemIds.length > 0 && contextEquippedItemIds[0]) {
            fetchEquippedCard(contextEquippedItemIds[0]);
        } else {
            setEquippedCard(null);
            setShowDiceRollButton(false);
        }
    }, [contextEquippedItemIds]);

    const fetchEquippedCard = async (cardId: number) => {
        if (!cardId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/cards/${cardId}`);
            if (response.ok) {
                const card = await response.json() as Card;
                setEquippedCard(card);
                setShowDiceRollButton(true);
            }
        } catch (error) {
            console.error("Error fetching equipped card:", error);
        }
    };

    const loadData = async () => {
        if (!startingFieldId) {
            navigate("/");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/fields/${startingFieldId}`);
            if (!response.ok) {
                throw new Error("Failed to load field.");
            }
            const fetchedField = await response.json() as Field;
            fetchedField.type = fetchedField.type || "";
            setField(fetchedField);
            if (fetchedField.imageId) {
                fetchFieldImage(fetchedField.imageId);
            } else {
                setFieldImage(null);
            }
            setDiceRollResult(null);
            setCanRoll(true);
            setFightResult(null);
            setHasWonFight(false);
            setShowDiceRollButton(false);
            setAttackType(null);
            const isBossField = fetchedField.type === "Boss";
            setShowBossButtons(isBossField);
        } catch (err) {
            setError(`Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFight = useCallback(
        async (enemyStrength: number, enemyWill: number, attackType: AttackType) => {
            if (gameOver) return;

            const playerStrength = strength;
            const playerWill = will;
            const playerRoll = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
            const enemyRoll = Math.floor(Math.random() * 6) + 1;

            // **Calculate Player Total with Decimals**
            const playerTotal = attackType === "strength" ? playerStrength + playerRoll : playerWill + playerRoll;
            const enemyTotal = attackType === "strength" ? enemyStrength + enemyRoll : enemyWill + enemyRoll;

            let resultMessage = "";
            let damage = 0;

            if (playerTotal > enemyTotal) {
                damage = playerTotal - enemyTotal;
                resultMessage = `You win! (You: ${playerTotal.toFixed(2)}, Enemy: ${enemyTotal.toFixed(2)}). You deal ${damage.toFixed(2)} damage!`;
                setHasWonFight(true);
                setShowDiceRollButton(true);

                // **Calculate Exact Stat Gains**
                const strengthGain = enemyStrength / 10;
                const willGain = enemyWill / 10;

                // **Update Bonuses**
                const newStrengthBonus = strengthBonusFromEnemies + strengthGain;
                const newWillBonus = willBonusFromEnemies + willGain;
                localStorage.setItem("strengthBonusFromEnemies", newStrengthBonus.toString());
                localStorage.setItem("willBonusFromEnemies", newWillBonus.toString());
                setStrengthBonusFromEnemies(newStrengthBonus);
                setWillBonusFromEnemies(newWillBonus);
            } else if (enemyTotal > playerTotal) {
                resultMessage = `You lose! (You: ${playerTotal.toFixed(2)}, Enemy: ${enemyTotal.toFixed(2)}). You take 1 damage!`;
                if (typeof setHp === 'function') {
                    setHp(prevHp => {
                        const newHp = Math.max(0, prevHp - 1);
                        localStorage.setItem("currentHP", newHp.toString());
                        if (newHp <= 0) {
                            setGameOver(true);
                            setIsFighting(false);
                            return 0;
                        }
                        return newHp;
                    });
                }
            } else {
                resultMessage = `It's a draw! (You: ${playerTotal.toFixed(2)}, Enemy: ${enemyTotal.toFixed(2)})`;
                setHasWonFight(false);
            }

            setIsFighting(false);
            setAttackType(null);
            setFightResult(resultMessage);
        },
        [strength, will, setHp, setGameOver, gameOver, strengthBonusFromEnemies, willBonusFromEnemies]
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
                throw new Error("Failed to load fields.");
            }
            const data = await response.json();
            let allFields: Field[] = Array.isArray(data) ? data : Object.values(data).find(Array.isArray) || [];
            const difficulty1Fields = allFields.filter((field: Field) => field.difficulty === 1);
            const totalFields = difficulty1Fields.length;
            const currentIndex = difficulty1Fields.findIndex((f: Field) => f.fieldId === field.fieldId);
            if (currentIndex === -1) {
                setError("Current field not found in difficulty 1 fields.");
                return;
            }
            const moveBy = direction === "left" ? -diceRollResult : diceRollResult;
            let newIndex = (currentIndex + moveBy) % totalFields;
            if (newIndex < 0) newIndex = totalFields + newIndex;
            const nextField = difficulty1Fields[newIndex];
            navigate(`/game/${nextField.fieldId}`);
            if (typeof setIsMoved === 'function') setIsMoved(true);
            setDiceRollResult(null);
            setShowDiceRollButton(false);
        } catch (err) {
            setError("Error loading fields.");
        }
        setIsFighting(false);
        setHasWonFight(false);
    };

    useEffect(() => {
        if (startingFieldId) {
            loadData();
            if (typeof setIsMoved === 'function') setIsMoved(false);
        }
    }, [startingFieldId, setIsMoved]);

    const handleItemInteraction = (item: Item) => {
        if (typeof addItemToInventory === 'function') {
            if (inventory.length >= 8) {
                setNotification("Your inventory is full! Drop something first.");
                return;
            }
            addItemToInventory(item.itemId);
        }
    };

    const handleEquipItem = useCallback(
        async (card: Card) => {
            if (!card || !card.id) return;
            if (typeof contextEquipItem === 'function') contextEquipItem(card.id);
            setEquippedCard(card);
            setShowDiceRollButton(true);
        },
        [contextEquipItem]
    );

    const handleUnequipItem = useCallback(() => {
        if (typeof contextUnequipItem === 'function') contextUnequipItem();
        setEquippedCard(null);
        setShowDiceRollButton(false);
    }, [contextUnequipItem]);

    const handleFightBoss = () => {
        if (field?.enemyId) {
            fetch(`${API_BASE_URL}/enemies/${field.enemyId}`)
                .then(response => response.json())
                .then((enemy: Enemy) => {
                    if (enemy) {
                        setCurrentEnemy(enemy);
                        setIsFighting(true);
                    }
                })
                .catch(error => console.error("Error fetching boss enemy:", error));
        }
    };

    const handleDontFightBoss = () => {
        alert("You chose not to fight the boss. Something else happens...");
    };

    useEffect(() => {
        if (inventory.length > 0) {
            const itemsToEquip = inventory.slice(0, 8);
            itemsToEquip.forEach(itemId => {
                if (typeof contextEquipItem === 'function' && !contextEquippedItemIds.includes(itemId)) {
                    contextEquipItem(itemId);
                }
            });
        }
    }, [inventory, contextEquipItem, contextEquippedItemIds]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!field) return <p>Error: Field with ID {startingFieldId} not found.</p>;

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
                {character && (
                    <div className={styles.characterCard}>
                        <img
                            src={character.imageId ? `${API_BASE_URL}/files/${character.imageId}` : "/default-character.png"}
                            alt={character.name}
                            className={styles.characterImage}
                        />
                        <div className={styles.characterInfo}>
                            <h3 className={styles.characterName}>{character.name}</h3>
                            <div className={styles.statGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>HP:</span>
                                    <span className={styles.statValue}>{hp.toFixed(2)}</span>
                                    {itemHPBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemHPBonus.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Strength:</span>
                                    <span className={styles.statValue}>{strength.toFixed(2)}</span>
                                    {itemStrengthBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemStrengthBonus.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Will:</span>
                                    <span className={styles.statValue}>{will.toFixed(2)}</span>
                                    {itemWillBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemWillBonus.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Destiny Points:</span>
                                    <span className={styles.statValue}>{character.pointsOfDestiny.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        {equippedCard && (
                            <div className={styles.equippedItemContainer}>
                                <h4>Equipped: {equippedCard.title || equippedCard.name}</h4>
                                {equippedCard.imageId && (
                                    <img
                                        src={`${API_BASE_URL}/files/${equippedCard.imageId}`}
                                        alt={equippedCard.title || equippedCard.name || "Equipped Item"}
                                        className={styles.equippedItemImage}
                                    />
                                )}
                                <div className={styles.itemBonuses}>
                                    {equippedCard.bonusStrength > 0 && <p>+{equippedCard.bonusStrength.toFixed(2)} Strength</p>}
                                    {equippedCard.bonusWile > 0 && <p>+{equippedCard.bonusWile.toFixed(2)} Will</p>}
                                    {equippedCard.bonusHP > 0 && <p>+{equippedCard.bonusHP.toFixed(2)} HP</p>}
                                </div>
                                <button onClick={handleUnequipItem} className={styles.unequipButton}>
                                    Unequip
                                </button>
                            </div>
                        )}
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
                    startingFieldId && !isFighting && !hasWonFight && (
                        <FieldCardsDisplay
                            fieldId={startingFieldId}
                            onFight={handleFight}
                            onEquipItem={handleEquipItem}
                        />
                    )
                )}
                {fightResult && <p>{fightResult}</p>}
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
                        <p>Dice Roll Result: {diceRollResult}</p>
                    )}
                </div>
                {!isRolling && diceRollResult !== null && !isMoved && (
                    <div className={styles.moveButtons}>
                        <button onClick={() => handleMove("left")}>Go Left</button>
                        <button onClick={() => handleMove("right")}>Go Right</button>
                    </div>
                )}
                <div className={styles.cedule}>
                    <img src={cedule} alt="Description image" />
                    <img src={cedule} alt="Description image" />
                    <img src={cedule} alt="Description image" />
                </div>
                {showDiceRollButton && (
                    <Button text="Roll Dice" onClick={handleFilterAndMove} disabled={gameOver} />
                )}
                {fightResult && <p>{fightResult}</p>}
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
                                        onEquip={(card) => handleEquipItem(card as Card)}
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
                    inventory={inventory.filter(id => id !== undefined && id !== null)}
                    onRemoveItem={(itemId) => {
                        if (typeof removeItemFromInventory === 'function') {
                            removeItemFromInventory(itemId);
                        }
                    }}
                    equippedItemsIds={equippedItemIds.filter(id => id !== undefined && id !== null)}
                    onEquipItem={(card) => {
                        if (card && card.id) handleEquipItem(card as Card);
                    }}
                    onUnequipItem={handleUnequipItem}
                    maxCapacity={8}
                />
                {notification && (
                    <div className={styles.notification}>
                        {notification}
                        <button onClick={() => setNotification(null)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomNavigate;