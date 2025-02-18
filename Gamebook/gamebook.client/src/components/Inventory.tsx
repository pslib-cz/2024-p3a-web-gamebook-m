// src/components/Inventory/InventoryDisplay.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/apiConfig';
import styles from '../styles/Inventory.module.css';

interface IInventory {
  id: number;
  cardIds: number[];
}

interface ICard {
  cardId: number;
  name: string;
  description: string;
  imageId: number | null;
  title: string;
  type: string;
  enemyId: number | null;
  enemyName: string;
  imageName: string;
  diceRollResults:  { [key: number]: string };
}

interface InventoryDisplayProps {
  inventoryId: number;
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ inventoryId }) => {
  const [inventory, setInventory] = useState<IInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<ICard[]>([]);
  const MAX_CARDS = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const inventoryResponse = await fetch(`${API_BASE_URL}/inventories/${inventoryId}`);

        if (!inventoryResponse.ok) {
          const errorText = await inventoryResponse.text();
          console.warn(`Failed to fetch inventory: ${inventoryResponse.status} ${inventoryResponse.statusText} ${errorText}`);
          setInventory(null);
          setCards([]);
          return;
        }

        const inventoryData: IInventory = await inventoryResponse.json();
        setInventory(inventoryData);

        if (inventoryData.cardIds.length > 0) {
          const cardDetailsPromises = inventoryData.cardIds.map(async (cardId) => {
            const cardResponse = await fetch(`${API_BASE_URL}/cards/${cardId}`);
            if (!cardResponse.ok) {
              const errorText = await cardResponse.text();
              console.warn(`Failed to fetch card ${cardId}: ${cardResponse.status} ${cardResponse.statusText} ${errorText}`);
              return null;
            }
            return await cardResponse.json() as ICard;
          });

          const cardDetails = (await Promise.all(cardDetailsPromises)).filter((card): card is ICard => card !== null);
          setCards(cardDetails);
        } else {
          setCards([]);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Failed to load data");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [inventoryId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const displayedCards: (ICard | null)[] = [...cards];
  while (displayedCards.length < MAX_CARDS) {
    displayedCards.push(null);
  }

  return (
    <div className={styles.inventoryContainer}>
      <h2 className={styles.inventoryTitle}>
        Inventory {inventory ? `(ID: ${inventory.id})` : "(Not Loaded)"}
      </h2>
      <ul className={styles.cardList}>
        {displayedCards.map((card, index) => (
          <li key={index} className={styles.cardItem}>
            {card ? (
              <>
                <strong className={styles.cardName}>{card.name}</strong>:{" "}
                {card.description}
              </>
            ) : (
              <span className={styles.emptySlot}>Empty Slot</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryDisplay;