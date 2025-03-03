import React from 'react';
import styles from '../styles/Inventory.module.css';
import { API_BASE_URL } from '../api/apiConfig';

interface InventoryProps {
    inventory: number[];
    onRemoveItem: (itemId: number) => void;
    equippedItemId: number | null;
    onEquipItem: (card: Card) => void;
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
    imageName: string | null;
    enemyId: number | null;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onRemoveItem, equippedItemId, onEquipItem }) => {
    return (
        <div className={styles.inventoryContainer}>
            <h3>Inventory</h3>
            <ul className={styles.inventoryList}>
                {inventory.map((itemId) => (
                    <InventoryItem key={itemId} itemId={itemId} onRemoveItem={onRemoveItem} equippedItemId={equippedItemId} onEquipItem={onEquipItem} />
                ))}
            </ul>
        </div>
    );
};

interface InventoryItemProps {
    itemId: number;
    onRemoveItem: (itemId: number) => void;
    equippedItemId: number | null;
    onEquipItem: (card: Card) => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ itemId, onRemoveItem, equippedItemId, onEquipItem }) => {
    const [card, setCard] = React.useState<Card | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchCard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/cards/${itemId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch card with ID ${itemId}: ${response.status}`);
                }
                const cardData = await response.json();
                setCard(cardData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [itemId]);

    if (loading) {
        return <li>Loading item...</li>;
    }

    if (error) {
        return <li>Error: {error}</li>;
    }

    if (!card) {
        return <li>Card not found</li>;
    }

    const handleEquip = () => {
        onEquipItem(card);
    };

    return (
        <li className={styles.inventoryItem}>
            {card.imageId && (
                <img
                    src={`${API_BASE_URL}/files/${card.imageId}`}
                    alt={card.title}
                    className={styles.inventoryItemImage}
                />
            )}
            <div className={styles.inventoryItemDetails}>
                <span className={styles.inventoryItemName}>{card.title}</span>
            </div>
        </li>
    );
};

export default Inventory;