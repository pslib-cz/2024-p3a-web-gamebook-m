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
    setShowDiceRollButton: (show: boolean) => void; // Přidána funkce pro nastavení viditelnosti tlačítka kostky
}

const ItemCard: React.FC<ItemCardProps> = ({ name, description, imageId, cardId, onEquip, bonusWile, bonusStrength, bonusHP, setShowDiceRollButton }) => {
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
        setShowDiceRollButton(true); // Zobrazit tlačítko po equipnutí
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