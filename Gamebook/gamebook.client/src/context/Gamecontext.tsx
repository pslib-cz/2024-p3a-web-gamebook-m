import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Centralized Card interface (move this to a shared types file later if reusable)
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

interface Character {
    id: number;
    name: string;
    maxHP: number;
    imageId: number | null;
    pointsOfDestiny: number;
    strength: number;
    will: number;
}

interface GameContextType {
    character: Character | null;
    fetchCharacter: (id: number) => Promise<void>;
    hp: number;
    setHp: React.Dispatch<React.SetStateAction<number>>;
    strength: number;
    will: number;
    inventory: number[];
    addItemToInventory: (itemId: number) => void;
    removeItemFromInventory: (itemId: number) => void;
    equippedItemIds: number[];
    equipItem: (itemId: number) => void;
    unequipItem: (itemId: number) => void;
    isMoved: boolean;
    setIsMoved: React.Dispatch<React.SetStateAction<boolean>>;
    getCard: (cardId: number) => Promise<Card | null>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameContextProviderProps {
    children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
    const [character, setCharacter] = useState<Character | null>(null);
    const [hp, setHp] = useState<number>(10);
    const [inventory, setInventory] = useState<number[]>([]);
    const [equippedItemIds, setEquippedItemIds] = useState<number[]>([]);
    const [isMoved, setIsMoved] = useState<boolean>(false);
    const [cards, setCards] = useState<{ [key: number]: Card }>({});

    // Fetch a card and cache it
    const getCard = async (cardId: number): Promise<Card | null> => {
        if (cards[cardId]) return cards[cardId];
        try {
            const response = await fetch(`api/cards/${cardId}`);
            if (!response.ok) {
                console.error(`Failed to fetch card ${cardId}: ${response.status}`);
                return null;
            }
            const data = await response.json() as Card;
            setCards(prev => ({ ...prev, [cardId]: data }));
            return data;
        } catch (error) {
            console.error(`Error fetching card ${cardId}:`, error);
            return null;
        }
    };

    // Fetch cards for equipped items on mount or when equippedItemIds changes
    useEffect(() => {
        const fetchEquippedCards = async () => {
            const missingCardIds = equippedItemIds.filter(id => !cards[id]);
            if (missingCardIds.length > 0) {
                const fetchedCards = await Promise.all(
                    missingCardIds.map(id => getCard(id))
                );
                setCards(prev => ({
                    ...prev,
                    ...Object.fromEntries(
                        fetchedCards
                            .filter((card): card is Card => card !== null)
                            .map(card => [card.id, card])
                    ),
                }));
            }
        };
        fetchEquippedCards();
    }, [equippedItemIds]);

    // Calculate stats with bonuses from equipped items
    const strength = character
        ? character.strength + equippedItemIds.reduce((acc, id) => {
              const card = cards[id];
              return card ? acc + (card.bonusStrength || 0) : acc;
          }, 0)
        : 0;

    const will = character
        ? character.will + equippedItemIds.reduce((acc, id) => {
              const card = cards[id];
              return card ? acc + (card.bonusWile || 0) : acc;
          }, 0)
        : 0;

    // Fetch character
    const fetchCharacter = async (id: number) => {
        try {
            const response = await fetch(`api/characters/${id}`);
            if (!response.ok) throw new Error('Failed to fetch character');
            const data = await response.json() as Character;
            setCharacter(data);
            setHp(data.maxHP);
            localStorage.setItem('selectedCharacter', JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching character:', error);
        }
    };

    // Inventory management
    const addItemToInventory = (itemId: number) => {
        if (inventory.length >= 8) {
            console.warn("Inventory is full (max 8 items)");
            return false;
        }
        if (!inventory.includes(itemId)) {
            console.log(`Adding item ${itemId} to inventory`);
            setInventory(prev => {
                const newInventory = [...prev, itemId];
                localStorage.setItem('playerInventory', JSON.stringify(newInventory));
                return newInventory;
            });
            return true;
        }
        return true; // Item already in inventory
    };

    const removeItemFromInventory = (itemId: number) => {
        console.log(`Removing item ${itemId} from inventory`);
        
        // First, unequip the item if it's equipped
        if (equippedItemIds.includes(itemId)) {
            unequipItem(itemId);
        }
        
        setInventory(prev => {
            const newInventory = prev.filter(id => id !== itemId);
            localStorage.setItem('playerInventory', JSON.stringify(newInventory));
            return newInventory;
        });
    };

    // Equipment management with 8-item limit and auto-adding to inventory
    const equipItem = (itemId: number) => {
        console.log(`Attempting to equip item ${itemId}`);
        
        // Check if we can add more equipped items
        if (equippedItemIds.length >= 8) {
            console.warn("Cannot equip more than 8 items");
            return;
        }
        
        // If item is already equipped, do nothing
        if (equippedItemIds.includes(itemId)) {
            console.log(`Item ${itemId} is already equipped`);
            return;
        }

        // Check if item is in inventory, add it if not
        if (!inventory.includes(itemId)) {
            console.log(`Item ${itemId} not in inventory, adding it first`);
            const added = addItemToInventory(itemId);
            if (!added) {
                console.warn("Could not add item to inventory - it might be full");
                return;
            }
        }
        
        // Now equip the item
        setEquippedItemIds(prev => {
            const newEquipped = [...prev, itemId];
            localStorage.setItem('equippedItemIds', JSON.stringify(newEquipped));
            console.log(`Item ${itemId} equipped successfully. Total equipped: ${newEquipped.length}`);
            return newEquipped;
        });
    };

    const unequipItem = (itemId: number) => {
        console.log(`Unequipping item ${itemId}`);
        setEquippedItemIds(prev => {
            const newEquipped = prev.filter(id => id !== itemId);
            localStorage.setItem('equippedItemIds', JSON.stringify(newEquipped));
            return newEquipped;
        });
    };

    // Sync with localStorage on mount
    useEffect(() => {
        const storedCharacter = localStorage.getItem('selectedCharacter');
        if (storedCharacter) {
            try {
                const parsedCharacter = JSON.parse(storedCharacter);
                if (parsedCharacter.id) fetchCharacter(parsedCharacter.id);
            } catch (error) {
                console.error('Error parsing character:', error);
            }
        }

        const storedInventory = localStorage.getItem('playerInventory');
        if (storedInventory) {
            try {
                const parsedInventory = JSON.parse(storedInventory);
                if (Array.isArray(parsedInventory)) {
                    // Filter out null or undefined values
                    const validInventory = parsedInventory.filter(id => id !== null && id !== undefined);
                    setInventory(validInventory);
                }
            } catch (error) {
                console.error('Error parsing inventory:', error);
            }
        }

        const storedEquipped = localStorage.getItem('equippedItemIds');
        if (storedEquipped) {
            try {
                const parsedEquipped = JSON.parse(storedEquipped);
                if (Array.isArray(parsedEquipped)) {
                    // Filter out null or undefined values
                    const validEquipped = parsedEquipped.filter(id => id !== null && id !== undefined);
                    setEquippedItemIds(validEquipped);
                }
            } catch (error) {
                console.error('Error parsing equipped items:', error);
            }
        }
    }, []);

    const value: GameContextType = {
        character,
        fetchCharacter,
        hp,
        setHp,
        strength,
        will,
        inventory,
        addItemToInventory,
        removeItemFromInventory,
        equippedItemIds,
        equipItem,
        unequipItem,
        isMoved,
        setIsMoved,
        getCard,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGameContext must be used within a GameContextProvider');
    return context;
};