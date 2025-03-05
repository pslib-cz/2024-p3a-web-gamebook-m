import React, { useState, useEffect } from 'react';
import styles from '../styles/Inventory.module.css';
import { API_BASE_URL } from '../api/apiConfig';

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
    imageName: string | null;
    enemyId: number | null;
}

interface InventoryProps {
    inventory: number[];
    onRemoveItem: (itemId: number) => void;
    equippedItemIds: number[];
    onEquipItem: (card: Card) => void;
    onUnequipItem: (itemId: number) => void;
    maxCapacity?: number;
}

const Inventory: React.FC<InventoryProps> = ({
    inventory,
    onRemoveItem,
    equippedItemIds = [],
    onEquipItem,
    onUnequipItem,
    maxCapacity = 8
}) => {
    const [totalBonuses, setTotalBonuses] = useState({
        strength: 0,
        will: 0,
        hp: 0
    });
    
    const [equippedCards, setEquippedCards] = useState<Card[]>([]);

    // Fetch all equipped cards and calculate total bonuses
    useEffect(() => {
        const fetchEquippedCards = async () => {
            const cards: Card[] = [];
            let totalStrength = 0;
            let totalWill = 0;
            let totalHP = 0;

            for (const itemId of equippedItemIds) {
                try {
                    const response = await fetch(`${API_BASE_URL}/cards/${itemId}`);
                    if (response.ok) {
                        const card = await response.json();
                        cards.push(card);
                        
                        // Add up bonuses
                        totalStrength += card.bonusStrength || 0;
                        totalWill += card.bonusWile || 0;
                        totalHP += card.bonusHP || 0;
                    }
                } catch (error) {
                    console.error(`Error fetching card ${itemId}:`, error);
                }
            }
            
            setEquippedCards(cards);
            setTotalBonuses({
                strength: totalStrength,
                will: totalWill,
                hp: totalHP
            });
        };

        fetchEquippedCards();
    }, [equippedItemIds]);

    return (
        <div className={styles.inventory}>
            <h2>Inventory ({inventory.length}/{maxCapacity})</h2>
            
            {equippedItemIds.length > 0 && (
                <div className={styles.equippedItemsInfo}>
                    <p>Equipped Items ({equippedItemIds.length}/{maxCapacity}):</p>
                    <div className={styles.itemBadges}>
                        {equippedCards.map(card => (
                            <div key={card.id} className={styles.itemBadge}>
                                {card.title || card.name}
                                <div className={styles.itemBonuses}>
                                    {card.bonusStrength > 0 && <span>+{card.bonusStrength} STR</span>}
                                    {card.bonusWile > 0 && <span>+{card.bonusWile} WILL</span>}
                                    {card.bonusHP > 0 && <span>+{card.bonusHP} HP</span>}
                                </div>
                                <button 
                                    onClick={() => onUnequipItem(card.id)}
                                    className={styles.unequipButton}
                                >
                                    Unequip
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.totalBonuses}>
                        <p>Total Bonuses:</p>
                        <ul>
                            {totalBonuses.strength > 0 && <li>+{totalBonuses.strength.toFixed(2)} Strength</li>}
                            {totalBonuses.will > 0 && <li>+{totalBonuses.will.toFixed(2)} Will</li>}
                            {totalBonuses.hp > 0 && <li>+{totalBonuses.hp.toFixed(2)} HP</li>}
                        </ul>
                    </div>
                </div>
            )}
            
            <ul className={styles.itemList}>
                {inventory.length === 0 ? (
                    <li className={styles.emptyInventory}>Your inventory is empty</li>
                ) : (
                    inventory.map(itemId => (
                        <InventoryItem 
                            key={itemId} 
                            itemId={itemId} 
                            onRemoveItem={onRemoveItem} 
                            isEquipped={equippedItemIds.includes(itemId)} 
                            onEquipItem={onEquipItem}
                            onUnequipItem={onUnequipItem}
                            canEquip={equippedItemIds.length < maxCapacity}
                        />
                    ))
                )}
            </ul>
        </div>
    );
};

interface InventoryItemProps {
    itemId: number;
    onRemoveItem: (itemId: number) => void;
    isEquipped: boolean;
    onEquipItem: (card: Card) => void;
    onUnequipItem: (itemId: number) => void;
    canEquip: boolean;
}

const InventoryItem: React.FC<InventoryItemProps> = ({
    itemId,
    onRemoveItem,
    isEquipped,
    onEquipItem,
    onUnequipItem,
    canEquip
}) => {
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/cards/${itemId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch card with ID ${itemId}`);
                }
                const cardData = await response.json();
                setCard(cardData);
            } catch (error) {
                console.error("Error fetching card:", error);
                setError(error instanceof Error ? error.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [itemId]);

    if (loading) {
        return <li className={styles.item}>Loading item...</li>;
    }

    if (error || !card) {
        return <li className={styles.item}>Error loading item</li>;
    }

    const handleEquipToggle = () => {
        if (isEquipped) {
            onUnequipItem(itemId);
        } else if (canEquip) {
            onEquipItem(card);
        }
    };

    return (
        <li className={`${styles.item} ${isEquipped ? styles.equipped : ''}`}>
            <div className={styles.itemDetails}>
                <h3>{card.title || card.name}</h3>
                <p>{card.description}</p>
                
                {card.bonusStrength > 0 && <p>+{card.bonusStrength.toFixed(2)} Strength</p>}
                {card.bonusWile > 0 && <p>+{card.bonusWile.toFixed(2)} Will</p>}
                {card.bonusHP > 0 && <p>+{card.bonusHP.toFixed(2)} HP</p>}
                
                {isEquipped && <span className={styles.equippedLabel}>Equipped</span>}
            </div>
            
            {card.imageId && (
                <img 
                    src={`${API_BASE_URL}/files/${card.imageId}`} 
                    alt={card.title || card.name || "Item"} 
                    className={styles.itemImage}
                />
            )}
            
            <div className={styles.itemActions}>
                <button 
                    onClick={handleEquipToggle}
                    disabled={!isEquipped && !canEquip}
                >
                    {isEquipped ? 'Unequip' : 'Equip'}
                </button>
                <button onClick={() => onRemoveItem(itemId)}>Drop</button>
            </div>
        </li>
    );
};

export default Inventory;