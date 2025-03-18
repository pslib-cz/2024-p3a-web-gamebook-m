import React, { useState, useEffect } from 'react';
import styles from '../styles/FieldCardsDisplay.module.css';
import EnemyCard from './EnemyCard';
import ItemCard from './ItemCard';

interface Card {
    id: number;
    cardId?: number;
    title: string;
    type: "Enemy" | "item" | "Boss";
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
    isBoss: boolean;
}

interface IEnemy {
    enemyId: number;
    name: string;
    description: string;
    strength: number;
    will: number;
    imageId: number | null;
    imageName: string | null;
    isBoss?: boolean;
}

interface FieldCardsDisplayProps {
    fieldId: number;
    onFight: (enemyStrength: number, enemyWill: number, statToUse?: "strength" | "will" | "boss", specialAbility?: string) => void;
    onDontFightBoss: () => void; // Added prop for handling boss retreat
    onEquipItem: (card: Card) => void;
    setShowBossChoice: (show: boolean) => void; // Prop for showing boss choice dialog
    hasWonFight?: boolean; // Prop to track if fight was won
}

const FieldCardsDisplay: React.FC<FieldCardsDisplayProps> = ({ 
    fieldId, 
    onFight, 
    onDontFightBoss,
    onEquipItem, 
    setShowBossChoice,
    hasWonFight = false 
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enemy, setEnemy] = useState<IEnemy | null>(null);
    const [card, setCard] = useState<Card | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const backImage: number | null = 98;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log("FieldCardsDisplay: Loading data for field ID:", fieldId);
                const allCardsResponse = await fetch(`/api/cards`);
                if (!allCardsResponse.ok) {
                    const errorText = await allCardsResponse.text();
                    console.warn(`Failed to fetch cards: ${allCardsResponse.status} - ${errorText}`);
                    setCard(null);
                    return;
                }

                const allCardsData = await allCardsResponse.json();
                const allCards = allCardsData.items || allCardsData;

                console.log("FieldCardsDisplay: All Cards loaded:", allCards.length);

                const availableCards = [...allCards];

                if (availableCards.length > 0) {
                    const selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)];
                    console.log("FieldCardsDisplay: Selected Card:", selectedCard.id, selectedCard.title, "Type:", selectedCard.type);

                    const cardResponse = await fetch(`/api/cards/${selectedCard.id}`);
                    if (!cardResponse.ok) {
                        const errorText = await cardResponse.text();
                        console.warn(`Failed to fetch card with ID ${selectedCard.id}: ${cardResponse.status} - ${errorText}`);
                        setCard(null);
                        return;
                    }
                    const cardData = await cardResponse.json();
                    const newCard: Card = {
                        id: cardData.id,
                        cardId: cardData.cardId,
                        title: cardData.title,
                        description: cardData.description,
                        imageId: cardData.imageId,
                        type: cardData.type,
                        enemyId: cardData.enemyId,
                        imageName: cardData.imageName || null,
                        diceRollResults: cardData.diceRollResults,
                        bonusWile: cardData.bonusWile || null,
                        bonusStrength: cardData.bonusStrength || null,
                        bonusHP: cardData.bonusHP || null,
                        specialAbilities: cardData.specialAbilities || null,
                        classOnly: cardData.classOnly || null,
                        isBoss: cardData.isBoss || cardData.type === "Boss" || false,
                    };
                    setCard(newCard);
                    console.log("FieldCardsDisplay: Processed card data:", newCard.type, newCard.title, "Is Boss:", newCard.isBoss);

                    if (newCard.type === "Enemy" && newCard.enemyId) {
                        console.log("FieldCardsDisplay: Loading enemy data for enemyId:", newCard.enemyId);
                        const enemyResponse = await fetch(`/api/enemies/${newCard.enemyId}`);
                        if (!enemyResponse.ok) {
                            const errorText = await enemyResponse.text();
                            console.warn(`Failed to fetch enemy: ${enemyResponse.status} - ${errorText}`);
                            setEnemy(null);
                            return;
                        }
                        const enemyData = await enemyResponse.json();
                        const newEnemy: IEnemy = {
                            enemyId: enemyData.id,
                            name: enemyData.name,
                            description: enemyData.description,
                            strength: enemyData.strength,
                            will: enemyData.will,
                            imageId: newCard.imageId,
                            imageName: newCard.imageName,
                            // @ts-ignore
                            isBoss: newCard.isBoss || newCard.type === "Boss",
                        };
                        setEnemy(newEnemy);
                        console.log("FieldCardsDisplay: Enemy loaded:", newEnemy.name, "Is Boss:", newEnemy.isBoss);
                    } else {
                        setEnemy(null);
                    }
                } else {
                    console.warn("No cards found.");
                    setCard(null);
                    setEnemy(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
                console.error("FieldCardsDisplay: Error loading card data:", err);
                setCard(null);
                setEnemy(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [fieldId]);

    const handleFlip = () => {
        console.log("FieldCardsDisplay: handleFlip called for card type:", card?.type);
        setIsFlipped(true);
        
        if (card?.type === "Boss" || card?.isBoss) {
            console.log("FieldCardsDisplay: Boss card detected - showing boss choice dialog");
            setShowBossChoice(true);
        }
    };

    const handleEquip = () => {
        if (card) {
            console.log("FieldCardsDisplay: Equipping card:", card.title);
            onEquipItem(card);
        }
    };

    const handleFightBoss = () => {
        console.log("FieldCardsDisplay: handleFightBoss called");
        
        const baseStrength = card?.bonusStrength || 10;
        const baseWill = card?.bonusWile || 10;
        
        const bossStrength = Math.max(10, baseStrength);
        const bossWill = Math.max(10, baseWill);
        
        console.log(`FieldCardsDisplay: Final boss stats: strength=${bossStrength}, will=${bossWill}`);
        
        if (card) {
            card.isBoss = true;
            console.log("FieldCardsDisplay: Marked card explicitly as boss:", card.isBoss);
        }
        
        onFight(bossStrength, bossWill, "boss");
    };

    const handleDontFightBoss = () => {
        console.log("FieldCardsDisplay: Don't fight boss button clicked");
        setIsFlipped(false);
        
        // Call the parent function to handle navigation to next field
        onDontFightBoss();
    };

    if (loading) {
        return <p>Loading card...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!card) {
        return <p>Error: No card available on this field!</p>;
    }

    return (
        <div className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`} onClick={handleFlip}>
            {!isFlipped && (
                <div className={styles.cardBack}>
                    {backImage && (
                        <img src={`/api/files/${backImage}`} alt="Card Back" className={styles.cardImage} />
                    )}
                </div>
            )}

            {isFlipped && (
                <>
                    {card.type === "Enemy" && enemy ? (
                        <EnemyCard
                            name={enemy.name}
                            description={enemy.description}
                            strength={enemy.strength}
                            will={enemy.will}
                            imageId={enemy.imageId}
                            imageName={enemy.imageName || "default-card-image"}
                            onFight={(enemyStrength, enemyWill, attackType) => {
                                if (enemy.isBoss) {
                                    console.log("FieldCardsDisplay: Boss enemy detected, using boss attack type");
                                    onFight(enemyStrength, enemyWill, "boss");
                                } else {
                                    onFight(enemyStrength, enemyWill, attackType);
                                }
                            }}
                            onDontFight={() => { setIsFlipped(false); }}
                            cardId={card.id}
                            // @ts-ignore
                            onEquip={onEquipItem}
                            isBoss={enemy.isBoss}
                            hasWonFight={hasWonFight}
                        />
                    ) : card.type === "item" ? (
                        <ItemCard
                            name={card.title}
                            description={card.description}
                            imageId={card.imageId}
                            cardId={card.id}
                            // @ts-ignore
                            onEquip={onEquipItem}
                            bonusWile={card.bonusWile}
                            bonusStrength={card.bonusStrength}
                            bonusHP={card.bonusHP}
                        />
                    ) : card.type === "Boss" || card.isBoss ? (
                        <div className={`${styles.cardContainer} ${styles.bossCard}`}>
                            <div className={styles.cardInner}>
                                <div className={styles.fightMode}>
                                    {card.imageId && (
                                        <img 
                                            src={`/api/files/${card.imageId}`} 
                                            alt={card.title} 
                                            className={styles.cardImage} 
                                        />
                                    )}
                                    <h3>{card.title} <span className={styles.bossLabel}>BOSS</span></h3>
                                    <p>{card.description}</p>
                                    
                                    {!hasWonFight && (
                                        <div className={styles.fightButtons}>
                                            <button
                                                className={`${styles.hitButton} ${styles.bossHitButton}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("FieldCardsDisplay: BOSS FIGHT button clicked");
                                                    handleFightBoss();
                                                }}
                                            >
                                                Fight Boss
                                            </button>
                                            <button
                                                className={styles.hitButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDontFightBoss();
                                                }}
                                            >
                                                Retreat
                                            </button>
                                        </div>
                                    )}
                                    
                                    {hasWonFight && (
                                        <p className={styles.victoryMessage}>
                                            You defeated the BOSS!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.cardContainer}>
                            {card.imageId && (
                                <img
                                    src={`/api/files/${card.imageId}`}
                                    alt={card.title}
                                    className={styles.cardImage}
                                />
                            )}
                            <h3 className={styles.cardName}>{card.title}</h3>
                            <p className={styles.cardDescription}>{card.description}</p>
                            <button className={styles.equipButton} onClick={handleEquip}>Equip</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FieldCardsDisplay;