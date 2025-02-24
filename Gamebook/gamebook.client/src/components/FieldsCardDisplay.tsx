import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/apiConfig';
import styles from '../styles/FieldCardsDisplay.module.css';
import EnemyCard from './EnemyCard';
import ItemCard from './ItemCard';
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
}

interface FieldCardsDisplayProps {
    fieldId: number;
    onFight: (enemyStrength: number, enemyWill: number, statToUse?: "strength" | "will") => void;
    onEquipItem: (card: Card) => void;
}

const FieldCardsDisplay: React.FC<FieldCardsDisplayProps> = ({ fieldId, onFight, onEquipItem }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enemy, setEnemy] = useState<IEnemy | null>(null);
    const [card, setCard] = useState<Card | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showBossChoice, setShowBossChoice] = useState(false);
    const backImage: number | null = 16;

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
                const nonEnemyCards = allCards.filter((card: Card) => card.type !== "enemy");
                const itemCards = allCards.filter((card: Card) => card.type === "item");
                const bossCards = allCards.filter((card: Card) => card.isBoss === true);

                if (bossCards.length > 0) {
                    const selectedCard = bossCards[Math.floor(Math.random() * bossCards.length)];

                    const cardResponse = await fetch(`${API_BASE_URL}/cards/${selectedCard.id}`);

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
                        isBoss: cardData.isBoss || false,
                    };
                    setCard(newCard);

                    if (newCard.enemyId) {
                        const enemyResponse = await fetch(`${API_BASE_URL}/enemies/${newCard.enemyId}`);
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
                        }
                        setEnemy(newEnemy);
                    } else {
                        setEnemy(null);
                    }
                } else if (nonEnemyCards.length > 0) {
                    // Pick a random card ID from the *filtered* list.
                    const selectedCard = nonEnemyCards[Math.floor(Math.random() * nonEnemyCards.length)];

                    const cardResponse = await fetch(`${API_BASE_URL}/cards/${selectedCard.id}`);

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
                        isBoss: cardData.isBoss || false,
                    };
                    setCard(newCard);

                    if (newCard.enemyId) {
                        const enemyResponse = await fetch(`${API_BASE_URL}/enemies/${newCard.enemyId}`);
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
                        }
                        setEnemy(newEnemy);
                    } else {
                        setEnemy(null);
                    }

                } else if (itemCards.length > 0) {
                    const selectedCard = itemCards[Math.floor(Math.random() * itemCards.length)];

                    const cardResponse = await fetch(`${API_BASE_URL}/cards/${selectedCard.id}`);

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
                        isBoss: cardData.isBoss || false,
                    };
                    setCard(newCard);
                    setEnemy(null);
                } else {
                    console.warn("No non-enemy cards found.");
                    setCard(null);
                    setEnemy(null);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
                setCard(null);
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
        if (card?.isBoss) {
            setShowBossChoice(true);
        } else {
            setIsFlipped(true);
        }
    };

    const handleFightChoice = () => {
        setIsFlipped(true);
        setShowBossChoice(false);

        if (enemy) {
            onFight(enemy.strength, enemy.will);
        }
    };

    const handleDontFightChoice = () => {
        console.log("Player chose not to fight the boss.");
        setShowBossChoice(false);
        setIsFlipped(false);
    };

    const handleEquip = () => {
        if (card) {
            onEquipItem(card);
        }
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

            {showBossChoice && (
                <div className={styles.bossChoiceDialog}>
                    <p>This is a Boss! Do you want to fight?</p>
                    <button onClick={handleFightChoice}>Fight</button>
                    <button onClick={handleDontFightChoice}>Don't Fight</button>
                </div>
            )}

            {isFlipped && !showBossChoice && (
                <>
                    {enemy ? (
                        <EnemyCard
                            name={enemy.name}
                            description={enemy.description}
                            strength={enemy.strength}
                            will={enemy.will}
                            imageId={enemy.imageId}
                            imageName={enemy.imageName || "default-card-image"}
                            onFight={onFight}
                            onDontFight={handleDontFightChoice} //Používám handleDontFightChoice správně
                            cardId={card.id}
                            onEquip={onEquipItem}
                        />
                    ) : card.type === "item" ? (
                        <ItemCard
                            name={card.title}
                            description={card.description}
                            imageId={card.imageId}
                            cardId={card.id}
                            onEquip={onEquipItem}
                            bonusWile={card.bonusWile}
                            bonusStrength={card.bonusStrength}
                            bonusHP={card.bonusHP}
                        />
                    ) : (
                        <div className={styles.cardContainer}>
                            {card.imageId && (
                                <img
                                    src={`${API_BASE_URL}/files/${card.imageId}`}
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