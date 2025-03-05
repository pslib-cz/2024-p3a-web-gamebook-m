import React from 'react';
import styles from "../styles/ItemCard.module.css";
import { API_BASE_URL } from '../api/apiConfig';

interface ItemCardProps {
    name: string;
    description: string;
    imageId: number | null;
    cardId: number;
    onEquip: (card: { id: number; name: string; description: string; bonusWile: number; bonusStrength: number; bonusHP: number; imageId: number | null }) => void;
    bonusWile: number | null;
    bonusStrength: number | null;
    bonusHP: number | null;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
    name, 
    description, 
    imageId, 
    cardId, 
    onEquip, 
    bonusWile, 
    bonusStrength, 
    bonusHP 
}) => {
    const handleEquip = () => {
        console.log(`ItemCard: Attempting to equip item ${cardId} (${name})`);
        const card = {
            id: cardId,
            name: name,
            description: description,
            bonusWile: bonusWile || 0,
            bonusStrength: bonusStrength || 0,
            bonusHP: bonusHP || 0,
            imageId: imageId
        };
        
        // Pass the complete card object to the onEquip handler
        onEquip(card);
    };

    return (
        <div className={styles.itemCard}>
            <h3>{name}</h3>
            <p>{description}</p>
            
            {bonusStrength && bonusStrength > 0 && (
                <p className={styles.itemBonus}>+{bonusStrength.toFixed(1)} Strength</p>
            )}
            
            {bonusWile && bonusWile > 0 && (
                <p className={styles.itemBonus}>+{bonusWile.toFixed(1)} Will</p>
            )}
            
            {bonusHP && bonusHP > 0 && (
                <p className={styles.itemBonus}>+{bonusHP.toFixed(1)} HP</p>
            )}
            
            {imageId && (
                <img 
                    src={`${API_BASE_URL}/files/${imageId}`} 
                    alt={name} 
                    className={styles.itemImage}
                />
            )}
            
            <button 
                onClick={handleEquip}
                className={styles.equipButton}
            >
                Equip
            </button>
        </div>
    );
};

export default ItemCard;