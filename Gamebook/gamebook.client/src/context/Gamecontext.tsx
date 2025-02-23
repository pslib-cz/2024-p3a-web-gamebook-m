// src/context/GameContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface GameContextType {
    playerLives: number;
    setPlayerLives: (lives: number) => void;
    playerPointsOfDestiny: number;
    setPlayerPointsOfDestiny: (points: number) => void;
    strength: number;
    setStrength: (strength: number) => void;
    will: number;
    setWill: (will: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [playerLives, setPlayerLives] = useState(3);
    const [playerPointsOfDestiny, setPlayerPointsOfDestiny] = useState(2);
    const [strength, setStrength] = useState(5);
    const [will, setWill] = useState(3);

    const value: GameContextType = {
        playerLives,
        setPlayerLives,
        playerPointsOfDestiny,
        setPlayerPointsOfDestiny,
        strength,
        setStrength,
        will,
        setWill,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext musí být použit uvnitř GameContextProvider");
    }
    return context;
};