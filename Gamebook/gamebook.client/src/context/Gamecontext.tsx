// src/context/GameContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../api/apiConfig';

// Define types for our context
interface Character {
    id: number;
    name: string;
    maxHP: number;
    imageId: number | null;
    pointsOfDestiny: number;
    strength: number;
    will: number;
    // Add other character properties as needed
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

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameContextProviderProps {
    children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
    const [character, setCharacter] = useState<Character | null>(null);
    const [hp, setHp] = useState<number>(10); // Default HP value
    const [inventory, setInventory] = useState<number[]>([]);
    const [equippedItemIds, setEquippedItemIds] = useState<number[]>([]);
    const [isMoved, setIsMoved] = useState<boolean>(false);
    const [cards, setCards] = useState<{[key: number]: Card}>({});

    // Function to fetch a card by ID
    const getCard = async (cardId: number) => {
        if (cards[cardId]) {
            return cards[cardId]; // Return from cache if available
        }
        try {
            const response = await fetch(`${API_BASE_URL}/cards/${cardId}`);
            if (!response.ok) {
                console.error(`Failed to fetch card with ID ${cardId}: ${response.status}`);
                return null;
            }
            const data = await response.json() as Card;
            setCards(prevCards => ({ ...prevCards, [cardId]: data })); // Cache the fetched card
            return data;
        } catch (error) {
            console.error(`Error fetching card with ID ${cardId}:`, error);
            return null;
        }
    };

    // Derived values
    const strength = character
        ? character.strength + equippedItemIds.reduce((acc, itemId) => {
            const card = cards[itemId];
            return card ? acc + (card.bonusStrength || 0) : acc;
        }, 0)
        : 0;

    const will = character
        ? character.will + equippedItemIds.reduce((acc, itemId) => {
            const card = cards[itemId];
            return card ? acc + (card.bonusWile || 0) : acc;
        }, 0)
        : 0;

    // Fetch character data from API
    const fetchCharacter = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/characters/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch character');
            }
            const data = await response.json();
            setCharacter(data);
            setHp(data.maxHP); // Initialize HP to maxHP
        } catch (error) {
            console.error('Error fetching character:', error);
        }
    };

    // Handle inventory management
    const addItemToInventory = (itemId: number) => {
        if (!inventory.includes(itemId)) {
            setInventory(prev => [...prev, itemId]);
        }
    };

    const removeItemFromInventory = (itemId: number) => {
        setInventory(prev => prev.filter(id => id !== itemId));
        setEquippedItemIds(prev => prev.filter(id => id !== itemId)); // Also unequip the item if removed from inventory
    };

    // Handle equipment
    const equipItem = (itemId: number) => {
        if (inventory.includes(itemId)) {
            setEquippedItemIds(prev => {
                if (prev.includes(itemId)) {
                    return prev; // Already equipped
                }
                return [...prev, itemId]; // Equip
            });
        }
    };

    const unequipItem = (itemId: number) => {
        setEquippedItemIds(prev => prev.filter(id => id !== itemId));
    };

    // Initialize from localStorage if available
    useEffect(() => {
        const storedCharacter = localStorage.getItem('selectedCharacter');
        if (storedCharacter) {
            try {
                const parsedCharacter = JSON.parse(storedCharacter);
                if (parsedCharacter.id) {
                    fetchCharacter(parsedCharacter.id);
                }
            } catch (error) {
                console.error('Error parsing character from localStorage:', error);
            }
        }
    }, []);

    // Provide context value
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
        getCard
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameContextProvider');
    }
    return context;
};