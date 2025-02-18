import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/apiConfig';
import styles from '../styles/FieldCardsDisplay.module.css';
import EnemyCard from './EnemyCard';

interface ICard {
    cardId: number;
    name: string;
    description: string;
    imageId: number | null;
    title: string;
    type: string;
    enemyId: number | null;
    enemyName: string | null;
    imageName: string | null;
    diceRollResults: { [key: number]: string };
}
interface IEnemy{
    enemyId: number;
    name: string;
    description: string;
    strength: number;
    will: number;
    imageId: number | null;
    imageName: string | null;
}

interface FieldCardsDisplayProps {
    fieldId: number;
    onFight: (enemyStrength: number, enemyWill: number, statToUse?: "strength" | "will") => void;
}

const FieldCardsDisplay: React.FC<FieldCardsDisplayProps> = ({ fieldId, onFight }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enemy, setEnemy] = useState<IEnemy | null>(null);
    const [card, setCard] = useState<ICard | null>(null); // Use this!
    const [isFlipped, setIsFlipped] = useState(false); // For initial back display.
    const backImage: number | null = 16; // Default back image

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const allCardsResponse = await fetch(`${API_BASE_URL}/cards`);
                if (!allCardsResponse.ok) {
                    const errorText = await allCardsResponse.text();
                    console.warn(`Failed to fetch cards: ${allCardsResponse.status} - ${errorText}`);
                    setCard(null);
                    return;
                }

                const allCardsData = await allCardsResponse.json();
                const allCards = allCardsData.items || allCardsData;

                // Filter out enemy cards *before* picking a random ID.
                const nonEnemyCards = allCards.filter((card: ICard) => card.type !== "enemy");

                if (nonEnemyCards.length > 0) {
                    // Pick a random card ID from the *filtered* list.
                    const randomIndex = Math.floor(Math.random() * nonEnemyCards.length);
                    const randomCardId = nonEnemyCards[randomIndex].id;

                    // Fetch the *specific* card by its ID.
                    const cardResponse = await fetch(`${API_BASE_URL}/cards/${randomCardId}`);

                     if (!cardResponse.ok) {
                        const errorText = await cardResponse.text();
                        console.warn(`Failed to fetch card with ID ${randomCardId}: ${cardResponse.status} - ${errorText}`);
                        setCard(null);
                        return;
                    }
                     const cardData = await cardResponse.json();
                       const newCard: ICard = {
                                cardId: cardData.id,
                                name: cardData.title,
                                description: cardData.description,
                                imageId: cardData.imageId,
                                title: cardData.title,
                                type: cardData.type,
                                enemyId: cardData.enemyId,
                                enemyName: cardData.enemyName || null,
                                imageName: cardData.imageName || null,
                                diceRollResults: cardData.diceRollResults,
                            };
                            setCard(newCard);

                    // Fetch enemy data only if enemyId exists (shouldn't for non-enemy cards, but good to be safe)
                    if (newCard.enemyId) {
                       const enemyResponse = await fetch(`${API_BASE_URL}/enemies/${newCard.enemyId}`);
                        if (!enemyResponse.ok) {
                         const errorText = await enemyResponse.text();
                         console.warn(`Failed to fetch enemy: ${enemyResponse.status} - ${errorText}`);
                            setEnemy(null);
                            return;
                         }
                          const enemyData = await enemyResponse.json();
                           const newEnemy : IEnemy = {
                              enemyId: enemyData.id,
                              name: enemyData.name,
                              description: enemyData.description,
                              strength: enemyData.strength,
                              will: enemyData.will,
                              imageId: newCard.imageId, //This is right
                              imageName: newCard.imageName, //This is right
                          }
                         setEnemy(newEnemy);
                    } else {
                         setEnemy(null);
                    }

                } else {
                    // Handle the case where there are NO non-enemy cards.
                    console.warn("No non-enemy cards found.");
                    setCard(null);
                    setEnemy(null);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
                setCard(null);  // Set Card to null
                setEnemy(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [fieldId]);

    if (loading) {
        return <p>Loading card...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
     const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleDontFight = () => {
        console.log("Player chose not to fight.");
        setIsFlipped(false);
    };
    if (!card) {
        return <p>Error: No card available on this field!</p>;
    }

   return (
      <div className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`} onClick={() => handleFlip()}>
            {!isFlipped && (<div className={styles.cardBack}>
                {backImage && (
                    <img src={`${API_BASE_URL}/files/${backImage}`} alt="Card Back" className={styles.cardImage} />
                )}
                </div>)}

            {isFlipped && (
                <>
                   {enemy ? ( // Check for enemy existence
                        <EnemyCard
                            name={enemy.name}
                            description={enemy.description}
                            strength={enemy.strength}
                            will={enemy.will}
                            imageId={enemy.imageId} // Pass imageId
                            imageName={enemy.imageName || "default-card-image"}  // Pass imageName
                            onFight={onFight}
                            onDontFight={handleDontFight}
                        />
                    ) : (
                        <div className={styles.cardContainer}>
                            {card.imageId && ( //Check image.
                              <img
                                src={`${API_BASE_URL}/files/${card.imageId}`}
                                alt={card.name}
                                className={styles.cardImage}
                              />
                            )}
                            <h3 className={styles.cardName}>{card.name}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                        </div>
                    )}
                </>
            )}
        </div>
  );
};

export default FieldCardsDisplay;