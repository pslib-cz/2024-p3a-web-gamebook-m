import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RoomNavigate.module.css";
import Button from '../components/Button/Button.tsx';
import FieldCardsDisplay from "../components/FieldsCardDisplay";
import Inventory from "../components/Inventory";
import ItemCard from "../components/ItemCard";
import BossCard from "../components/BossCard";
import EnemyCard from "../components/EnemyCard";
import VictoryScreen from "../components/VictoryScreen";
import { useGameContext } from "../context/Gamecontext";
import useItemStats from "../hooks/useItemStats";
import ItemStatsDebugger from "../components/ItemStatsDebugger.tsx";

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
        // @ts-ignore
        gameOver: contextGameOver,
        // @ts-ignore
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
    // @ts-ignore
    const [attackType, setAttackType] = useState<AttackType | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [showBossChoice, setShowBossChoice] = useState(false);
    const [showNextDifficultyButton, setShowNextDifficultyButton] = useState(false);
    const [hasWonBossFight, setHasWonBossFight] = useState(false);
    const [hasWonGame, setHasWonGame] = useState(false);

    const [tempStrengthBoost, setTempStrengthBoost] = useState(0);
    const [tempWillBoost, setTempWillBoost] = useState(0);
    const [isBossFight, setIsBossFight] = useState(false);
    const [forceBossFight, setForceBossFight] = useState(false);

    const startingFieldId = id ? parseInt(id, 10) : null;

    // Enemy bonuses
    const [strengthBonusFromEnemies, setStrengthBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("strengthBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });
    const [willBonusFromEnemies, setWillBonusFromEnemies] = useState(() => {
        const stored = localStorage.getItem("willBonusFromEnemies");
        return stored ? parseFloat(stored) || 0 : 0;
    });

    // Base character stats
    const baseStrength = character?.strength || 0;
    const baseWill = character?.will || 0;
    const baseHP = character?.maxHP || 10;

    // Use the custom hook to manage item stats
    const itemStats = useItemStats(
        // @ts-ignore
        character,
        contextEquippedItemIds,
        baseStrength,
        baseWill,
        baseHP,
        strengthBonusFromEnemies,
        willBonusFromEnemies
    );

    // Extract values from the hook
    const itemStrengthBonus = itemStats.strengthBonus;
    const itemWillBonus = itemStats.willBonus;
    const itemHPBonus = itemStats.hpBonus;
    const maxHP = itemStats.maxHP;

    // Total stats calculation
    const strength = itemStats.totalStrength + tempStrengthBoost;
    const will = itemStats.totalWill + tempWillBoost;

    const [difficulty, setDifficulty] = useState(() => {
        const savedDifficulty = localStorage.getItem("currentDifficulty");
        return savedDifficulty ? parseInt(savedDifficulty, 10) : 1;
    });

    const isBossEnemy = (enemy: any, field: Field | null) => {
        const fieldIsBossType = field?.type === "Boss";
        const nameContainsBoss = enemy?.name?.toLowerCase().includes("boss") || false;
        const hasTempBoost = isBossFight;
        const isVeryStrong = enemy?.strength >= 20 || enemy?.will >= 20;
        const hasIsBossFlag = enemy?.isBoss === true;

        return forceBossFight || fieldIsBossType || showBossButtons || nameContainsBoss ||
               hasTempBoost || isVeryStrong || hasIsBossFlag;
    };

    // Update HP when maxHP changes from the hook
    useEffect(() => {
        if (character && typeof setHp === 'function') {
            const storedCurrentHP = localStorage.getItem("currentHP");
            
            if (storedCurrentHP) {
                // Don't exceed the new maxHP
                const currentHP = Math.min(parseFloat(storedCurrentHP), maxHP);
                setHp(currentHP);
            } else {
                // If no stored HP, set to maxHP
                setHp(maxHP);
                localStorage.setItem("currentHP", maxHP.toString());
            }
        }
    }, [maxHP, character, setHp]);

    // Load enemy bonuses from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem('gameData');
        if (storedData) {
            try {
                const { strengthBonus, willBonus } = JSON.parse(storedData);
                if (typeof strengthBonus === 'number' && !isNaN(strengthBonus)) {
                    setStrengthBonusFromEnemies(strengthBonus);
                }
                if (typeof willBonus === 'number' && !isNaN(willBonus)) {
                    setWillBonusFromEnemies(willBonus);
                }
            } catch (error) {
                console.error("Error parsing gameData from localStorage:", error);
            }
        }
    }, []);

    // Save enemy bonuses to localStorage when they change
    useEffect(() => {
        localStorage.setItem('gameData', JSON.stringify({
            strengthBonus: strengthBonusFromEnemies,
            willBonus: willBonusFromEnemies
        }));
    }, [strengthBonusFromEnemies, willBonusFromEnemies]);

    // Save difficulty to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("currentDifficulty", difficulty.toString());
    }, [difficulty]);

    // Load inventory and equipped items from localStorage
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

                const storedEquippedItemIds = localStorage.getItem("equippedItemIds");
                if (storedEquippedItemIds) {
                    const parsedIds = JSON.parse(storedEquippedItemIds);
                    if (contextEquippedItemIds.length === 0 && Array.isArray(parsedIds)) {
                        parsedIds.forEach(itemId => {
                            if (typeof contextEquipItem === 'function') {
                                contextEquipItem(itemId);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Error loading data from localStorage:", error);
            }
        };

        loadPersistedData();
    }, [addItemToInventory, contextEquipItem, inventory, contextEquippedItemIds]);

    // Save inventory to localStorage when it changes
    useEffect(() => {
        if (inventory.length > 0) {
            localStorage.setItem("playerInventory", JSON.stringify(inventory));
        }
    }, [inventory]);

    // Save equipped items to localStorage when they change
    useEffect(() => {
        if (contextEquippedItemIds.length > 0) {
            localStorage.setItem("equippedItemIds", JSON.stringify(contextEquippedItemIds));
        } else {
            localStorage.removeItem("equippedItemIds");
        }
    }, [contextEquippedItemIds]);

    const fetchFieldImage = useCallback(async (imageId: number | null) => {
        if (!imageId) {
            setFieldImage(null);
            return;
        }
        try {
            const response = await fetch(`api/files/${imageId}`);
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
        setHasWonGame(false);
        setHasWonFight(false);
        
        setTempStrengthBoost(0);
        setTempWillBoost(0);
        setIsBossFight(false);
        setForceBossFight(false);
        
        // Reset HP to base value
        if (character && typeof setHp === 'function') {
            setHp(character.maxHP || 10);
        }
        localStorage.setItem("currentHP", character?.maxHP.toString() || "10");
        
        // Reset enemy bonuses
        localStorage.setItem("strengthBonusFromEnemies", "0");
        localStorage.setItem("willBonusFromEnemies", "0");
        setStrengthBonusFromEnemies(0);
        setWillBonusFromEnemies(0);
        
        // Reset item bonuses
        localStorage.setItem("itemStrengthBonus", "0");
        localStorage.setItem("itemWillBonus", "0");
        localStorage.setItem("itemHPBonus", "0");
        
        if (startingFieldId) navigate(`/game/${startingFieldId}`);
        setIsFighting(false);
    };

    const loadNextDifficultyField = async (newDifficulty: number) => {
        try {
            const response = await fetch(`api/fields`);
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
            
            // Check if there are fields at the next difficulty level
            if (targetDifficultyFields.length === 0) {
                // No more fields available - player has won the game!
                setHasWonGame(true);
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * targetDifficultyFields.length);
            const nextField = targetDifficultyFields[randomIndex];
            
            setDifficulty(newDifficulty);
            localStorage.setItem("currentDifficulty", newDifficulty.toString());
            
            setHasWonBossFight(false);
            setShowNextDifficultyButton(false);
            setHasWonFight(false);
            
            navigate(`/game/${nextField.fieldId}`);
        } catch (err) {
            console.error("Error loading next difficulty fields:", err);
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
            const response = await fetch(`api/fields/${startingFieldId}`);
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
            console.error("Error loading field data:", err);
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
                attackType = "strength";
                isBossFightLocal = true;
                if (!isBossFight) {
                    setIsBossFight(true);
                    setTempStrengthBoost(100);
                    setTempWillBoost(100);
                    setForceBossFight(true);
                }
            }

            // Use the total calculated strength and will that include all bonuses
            // These values come from our useItemStats hook
            const playerStrength = strength;  // This includes base + enemy bonus + item bonus + temp boost
            const playerWill = will;          // This includes base + enemy bonus + item bonus + temp boost
            
            console.log("Combat stats:", {
                playerStrength,
                playerWill,
                baseStrength,
                baseWill,
                enemyBonusStr: strengthBonusFromEnemies,
                enemyBonusWill: willBonusFromEnemies,
                itemBonusStr: itemStrengthBonus,
                itemBonusWill: itemWillBonus,
                tempBoostStr: tempStrengthBoost,
                tempBoostWill: tempWillBoost
            });

            const playerRoll = Math.floor(Math.random() * 6) + 1;
            const enemyRoll = Math.floor(Math.random() * 6) + 1;
            const playerTotal = attackType === "strength" ? playerStrength + playerRoll : playerWill + playerRoll;
            const enemyTotal = attackType === "strength" ? enemyStrength + enemyRoll : enemyWill + enemyRoll;

            let resultMessage = "";
            let damage = 0;

            const mockEnemy = {
                strength: enemyStrength,
                will: enemyWill,
                name: currentEnemy?.name || "",
                isBoss: currentEnemy?.isBoss || isBossFightLocal
            };

            const isBoss = isBossEnemy(mockEnemy, field);

            if (playerTotal > enemyTotal) {
                damage = playerTotal - enemyTotal;
                resultMessage = `You win! (You: ${playerTotal.toFixed(1)}, Enemy: ${enemyTotal.toFixed(1)}). You deal ${damage.toFixed(1)} damage!`;
                setHasWonFight(true);

                let strengthGain, willGain;
                if (isBoss) {
                    strengthGain = Math.max((enemyStrength / 10) * 5, 5);
                    willGain = Math.max((enemyWill / 10) * 5, 5);
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
                    setFightResult(`You defeated the BOSS! The path to difficulty ${newDifficultyLevel} is now open. Your strength increased by ${strengthGain.toFixed(1)} and will by ${willGain.toFixed(1)}!`);
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
                resultMessage = `You lose! (You: ${playerTotal.toFixed(1)}, Enemy: ${enemyTotal.toFixed(1)}). You take 1 damage!`;
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
                setHasWonFight(false);
            } else {
                resultMessage = `It's a draw! (You: ${playerTotal.toFixed(1)}, Enemy: ${enemyTotal.toFixed(1)})`;
                setHasWonFight(false);
                setFightResult(resultMessage);
            }

            if (isBossFightLocal) {
                setTempStrengthBoost(0);
                setTempWillBoost(0);
                setIsBossFight(false);
                setForceBossFight(false);
            }

            setIsFighting(false);
            setAttackType(null);
        },
        [strength, will, setHp, setGameOver, gameOver, strengthBonusFromEnemies, willBonusFromEnemies, field, currentEnemy, difficulty, isBossEnemy, isBossFight, forceBossFight, tempStrengthBoost, tempWillBoost, baseStrength, baseWill, itemStrengthBonus, itemWillBonus]
    );

    const handleProceedToNextDifficulty = () => {
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
            const response = await fetch(`api/fields`);
            if (!response.ok) {
                throw new Error("Failed to load fields.");
            }
            const data = await response.json();
            const allFields: Field[] = Array.isArray(data) ? data : Object.values(data).find(Array.isArray) || [];
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
            setHasWonFight(false); // Reset fight win state when moving
        } catch (err) {
            console.error("Error in handleMove:", err);
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
            // Only equip if we haven't reached the maximum number of equipped items
            if (contextEquippedItemIds.length < 8) {
                if (typeof contextEquipItem === 'function') {
                    contextEquipItem(card.id);
                }
                setShowDiceRollButton(true);
                
                // Log the item being equipped
                console.log("Equipped item:", card);
                console.log("Current equipped items:", contextEquippedItemIds);
                
                // Optional: show a notification when item is equipped
                const itemName = card.title || card.name || "Item";
                const strBonus = card.bonusStrength || 0;
                const willBonus = card.bonusWile || 0;
                const hpBonus = card.bonusHP || 0;
                
                let bonusText = "";
                if (strBonus > 0) bonusText += `+${strBonus} STR `;
                if (willBonus > 0) bonusText += `+${willBonus} WILL `;
                if (hpBonus > 0) bonusText += `+${hpBonus} HP`;
                
                if (bonusText) {
                    setNotification(`Equipped ${itemName} (${bonusText.trim()})`);
                } else {
                    setNotification(`Equipped ${itemName}`);
                }
                
                // Auto-close notification after 3 seconds
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            } else {
                setNotification("You can only equip up to 8 items at once. Unequip something first.");
            }
        },
        [contextEquipItem, contextEquippedItemIds]
    );

    const handleUnequipItem = useCallback((itemId: number) => {
        if (typeof contextUnequipItem === 'function') {
            contextUnequipItem(itemId);
        }
        // Only hide dice roll button if no items are equipped
        if (contextEquippedItemIds.length <= 1) {
            setShowDiceRollButton(false);
        }
    }, [contextUnequipItem, contextEquippedItemIds.length]);

    const handleFightBoss = () => {
        setShowBossChoice(false);
        setTempStrengthBoost(100);
        setTempWillBoost(100);
        setIsBossFight(true);
        setForceBossFight(true);

        if (field?.enemyId) {
            fetch(`api/enemies/${field.enemyId}`)
                .then(response => response.json())
                .then((enemy: Enemy) => {
                    if (enemy) {
                        enemy.name = enemy.name + " (BOSS)";
                        enemy.isBoss = true;
                        setCurrentEnemy(enemy);
                        setIsFighting(true);
                    }
                })
                .catch(error => console.error("Error fetching boss enemy:", error));
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
        
        // Calculate the next field ID (current field ID + 1)
        const currentFieldId = field?.fieldId || startingFieldId;
        if (currentFieldId) {
            const nextFieldId = currentFieldId + 1;
            console.log(`User chose to retreat from boss fight, navigating to next field (ID: ${nextFieldId})`);
            
            // Set loading state and navigate to the next field
            setLoading(true);
            setTimeout(() => {
                navigate(`/game/${nextFieldId}`);
                setLoading(false);
            }, 500);
        } else {
            // Fallback in case field ID is not available
            console.error("Could not determine current field ID for navigation");
            setShowDiceRollButton(true);
        }
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
// @ts-ignore
    const shouldShowBossChoice = useCallback(() => {
        return field?.type === "Boss";
    }, [field]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: Field with ID {startingFieldId} not found.</p>;

    // Show the game over screen if player HP is 0
    if (gameOver) {
        return (
            <div className={styles.gameOver}>
                <h1>Game Over!</h1>
                <p>Your HP reached 0.</p>
                <button onClick={resetGame}>Try Again</button>
            </div>
        );
    }

    // Show the victory screen if player has won the game
    if (hasWonGame) {
        return (
            <VictoryScreen 
            // @ts-ignore
                character={character}
                strengthBonusFromEnemies={strengthBonusFromEnemies}
                willBonusFromEnemies={willBonusFromEnemies}
                onRestart={resetGame}
            />
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
                            src={character.imageId ? `api/files/${character.imageId}` : "/default-character.png"}
                            alt={character.name}
                            className={styles.characterImage}
                        />
                        <div className={styles.characterInfo}>
                            <h3 className={styles.characterName}>{character.name}</h3>
                            <div className={styles.statGrid}>
                                {/* HP Stat with current/max display */}
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>HP:</span>
                                    <span className={styles.statValue}>{hp.toFixed(1)}</span>
                                    <span className={styles.statMaxValue}>/{maxHP.toFixed(1)}</span>
                                </div>
                                
                                {/* Strength Stat with breakdown */}
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Strength:</span>
                                    <span className={styles.statValue}>{strength.toFixed(1)}</span>
                                    <span className={styles.statBreakdown}>
                                        (Base: {baseStrength.toFixed(1)}
                                        {strengthBonusFromEnemies > 0 && ` + Enemy: ${strengthBonusFromEnemies.toFixed(1)}`}
                                        {itemStrengthBonus > 0 && ` + Items: ${itemStrengthBonus.toFixed(1)}`}
                                        {tempStrengthBoost > 0 && ` + Boss: ${tempStrengthBoost}`})
                                    </span>
                                </div>
                                
                                {/* Will Stat with breakdown */}
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Will:</span>
                                    <span className={styles.statValue}>{will.toFixed(1)}</span>
                                    <span className={styles.statBreakdown}>
                                        (Base: {baseWill.toFixed(1)}
                                        {willBonusFromEnemies > 0 && ` + Enemy: ${willBonusFromEnemies.toFixed(1)}`}
                                        {itemWillBonus > 0 && ` + Items: ${itemWillBonus.toFixed(1)}`}
                                        {tempWillBoost > 0 && ` + Boss: ${tempWillBoost}`})
                                    </span>
                                </div>
                                
                                {/* Additional stats */}
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Destiny Points:</span>
                                    <span className={styles.statValue}>{character.pointsOfDestiny?.toFixed(1) || 0}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Difficulty:</span>
                                    <span className={styles.statValue}>{difficulty}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Equipped items summary */}
                        <div className={styles.equippedItemContainer}>
                            <h4>Equipped Items: {contextEquippedItemIds.length}/8</h4>
                            {contextEquippedItemIds.length > 0 ? (
                                <div className={styles.equippedItemsSummary}>
                                    <div className={styles.totalBonuses}>
                                        {itemStrengthBonus > 0 && <p>+{itemStrengthBonus.toFixed(1)} Strength</p>}
                                        {itemWillBonus > 0 && <p>+{itemWillBonus.toFixed(1)} Will</p>}
                                        {itemHPBonus > 0 && <p>+{itemHPBonus.toFixed(1)} HP</p>}
                                    </div>
                                </div>
                            ) : (
                                <p>No items equipped</p>
                            )}
                        </div>
                    </div>
                )}
                
                <div className={styles.fieldInfo}>
                    <h1>{field?.title}</h1>
                </div>
                <p style={{ textAlign: 'center' }}>{field?.description}</p>

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
                                title={field?.title || ""}
                                type={field?.type || ""}
                                description={field?.description || ""}
                            />
                        )}
                        {currentEnemy && (
                            <EnemyCard
                                {...currentEnemy}
                                onFight={(enemyStrength, enemyWill, attackType) => {
                                    setIsFighting(true);
                                    handleFight(enemyStrength, enemyWill, currentEnemy.isBoss ? "boss" : attackType);
                                }}
                                hasWonFight={hasWonFight} // Pass the hasWonFight prop here
                            />
                        )}
                    </>
                ) : (
                    field && (
                        <FieldCardsDisplay
                            fieldId={startingFieldId ?? 0}
                            onFight={(enemyStrength, enemyWill, attackType) => {
                                setIsFighting(true);
                                if (attackType === "boss") {
                                    setIsBossFight(true);
                                    setTempStrengthBoost(100);
                                    setTempWillBoost(100);
                                    setForceBossFight(true);
                                }
                                handleFight(enemyStrength, enemyWill, attackType || "strength");
                            }}
                            onDontFightBoss={handleDontFightBoss} // Pass the same function used in boss choice dialog
                            onEquipItem={handleEquipItem}
                            setShowBossChoice={setShowBossChoice}
                            hasWonFight={hasWonFight}
                        />
                    )
                )}

                {fightResult && <p style={{ textAlign: 'center' }}>{fightResult}</p>}

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
                            diceRollResult !== null && <p style={{ textAlign: 'center' }}>Dice Roll Result: {diceRollResult}</p>
                        )}
                    </div>
                )}

                {!hasWonBossFight && !isRolling && diceRollResult !== null && !isMoved && (
                    <div className={styles.moveButtons}>
                        <button onClick={() => handleMove("left")}>Go Left</button>
                        <button onClick={() => handleMove("right")}>Go Right</button>
                    </div>
                )}


                {showDiceRollButton && !hasWonBossFight && (
                    <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0" }}>
                        <Button text="Roll Dice" onClick={handleFilterAndMove} disabled={gameOver} />
                    </div>
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
                    equippedItemIds={contextEquippedItemIds.filter(id => id !== undefined && id !== null)}
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
            
            {/* Optional item stats debugger - uncomment during development */}
            <ItemStatsDebugger showDebug={true} />
        </div>
    );
};

export default RoomNavigate;