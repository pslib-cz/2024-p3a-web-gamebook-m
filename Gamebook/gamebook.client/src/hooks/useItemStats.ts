import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/apiConfig';

// Define types
interface Card {
    id: number;
    cardId?: number;
    title: string;
    name?: string;
    type: string;
    description: string;
    specialAbilities: string | null;
    bonusWile: number | null;  // Note: API uses 'Wile' instead of 'Will'
    bonusStrength: number | null;
    bonusHP: number | null;
    classOnly: string | null;
    diceRollResults: { [key: number]: string } | null;
    imageId: number | null;
    enemyId: number | null;
}

interface Character {
    id: number;
    name: string;
    class: string;
    strength: number;
    will: number;
    hp: number;
    maxHP: number;
    pointsOfDestiny?: number;
}

interface ItemStats {
    strengthBonus: number;
    willBonus: number;
    hpBonus: number;
    totalStrength: number;
    totalWill: number;
    totalHP: number;
    maxHP: number;
    equippedCards: Card[];
    isLoading: boolean;
}

/**
 * Custom hook to manage item stats and apply them to character stats
 * 
 * @param character The character object from context
 * @param equippedItemIds Array of equipped item IDs
 * @param baseStrength Character's base strength
 * @param baseWill Character's base will
 * @param baseHP Character's base HP
 * @param enemyStrengthBonus Bonus strength from defeated enemies
 * @param enemyWillBonus Bonus will from defeated enemies
 * @returns ItemStats object containing all stat calculations
 */
export const useItemStats = (
    // @ts-ignore
    character: Character | null,
    equippedItemIds: number[],
    baseStrength: number,
    baseWill: number,
    baseHP: number,
    enemyStrengthBonus: number = 0,
    enemyWillBonus: number = 0
): ItemStats => {
    const [strengthBonus, setStrengthBonus] = useState(0);
    const [willBonus, setWillBonus] = useState(0);
    const [hpBonus, setHpBonus] = useState(0);
    const [equippedCards, setEquippedCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate total stats
    const totalStrength = baseStrength + enemyStrengthBonus + strengthBonus;
    const totalWill = baseWill + enemyWillBonus + willBonus;
    const totalHP = baseHP + hpBonus;
    const maxHP = baseHP + hpBonus;

    // Fetch and calculate all equipped item bonuses
    useEffect(() => {
        const fetchEquippedCards = async () => {
            if (!equippedItemIds || equippedItemIds.length === 0) {
                setEquippedCards([]);
                setStrengthBonus(0);
                setWillBonus(0);
                setHpBonus(0);
                
                // Update localStorage with reset values
                localStorage.setItem("itemStrengthBonus", "0");
                localStorage.setItem("itemWillBonus", "0");
                localStorage.setItem("itemHPBonus", "0");
                return;
            }

            setIsLoading(true);
            const cards: Card[] = [];
            let totalStrength = 0;
            let totalWill = 0;
            let totalHP = 0;

            try {
                // Filter out any invalid IDs
                const validItemIds = equippedItemIds.filter(id => id !== null && id !== undefined);
                
                for (const itemId of validItemIds) {
                    try {
                        console.log(`Fetching item ${itemId} details`);
                        const response = await fetch(`${API_BASE_URL}/cards/${itemId}`);
                        
                        if (!response.ok) {
                            console.error(`Error fetching item ${itemId}: ${response.status} ${response.statusText}`);
                            continue;
                        }
                        
                        const card = await response.json();
                        cards.push(card);
                        
                        // Add up bonuses - log each bonus for debugging
                        const strengthBonus = parseFloat(card.bonusStrength) || 0;
                        const willBonus = parseFloat(card.bonusWile) || 0;  // API uses 'Wile' instead of 'Will'
                        const hpBonus = parseFloat(card.bonusHP) || 0;
                        
                        console.log(`Item ${itemId} (${card.title || card.name}) bonuses:`, {
                            strength: strengthBonus,
                            will: willBonus,
                            hp: hpBonus
                        });
                        
                        totalStrength += strengthBonus;
                        totalWill += willBonus;
                        totalHP += hpBonus;
                    } catch (error) {
                        console.error(`Error processing item ${itemId}:`, error);
                    }
                }
                
                console.log("Total item bonuses calculated:", {
                    strength: totalStrength,
                    will: totalWill,
                    hp: totalHP
                });
                
                setEquippedCards(cards);
                setStrengthBonus(totalStrength);
                setWillBonus(totalWill);
                setHpBonus(totalHP);
                
                // Persist values to localStorage
                localStorage.setItem("itemStrengthBonus", totalStrength.toString());
                localStorage.setItem("itemWillBonus", totalWill.toString());
                localStorage.setItem("itemHPBonus", totalHP.toString());
                
                // Update current HP in localStorage if character has full health
                const storedCurrentHP = localStorage.getItem("currentHP");
                const storedMaxHP = localStorage.getItem("maxHP");
                
                // Always update max HP
                localStorage.setItem("maxHP", (baseHP + totalHP).toString());
                
                // If current HP equals previous max HP, we assume character was at full health
                // and should be updated to the new max HP
                if (storedCurrentHP && storedMaxHP && parseFloat(storedCurrentHP) === parseFloat(storedMaxHP)) {
                    localStorage.setItem("currentHP", (baseHP + totalHP).toString());
                }
            } catch (error) {
                console.error("Error fetching equipped items:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEquippedCards();
    }, [equippedItemIds, baseHP]);

    // Load persisted values from localStorage on initial mount
    useEffect(() => {
        const storedStrengthBonus = localStorage.getItem("itemStrengthBonus");
        const storedWillBonus = localStorage.getItem("itemWillBonus");
        const storedHPBonus = localStorage.getItem("itemHPBonus");
        
        if (storedStrengthBonus) {
            const parsedValue = parseFloat(storedStrengthBonus);
            if (!isNaN(parsedValue)) {
                setStrengthBonus(parsedValue);
                console.log("Loaded strength bonus from localStorage:", parsedValue);
            }
        }
        
        if (storedWillBonus) {
            const parsedValue = parseFloat(storedWillBonus);
            if (!isNaN(parsedValue)) {
                setWillBonus(parsedValue);
                console.log("Loaded will bonus from localStorage:", parsedValue);
            }
        }
        
        if (storedHPBonus) {
            const parsedValue = parseFloat(storedHPBonus);
            if (!isNaN(parsedValue)) {
                setHpBonus(parsedValue);
                console.log("Loaded HP bonus from localStorage:", parsedValue);
            }
        }
    }, []);

    return {
        strengthBonus,
        willBonus,
        hpBonus,
        totalStrength,
        totalWill,
        totalHP,
        maxHP,
        equippedCards,
        isLoading
    };
};

export default useItemStats;