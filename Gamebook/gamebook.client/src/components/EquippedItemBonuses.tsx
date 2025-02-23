import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/apiConfig";

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
}

interface EquippedItemBonusesProps {
    equippedItemId: number | null;
    selectedCharacter: Character | null;
}

const EquippedItemBonuses: React.FC<EquippedItemBonusesProps> = ({ equippedItemId, selectedCharacter }) => {
    const [equippedItem, setEquippedItem] = useState<Card | null>(null);

    useEffect(() => {
        const fetchEquippedItem = async () => {
            if (!equippedItemId) {
                setEquippedItem(null);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/cards/${equippedItemId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch card detail: ${response.status}`);
                }
                const data = await response.json();
                setEquippedItem(data as Card);
            } catch (error) {
                console.error("Error fetching equipped item:", error);
                setEquippedItem(null);
            }
        };

        fetchEquippedItem();
    }, [equippedItemId, API_BASE_URL]);

    useEffect(() => {
        if (!equippedItem || !selectedCharacter) return;

        // 1. Get current stats from localStorage
        const currentStrength = parseInt(localStorage.getItem("strength") || selectedCharacter.strength.toString(), 10);
        const currentWill = parseInt(localStorage.getItem("will") || selectedCharacter.will.toString(), 10);
        const currentHP = parseInt(localStorage.getItem("hp") || selectedCharacter.maxHP.toString(), 10);

        // 2. Calculate updated stats
        const bonusStrength = equippedItem.bonusStrength || 0;
        const bonusWile = equippedItem.bonusWile || 0;
        const bonusHP = equippedItem.bonusHP || 0;

        const updatedStrength = currentStrength + bonusStrength;
        const updatedWill = currentWill + bonusWile;
        const updatedHP = currentHP + bonusHP;

        // 3. Save updated stats to localStorage
        localStorage.setItem("strength", updatedStrength.toString());
        localStorage.setItem("will", updatedWill.toString());
        localStorage.setItem("hp", updatedHP.toString());

        console.log("Stats updated with equipped item bonuses:", {
            strength: updatedStrength,
            will: updatedWill,
            hp: updatedHP,
        });

    }, [equippedItem, selectedCharacter]);

    return null; // This component doesn't render anything.  It just updates stats.
};

export default EquippedItemBonuses;