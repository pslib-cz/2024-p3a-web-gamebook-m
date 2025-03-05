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
    isBoss?: boolean;
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

type AttackType = "strength" | "will" | "boss";

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
        addItemToInventory = () => { },
        removeItemFromInventory = () => { },
        equippedItemIds: contextEquippedItemIds = [],
        equipItem: contextEquipItem = () => { },
        unequipItem: contextUnequipItem = () => { },
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
    const [showBossChoice, setShowBossChoice] = useState(false);
    const [showNextDifficultyButton, setShowNextDifficultyButton] = useState(false);
    const [hasWonBossFight, setHasWonBossFight] = useState(false);

    const [tempStrengthBoost, setTempStrengthBoost] = useState(0);
    const [tempWillBoost, setTempWillBoost] = useState(0);
    const [isBossFight, setIsBossFight] = useState(false);
    const [forceBossFight, setForceBossFight] = useState(false);

    const startingFieldId = id ? parseInt(id, 10) : null;

    const [strengthBonusFromEnemies, setStrengthBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("strengthBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });
    const [willBonusFromEnemies, setWillBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("willBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });

    const baseStrength = character?.strength || 0;
    const baseWill = character?.will || 0;
    const baseHP = character?.maxHP || 10;

    const itemStrengthBonus = equippedCard?.bonusStrength || 0;
    const itemWillBonus = equippedCard?.bonusWile || 0;
    const itemHPBonus = equippedCard?.bonusHP || 0;

    const strength = baseStrength + strengthBonusFromEnemies + itemStrengthBonus + tempStrengthBoost;
    const will = baseWill + willBonusFromEnemies + itemWillBonus + tempWillBoost;

    const [difficulty, setDifficulty] = useState(() => {
        const savedDifficulty = localStorage.getItem("currentDifficulty");
        return savedDifficulty ? parseInt(savedDifficulty, 10) : 1;
    });

    const isBossEnemy = (enemy: any, field: Field | null) => {
        console.log("BOSS DETECTION DEBUG:");
        console.log("- Field type:", field?.type);
        console.log("- ShowBossButtons state:", showBossButtons);
        console.log("- Enemy:", enemy);
        console.log("- isBossFight state:", isBossFight);
        console.log("- forceBossFight state:", forceBossFight);
        console.log("- Enemy isBoss property:", enemy?.isBoss);

        const fieldIsBossType = field?.type === "Boss";
        console.log("- Field is Boss type:", fieldIsBossType);

        const nameContainsBoss = enemy?.name?.toLowerCase().includes("boss") || false;
        console.log("- Enemy name contains 'boss':", nameContainsBoss);

        const hasTempBoost = isBossFight;
        console.log("- Has temporary boss boost:", hasTempBoost);

        const isVeryStrong = enemy?.strength >= 20 || enemy?.will >= 20;
        console.log("- Enemy is very strong:", isVeryStrong);

        const hasIsBossFlag = enemy?.isBoss === true;
        console.log("- Enemy has isBoss flag:", hasIsBossFlag);

        const isBoss = forceBossFight || fieldIsBossType || showBossButtons || nameContainsBoss ||
                       hasTempBoost || isVeryStrong || hasIsBossFlag;
        console.log("FINAL BOSS DETECTION RESULT:", isBoss);

        return isBoss;
    };

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
        const storedData = localStorage.getItem('gameData');
        if (storedData) {
            const { strengthBonus, willBonus } = JSON.parse(storedData);
            setStrengthBonusFromEnemies(strengthBonus);
            setWillBonusFromEnemies(willBonus);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gameData', JSON.stringify({
            strengthBonus: strengthBonusFromEnemies,
            willBonus: willBonusFromEnemies
        }));
    }, [strengthBonusFromEnemies, willBonusFromEnemies]);

    useEffect(() => {
        localStorage.setItem("currentDifficulty", difficulty.toString());
        console.log("RoomNavigation: Difficulty updated and saved to localStorage:", difficulty);
    }, [difficulty]);

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
        setHasWonBossFight(false);
        setShowNextDifficultyButton(false);
        
        setTempStrengthBoost(0);
        setTempWillBoost(0);
        setIsBossFight(false);
        setForceBossFight(false);
        
        if (character && typeof setHp === 'function') {
            setHp(character.maxHP || 10);
        }
        localStorage.setItem("currentHP", character?.maxHP.toString() || "10");
        localStorage.setItem("strengthBonusFromEnemies", "0");
        localStorage.setItem("willBonusFromEnemies", "0");
        setStrengthBonusFromEnemies(0);
        setWillBonusFromEnemies(0);
        
        setDifficulty(1);
        localStorage.setItem("currentDifficulty", "1");
        
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

    const loadNextDifficultyField = async (newDifficulty: number) => {
        console.log("RoomNavigation: Loading fields for difficulty level:", newDifficulty);
        try {
            const response = await fetch(`${API_BASE_URL}/fields`);
            if (!response.ok) {
                throw new Error("Failed to load fields.");
            }
            const data = await response.json();
            
            let allFields: Field[] = [];
            if (Array.isArray(data)) {
                allFields = data;
            } else if (data.items && Array.isArray(data.items)) {
                allFields = data.items;
            } else {
                for (const key of Object.keys(data)) {
                    const value = data[key];
                    if (Array.isArray(value)) {
                        allFields = value;
                        break;
                    }
                }
            }
            
            if (allFields.length === 0) {
                setError("Error: Could not find fields in API response");
                return;
            }
            
            const targetDifficultyFields = allFields.filter((field: Field) => field.difficulty === newDifficulty);
            
            if (targetDifficultyFields.length === 0) {
                setError(`No fields found for difficulty level ${newDifficulty}.`);
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * targetDifficultyFields.length);
            const nextField = targetDifficultyFields[randomIndex];
            
            setDifficulty(newDifficulty);
            localStorage.setItem("currentDifficulty", newDifficulty.toString());
            
            setHasWonBossFight(false);
            setShowNextDifficultyButton(false);
            
            navigate(`/game/${nextField.fieldId}`);
        } catch (err) {
            console.error("RoomNavigation: Error loading next difficulty fields:", err);
            setError("Error loading fields of next difficulty level.");
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
            setHasWonBossFight(false);
            setShowDiceRollButton(false);
            setShowNextDifficultyButton(false);
            setAttackType(null);
            
            setTempStrengthBoost(0);
            setTempWillBoost(0);
            setIsBossFight(false);
            setForceBossFight(false);
            
            const isBossField = fetchedField.type === "Boss";
            setShowBossButtons(isBossField);
            
            if (fetchedField.difficulty !== difficulty) {
                setDifficulty(fetchedField.difficulty);
                localStorage.setItem("currentDifficulty", fetchedField.difficulty.toString());
            }
        } catch (err) {
            console.error("RoomNavigation: Error loading field data:", err);
            setError(`Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFight = useCallback(
        async (enemyStrength: number, enemyWill: number, attackType: AttackType) => {
            if (gameOver) return;

            let isBossFightLocal = false;
            if (attackType === "boss") {
                console.log("RoomNavigation: 'boss' attack type detected - switching to strength attack type");
                attackType = "strength";
                isBossFightLocal = true;
                if (!isBossFight) {
                    console.log("RoomNavigation: Activating boss mode due to 'boss' attack type");
                    setIsBossFight(true);
                    setTempStrengthBoost(100);
                    setTempWillBoost(100);
                    setForceBossFight(true);
                }
            }

            console.log("RoomNavigation: Starting fight with enemy strength:", enemyStrength, "will:", enemyWill);
            console.log(`RoomNavigation: Player stats: strength ${strength.toFixed(2)}, will ${will.toFixed(2)}`);
            if (tempStrengthBoost > 0 || tempWillBoost > 0) {
                console.log(`RoomNavigation: Including temporary boost: +${tempStrengthBoost} strength, +${tempWillBoost} will`);
            }

            const playerStrength = strength;
            const playerWill = will;
            const playerRoll = Math.floor(Math.random() * 6) + 1;
            const enemyRoll = Math.floor(Math.random() * 6) + 1;
            const playerTotal = attackType === "strength" ? playerStrength + playerRoll : playerWill + playerRoll;
            const enemyTotal = attackType === "strength" ? enemyStrength + enemyRoll : enemyWill + enemyRoll;

            console.log(`RoomNavigation: Player rolls ${playerRoll}, total ${playerTotal.toFixed(2)}`);
            console.log(`RoomNavigation: Enemy rolls ${enemyRoll}, total ${enemyTotal.toFixed(2)}`);

            let resultMessage = "";
            let damage = 0;

            const mockEnemy = {
                strength: enemyStrength,
                will: enemyWill,
                name: currentEnemy?.name || "",
                isBoss: currentEnemy?.isBoss || isBossFightLocal
            };

            const isBoss = isBossEnemy(mockEnemy, field);
            console.log("FINAL BOSS DETERMINATION:", isBoss, "isBossFightLocal=", isBossFightLocal);

            if (playerTotal > enemyTotal) {
                damage = playerTotal - enemyTotal;
                resultMessage = `You win! (You: ${playerTotal.toFixed(2)}, Enemy: ${enemyTotal.toFixed(2)}). You deal ${damage.toFixed(2)} damage!`;
                setHasWonFight(true);

                let strengthGain, willGain;
                if (isBoss) {
                    strengthGain = Math.max((enemyStrength / 10) * 5, 5);
                    willGain = Math.max((enemyWill / 10) * 5, 5);
                    console.log(`BOSS DEFEATED! Awarding ${strengthGain.toFixed(2)} strength and ${willGain.toFixed(2)} will bonus!`);
                } else {
                    strengthGain = enemyStrength / 10;
                    willGain = enemyWill / 10;
                }

                const newStrengthBonus = strengthBonusFromEnemies + strengthGain;
                const newWillBonus = willBonusFromEnemies + willGain;
                localStorage.setItem("strengthBonusFromEnemies", newStrengthBonus.toString());
                localStorage.setItem("willBonusFromEnemies", newWillBonus.toString());
                setStrengthBonusFromEnemies(newStrengthBonus);
                setWillBonusFromEnemies(newWillBonus);

                if (isBoss) {
                    setHasWonBossFight(true);
                    const newDifficultyLevel = difficulty + 1;
                    setDifficulty(newDifficultyLevel);
                    localStorage.setItem("currentDifficulty", newDifficultyLevel.toString());
                    setFightResult(`You defeated the BOSS! The path to difficulty ${newDifficultyLevel} is now open. Your strength increased by ${strengthGain.toFixed(2)} and will by ${willGain.toFixed(2)}!`);
                    setShowNextDifficultyButton(true);
                    setShowDiceRollButton(false);

                    try {
                        const victoryAudio = new Audio('/sounds/victory.mp3');
                        victoryAudio.play().catch(e => console.log('Audio play failed:', e));
                    } catch (e) {
                        console.log('Victory sound not available');
                    }

                    const container = document.querySelector(`.${styles.content}`);
                    if (container) {
                        container.classList.add(styles.victoryEffect);
                        setTimeout(() => {
                            container.classList.remove(styles.victoryEffect);
                        }, 3000);
                    }
                } else {
                    setShowDiceRollButton(true);
                    setFightResult(resultMessage);
                }
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
                setFightResult(resultMessage);
            } else {
                resultMessage = `It's a draw! (You: ${playerTotal.toFixed(2)}, Enemy: ${enemyTotal.toFixed(2)})`;
                setHasWonFight(false);
                setFightResult(resultMessage);
            }

            if (isBossFightLocal) {
                console.log("RoomNavigation: Removing temporary boss fight boost and flags");
                setTempStrengthBoost(0);
                setTempWillBoost(0);
                setIsBossFight(false);
                setForceBossFight(false);
            }

            setIsFighting(false);
            setAttackType(null);
            console.log("RoomNavigation: Fight result:", resultMessage);
        },
        [strength, will, setHp, setGameOver, gameOver, strengthBonusFromEnemies, willBonusFromEnemies, field, currentEnemy, difficulty, isBossEnemy, isBossFight, forceBossFight, tempStrengthBoost, tempWillBoost]
    );

    const handleProceedToNextDifficulty = () => {
        console.log("RoomNavigation: Player chose to proceed to next difficulty level:", difficulty);
        setLoading(true);
        setTimeout(() => {
            loadNextDifficultyField(difficulty);
            setLoading(false);
        }, 500);
    };

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
            const currentDifficultyFields = allFields.filter((f: Field) => f.difficulty === difficulty);

            if (currentDifficultyFields.length === 0) {
                const fallbackFields = allFields.filter((f: Field) => f.difficulty === 1);
                if (fallbackFields.length === 0) {
                    setError("No fields found for any difficulty level.");
                    return;
                }
                const nextField = fallbackFields[0];
                navigate(`/game/${nextField.fieldId}`);
                return;
            }

            const totalFields = currentDifficultyFields.length;
            const currentIndex = currentDifficultyFields.findIndex((f: Field) => f.fieldId === field.fieldId);

            if (currentIndex === -1) {
                setError(`Current field not found in difficulty ${difficulty} fields.`);
                return;
            }

            const moveBy = direction === "left" ? -diceRollResult : diceRollResult;
            let newIndex = (currentIndex + moveBy) % totalFields;
            if (newIndex < 0) newIndex = totalFields + newIndex;

            const nextField = currentDifficultyFields[newIndex];
            navigate(`/game/${nextField.fieldId}`);
            if (typeof setIsMoved === 'function') setIsMoved(true);
            setDiceRollResult(null);
            setShowDiceRollButton(false);
        } catch (err) {
            console.error("RoomNavigation: Error in handleMove:", err);
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
        setShowBossChoice(false);
        setTempStrengthBoost(100);
        setTempWillBoost(100);
        setIsBossFight(true);
        setForceBossFight(true);

        if (field?.enemyId) {
            fetch(`${API_BASE_URL}/enemies/${field.enemyId}`)
                .then(response => response.json())
                .then((enemy: Enemy) => {
                    if (enemy) {
                        enemy.name = enemy.name + " (BOSS)";
                        enemy.isBoss = true;
                        setCurrentEnemy(enemy);
                        setIsFighting(true);
                    }
                })
                .catch(error => console.error("RoomNavigation: Error fetching boss enemy:", error));
        } else {
            const defaultBoss: Enemy = {
                enemyId: 9999,
                name: "Mighty Boss",
                description: "A powerful enemy that blocks your path to the next difficulty.",
                strength: 10,
                will: 10,
                imageId: field?.imageId || null,
                isBoss: true
            };
            setCurrentEnemy(defaultBoss);
            setIsFighting(true);
        }
    };

    const handleDontFightBoss = () => {
        setShowBossChoice(false);
        alert("You chose not to fight the boss. Continue your journey...");
    };

    useEffect(() => {
        if (field && field.type === "Boss") {
            setShowBossButtons(true);
            setShowBossChoice(true);
        } else {
            setShowBossButtons(false);
            setShowBossChoice(false);
        }
    }, [field]);

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

    const shouldShowBossChoice = useCallback(() => {
        return field?.type === "Boss";
    }, [field]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: Field with ID {startingFieldId} not found.</p>;

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
            className={`${styles.container} ${fieldImage ? styles.withBackground : ""} ${isBossFight ? styles.bossBoostActive : ''}`}
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
                                    <span className={styles.statValue}>{(baseStrength + strengthBonusFromEnemies + itemStrengthBonus).toFixed(2)}</span>
                                    {itemStrengthBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemStrengthBonus.toFixed(2)}</span>
                                    )}
                                    {tempStrengthBoost > 0 && (
                                        <span className={styles.tempBonus}>+{tempStrengthBoost} BOSS BOOST!</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Will:</span>
                                    <span className={styles.statValue}>{(baseWill + willBonusFromEnemies + itemWillBonus).toFixed(2)}</span>
                                    {itemWillBonus > 0 && (
                                        <span className={styles.statBonus}>+{itemWillBonus.toFixed(2)}</span>
                                    )}
                                    {tempWillBoost > 0 && (
                                        <span className={styles.tempBonus}>+{tempWillBoost} BOSS BOOST!</span>
                                    )}
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Destiny Points:</span>
                                    <span className={styles.statValue}>{character.pointsOfDestiny.toFixed(2)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Difficulty:</span>
                                    <span className={styles.statValue}>{difficulty}</span>
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
                    <h1>{field?.title}</h1>
                </div>
                <p>{field?.description}</p>

                {showBossButtons ? (
                    <>
                        {showBossChoice && (
                            <div className={styles.bossChoiceDialog} style={{ zIndex: 10000000 }}>
                                <p>This is a Boss! Do you want to fight?</p>
                                <Button text="Fight (Get +100 Boost)" onClick={handleFightBoss} />
                                <Button text="Don't Fight" onClick={handleDontFightBoss} />
                            </div>
                        )}
                        {!showBossChoice && (
                            <BossCard
                                title={field?.title}
                                type={field?.type}
                                description={field?.description}
                            />
                        )}
                        {currentEnemy && (
                            <EnemyCard
                                {...currentEnemy}
                                onFight={(enemyStrength, enemyWill, attackType) => {
                                    setIsFighting(true);
                                    handleFight(enemyStrength, enemyWill, currentEnemy.isBoss ? "boss" : attackType);
                                }}
                            />
                        )}
                    </>
                ) : (
                    field && (
                        <FieldCardsDisplay
                            fieldId={startingFieldId}
                            onFight={(enemyStrength, enemyWill, attackType) => {
                                console.log("RoomNavigation: Fight initiated from FieldCardsDisplay, attackType =", attackType);
                                setIsFighting(true);
                                if (attackType === "boss") {
                                    console.log("RoomNavigation: FORCE BOSS MODE ACTIVATED from FieldCardsDisplay");
                                    setIsBossFight(true);
                                    setTempStrengthBoost(100);
                                    setTempWillBoost(100);
                                    setForceBossFight(true);
                                }
                                handleFight(enemyStrength, enemyWill, attackType || "strength");
                            }}
                            onEquipItem={handleEquipItem}
                            shouldShowBossChoice={shouldShowBossChoice}
                            setShowBossChoice={setShowBossChoice}
                        />
                    )
                )}

                {fightResult && !hasWonBossFight && <p>{fightResult}</p>}

                {hasWonBossFight && showNextDifficultyButton && (
                    <div className={styles.bossDefeatMessage}>
                        <h3>Boss Defeated!</h3>
                        <p>You have vanquished the boss and can now proceed to the next difficulty level.</p>
                        <div className={styles.nextDifficultyWrapper}>
                            <div className={styles.nextDifficultyButton}>
                                <Button
                                    text={`Proceed to Difficulty ${difficulty}`}
                                    onClick={handleProceedToNextDifficulty}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {!hasWonBossFight && (
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
                            diceRollResult !== null && <p>Dice Roll Result: {diceRollResult}</p>
                        )}
                    </div>
                )}

                {!hasWonBossFight && !isRolling && diceRollResult !== null && !isMoved && (
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

                {showDiceRollButton && !hasWonBossFight && (
                    <Button text="Roll Dice" onClick={handleFilterAndMove} disabled={gameOver} />
                )}

                {field?.items && field.items.length > 0 && (
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
                    equippedItemIds={equippedItemIds.filter(id => id !== undefined && id !== null)}
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