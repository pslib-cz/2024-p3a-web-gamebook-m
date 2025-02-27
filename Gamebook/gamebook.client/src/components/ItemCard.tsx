// ItemCard.tsx
import React from 'react';
import styles from "../styles/ItemCard.module.css";

interface ItemCardProps {
    name: string;
    description: string;
    imageId: number | null;
    cardId: number;
    onEquip: (card: any) => void;
    bonusWile: number;
    bonusStrength: number;
    bonusHP: number;
    // Removed setShowDiceRollButton from here. ItemCard should not directly manipulate RoomNavigate's state
    // Instead, the ItemCard should call onEquip which should call the logic in RoomNavigate
}

const ItemCard: React.FC<ItemCardProps> = ({ name, description, imageId, cardId, onEquip, bonusWile, bonusStrength, bonusHP }) => {
    const handleEquip = () => {
        const card = {
            id: cardId,
            name: name,
            description: description,
            bonusWile: bonusWile,
            bonusStrength: bonusStrength,
            bonusHP: bonusHP,
            imageId: imageId
        };
        onEquip(card);
        //setShowDiceRollButton(true); // Remove this line
    };

    return (
        <div className={styles.itemCard}>
            <h3>{name}</h3>
            <p>{description}</p>
            {imageId && <img src={`/api/files/${imageId}`} alt={name} />}
            <button onClick={handleEquip}>Equip</button>
        </div>
    );
};

export default ItemCard;