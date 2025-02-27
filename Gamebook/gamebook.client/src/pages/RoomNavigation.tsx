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
import { useGameContext } from "../context/Gamecontext"; // Import the context

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

    // Use the game context with safeguards
    const contextValues = useGameContext();

    // Create local state as fallbacks for critical values
    const [localHp, setLocalHp] = useState<number>(10);
    const [localIsMoved, setLocalIsMoved] = useState<boolean>(false);

    // Safely destructure context with fallbacks
    const {
        character,
        fetchCharacter,
        inventory = [],
        addItemToInventory = () => { },
        removeItemFromInventory = () => { },
        equippedItemIds: contextEquippedItemIds = [],
        equipItem: contextEquipItem = () => { },
        unequipItem: contextUnequipItem = () => { },
    } = contextValues;

    // Use context values if available, otherwise use local state
    const hp = contextValues.hp !== undefined ? contextValues.hp : localHp;
    const setHp = typeof contextValues.setHp === 'function'
        ? contextValues.setHp
        : setLocalHp;

    const isMoved = contextValues.isMoved !== undefined ? contextValues.isMoved : localIsMoved;
    const setIsMoved = typeof contextValues.setIsMoved === 'function'
        ? contextValues.setIsMoved
        : setLocalIsMoved;

    const [field, setField] = useState<Field | null>(null);
    const [fieldImage, setFieldImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [diceRollResult, setDiceRollResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [canRoll, setCanRoll] = useState<boolean>(true);
    const [fightResult, setFightResult] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [isFighting, setIsFighting] = useState<boolean>(false);
    const [hasWonFight, setHasWonFight] = useState<boolean>(false);
    const [showDiceRollButton, setShowDiceRollButton] = useState(false);
    const [showBossButtons, setShowBossButtons] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
    const [attackType, setAttackType] = useState<AttackType | null>(null);
    const [equippedCard, setEquippedCard] = useState<Card | null>(null);
    const [equippedItemIds, setEquippedItemIds] = useState<number[]>(contextEquippedItemIds); // Local state for equipped item ids

    const startingFieldId = id ? parseInt(id, 10) : null;

    // Calculate stats based on character and equipped item
    const baseStrength = character?.strength || 0;
    const baseWill = character?.will || 0;
    const baseHP = character?.maxHP || 10;

    const itemStrengthBonus = equippedCard?.bonusStrength || 0;
    const itemWillBonus = equippedCard?.bonusWile || 0;
    const itemHPBonus = equippedCard?.bonusHP || 0;

    const strength = baseStrength + itemStrengthBonus;
    const will = baseWill + itemWillBonus;

    // Update character HP with bonus if equipped item changes
    useEffect(() => {
        if (character && typeof setHp === 'function') {
            const totalHP = baseHP + itemHPBonus;
            setHp(totalHP);

            // Uložení aktuálního HP do localStorage
            localStorage.setItem("currentHP", totalHP.toString());
            console.log("Ukládám aktuální HP do localStorage:", totalHP);
        }
    }, [character, baseHP, itemHPBonus, equippedCard, setHp]);

    // Načtení uloženého HP při prvním načtení
    useEffect(() => {
        const storedHP = localStorage.getItem("currentHP");
        if (storedHP && typeof setHp === 'function') {
            const parsedHP = parseInt(storedHP, 10);
            if (!isNaN(parsedHP)) {
                console.log("Načítám HP z localStorage:", parsedHP);
                setHp(parsedHP);
            }
        }
    }, [setHp]);

    // Persistentní ukládání inventáře a vybavených předmětů do localStorage
    useEffect(() => {
        // Načtení dat z localStorage při prvním načtení
        const loadPersistedData = () => {
            try {
                // Načtení inventáře
                const storedInventory = localStorage.getItem("playerInventory");
                if (storedInventory) {
                    const parsedInventory = JSON.parse(storedInventory);
                    // Pokud kontext neposkytuje inventář, načteme ho z localStorage
                    if (inventory.length === 0 && Array.isArray(parsedInventory)) {
                        console.log("Načítám inventář z localStorage:", parsedInventory);
                        // Toto je záloha pro případ, že kontext nefunguje
                        parsedInventory.forEach(itemId => {
                            if (typeof addItemToInventory === 'function') {
                                addItemToInventory(itemId);
                            }
                        });
                    }
                }

                // Načtení vybaveného předmětu
                const storedEquippedItemId = localStorage.getItem("equippedItemId");
                if (storedEquippedItemId) {
                    const itemId = parseInt(storedEquippedItemId, 10);
                    // Pokud není nic vybaveno v kontextu, načteme z localStorage
                    if (contextEquippedItemIds.length === 0 && !isNaN(itemId)) {
                        console.log("Načítám vybavený předmět z localStorage:", itemId);
                        // Toto je záloha pro případ, že kontext nefunguje
                        if (typeof contextEquipItem === 'function') {
                            contextEquipItem(itemId);
                        }
                    }
                }
            } catch (error) {
                console.error("Chyba při načítání dat z localStorage:", error);
            }
        };

        loadPersistedData();
    }, [addItemToInventory, contextEquipItem, inventory, contextEquippedItemIds]);

    // Ukládání inventáře do localStorage při každé změně
    useEffect(() => {
        if (inventory.length > 0) {
            localStorage.setItem("playerInventory", JSON.stringify(inventory));
            console.log("Ukládám inventář do localStorage:", inventory);
        }
    }, [inventory]);

    // Ukládání vybaveného předmětu do localStorage při každé změně
    useEffect(() => {
        if (contextEquippedItemIds.length > 0 && contextEquippedItemIds[0]) {
            localStorage.setItem("equippedItemId", contextEquippedItemIds[0].toString());
            console.log("Ukládám vybavený předmět do localStorage:", contextEquippedItemIds[0]);
        } else if (contextEquippedItemIds.length === 0) {
            localStorage.removeItem("equippedItemId");
            console.log("Odstraňuji vybavený předmět z localStorage");
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
    }, []);

    const resetGame = () => {
        setGameOver(false);
        setFightResult(null);

        // Use a safe way to set HP
        if (character && typeof setHp === 'function') {
            setHp(character.maxHP || 10);
        }

        if (startingFieldId)
            navigate(`/game/${startingFieldId}`);
        setIsFighting(false);
    };

    // Fetch equipped card when equippedItemId changes
    useEffect(() => {
        console.log("Context equipped item IDs changed:", contextEquippedItemIds);

        if (contextEquippedItemIds && contextEquippedItemIds.length > 0 && contextEquippedItemIds[0]) {
            console.log("Fetching equipped card with ID:", contextEquippedItemIds[0]);
            fetchEquippedCard(contextEquippedItemIds[0]);
        } else {
            console.log("No equipped item IDs found, clearing equipped card");
            setEquippedCard(null);
            setShowDiceRollButton(false);
        }
    }, [contextEquippedItemIds]);

    const fetchEquippedCard = async (cardId: number) => {
        if (!cardId) {
            console.log("No card ID provided to fetchEquippedCard");
            return;
        }

        console.log(`Fetching card with ID: ${cardId} from ${API_BASE_URL}/cards/${cardId}`);

        try {
            const response = await fetch(`${API_BASE_URL}/cards/${cardId}`);
            console.log("Fetch response:", response);

            if (response.ok) {
                const card = await response.json() as Card;
                console.log("Card data received:", card);
                setEquippedCard(card);
                setShowDiceRollButton(true);
            } else {
                console.error(`Failed to fetch card with ID ${cardId}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching equipped card:", error);
        }
    };

    // Load field data when ID changes
    useEffect(() => {
        if (startingFieldId) {
            loadData();
        }
    }, [startingFieldId]);

    // Load character data if not already in context
    useEffect(() => {
        if (!character) {
            // Try to load character from localStorage until context is fully implemented
            const storedCharacter = localStorage.getItem("selectedCharacter");
            if (storedCharacter) {
                try {
                    const parsedCharacter = JSON.parse(storedCharacter);
                    if (parsedCharacter.id && typeof fetchCharacter === 'function') {
                        // Fetch character from backend instead of using localStorage data
                        fetchCharacter(parsedCharacter.id);
                    }
                } catch (error) {
                    console.error("Error parsing character from localStorage:", error);
                    setError("Chyba při načítání postavy.");
                }
            } else {
                setError("Žádná postava nebyla vybrána.");
            }
        } else if (typeof setHp === 'function') {
            // If character is available in context, update local state if necessary
            // Adding a safety check for setHp
            setHp(character.maxHP);
        }
    }, [character, fetchCharacter, setHp]);

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

            const fetchedField = await response.json() as Field;
            console.log("API Response:", fetchedField);

            if (!fetchedField) {
                setError("No field data received.");
                setLoading(false);
                return;
            }

            fetchedField.type = fetchedField.type || "";

            if (fetchedField.imageId === undefined) {
                console.error("Incomplete field data received:", fetchedField);
                setError("Incomplete field data.");
                setLoading(false);
                return;
            }

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
            setError(`Nastala chyba: ${err}`);
        } finally {
            setLoading(false);
        }
    };

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
                setShowDiceRollButton(true); // Show the dice roll button on win
                console.log("You won! Setting showDiceRollButton to true");
            } else if (enemyTotal > playerTotal) {
                resultMessage = `You lose! (You: ${playerTotal}, Enemy: ${enemyTotal}). You take 1 damage!`;

                // Safely update HP
                if (typeof setHp === 'function') {
                    setHp(prevHp => {
                        const newHp = Math.max(0, prevHp - 1);
                        console.log(`Decreasing HP from ${prevHp} to ${newHp}`);
                        localStorage.setItem("currentHP", newHp.toString());
                         if (newHp <= 0) { // Check for game over
                            setGameOver(true);
                            setIsFighting(false);
                            return 0;
                         }
                        return newHp;
                    });
                }
                console.log("You lost! Decreasing HP");



            } else {
                resultMessage = `It's a draw! (You: ${playerTotal}, Enemy: ${enemyTotal})`;
                setHasWonFight(false);
            }

            setIsFighting(false);
            setAttackType(null);
            setFightResult(resultMessage);
        },
        [strength, will, setHp, gameOver]
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

            if (typeof setIsMoved === 'function') {
                setIsMoved(true);
            }

            setDiceRollResult(null);
            setShowDiceRollButton(false);
        } catch (err) {
            console.error("Error in handleMove:", err);
            setError("Chyba při načítání polí.");
        }
        setIsFighting(false);
        setHasWonFight(false);
    };

    const handleItemInteraction = (item: Item) => {
        console.log("Adding item to inventory:", item);
        if (typeof addItemToInventory === 'function') {
            // Přidej kontrolu kapacity inventáře
            if (inventory.length >= 8) {
                alert("Tvůj inventář je plný! Nejprve něco odlož.");
                return;
            }
            addItemToInventory(item.itemId);
        } else {
            console.error("addItemToInventory is not a function");
        }
    };

    const handleEquipItem = useCallback(
        async (card: Card) => {
            console.log("handleEquipItem called with card:", card);

            if (!card || !card.id) {
                console.error("Card ID is undefined, cannot equip card:", card);
                return;
            }

            try {
                if (typeof contextEquipItem === 'function') {
                    console.log("Calling contextEquipItem with ID:", card.id);
                    contextEquipItem(card.id);
                } else {
                    console.warn("contextEquipItem is not a function");
                }

                setEquippedCard(card);
                setShowDiceRollButton(true);
                console.log("Card equipped:", card);
            } catch (error) {
                console.error("Error equipping card:", error);
            }
        },
        [contextEquipItem]
    );

    const handleUnequipItem = useCallback(() => {
        console.log("Unequipping item");
        if (typeof contextUnequipItem === 'function') {
            contextUnequipItem();
        }

        setEquippedCard(null);
        setShowDiceRollButton(false);
    }, [contextUnequipItem]);

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

    // Auto Equip Logic (nekontroluje přepisování)
    useEffect(() => {
        if (inventory.length > 0) {
            const itemsToEquip = inventory.slice(0, 8); // Vezme prvních 8 položek

            itemsToEquip.forEach(itemId => {
                if (typeof contextEquipItem === 'function' && !contextEquippedItemIds.includes(itemId)) {
                    contextEquipItem(itemId); // Vybaví každou položku
                }
            });
        }
    }, [inventory, contextEquipItem, contextEquippedItemIds]);

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
                                    <span className={styles.statValue}>{hp}</span>
                                    {itemHPBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemHPBonus}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Síla:</span>
                                    <span className={styles.statValue}>{strength}</span>
                                    {itemStrengthBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemStrengthBonus}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Vůle:</span>
                                    <span className={styles.statValue}>{will}</span>
                                    {itemWillBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemWillBonus}</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Body osudu:</span>
                                    <span className={styles.statValue}>{character.pointsOfDestiny}</span>
                                </div>
                            </div>
                        </div>

                        {equippedCard && (
                            <div className={styles.equippedItemContainer}>
                                <h4>Vybaveno: {equippedCard.title || equippedCard.name}</h4>
                                {equippedCard.imageId && (
                                    <img
                                        src={`${API_BASE_URL}/files/${equippedCard.imageId}`}
                                        alt={equippedCard.title || equippedCard.name || "Vybavený předmět"}
                                        className={styles.equippedItemImage}
                                    />
                                )}
                                <div className={styles.itemBonuses}>
                                    {equippedCard.bonusStrength > 0 && <p>+{equippedCard.bonusStrength} Síla</p>}
                                    {equippedCard.bonusWile > 0 && <p>+{equippedCard.bonusWile} Vůle</p>}
                                    {equippedCard.bonusHP > 0 && <p>+{equippedCard.bonusHP} HP</p>}
                                </div>
                                <button
                                    onClick={handleUnequipItem}
                                    className={styles.unequipButton}
                                >
                                    Odložit
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
                    startingFieldId && !isFighting && !hasWonFight &&
                    <FieldCardsDisplay
                        fieldId={startingFieldId}
                        onFight={handleFight}
                        onEquipItem={handleEquipItem}
                    />
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
                    inventory={inventory.filter(id => id !== undefined && id !== null).slice(0, 8)}
                    onRemoveItem={(itemId) => {
                        console.log("Removing item from inventory:", itemId);
                        if (typeof removeItemFromInventory === 'function') {
                            removeItemFromInventory(itemId);
                        }
                    }}
                    equippedItemsIds={equippedItemIds.filter(id => id !== undefined && id !== null)}
                    onEquipItem={(card) => {
                        console.log("Equipping item:", card);
                        if (card && card.id) {
                            handleEquipItem(card as Card);
                        } else {
                            console.error("Invalid card or card ID:", card);
                        }
                    }}
                    onUnequipItem={() => {
                        console.log("Unequipping item");
                        handleUnequipItem();
                    }}
                    maxCapacity={8}
                />
            </div>
        </div>
    );
};

export default RoomNavigate;