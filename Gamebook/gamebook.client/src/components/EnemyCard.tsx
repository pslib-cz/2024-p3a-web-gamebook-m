import React, { useState, useEffect } from 'react';
import styles from '../styles/EnemyCard.module.css';

interface EnemyCardProps {
    name: string;
    description: string;
    strength: number;
    will: number;
    onFight: (enemyStrength: number, enemyWill: number, attackType: "strength" | "will" | "boss") => void;
    onDontFight?: () => void;
    imageId?: number | null;
    imageName?: string | null;
    cardId?: number;
    onEquip?: (card: { id: number; name: string; }) => void;
    isBoss?: boolean;
    hasWonFight?: boolean;
}

const EnemyCard: React.FC<EnemyCardProps> = ({
    name,
    description,
    strength,
    will,
    onFight,
    imageId,
    imageName = "Enemy",
    isBoss = false,
    hasWonFight = false,
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFighting, setIsFighting] = useState(false);
    const [attackType, setAttackType] = useState<"strength" | "will" | null>(null);
    const [waitingForReset, setWaitingForReset] = useState(false);

    useEffect(() => {
        // Determine attack type based on strength and will values
        if (strength > will) {
            setAttackType("strength");
        } else {
            setAttackType("will");
        }
    }, [strength, will]);

    const handleFightClick = () => {
        console.log("handleFightClick called - isBoss:", isBoss);
        setIsFighting(true);
        setWaitingForReset(false);
    };

    const handleHit = () => {
        console.log("handleHit called - isBoss:", isBoss);
        if (attackType) {
            // If this is a boss, use "boss" attack type, otherwise use the normal attack type
            if (isBoss || name.toLowerCase().includes("boss")) {
                console.log("EnemyCard: Using 'boss' attack type for boss enemy");
                onFight(strength, will, "boss");
            } else {
                onFight(strength, will, attackType);
            }
            
            // Instead of resetting fighting state immediately, set a flag
            setWaitingForReset(true);
            
            // Reset fight state after a brief delay to allow animations/effects to complete
            setTimeout(() => {
                setIsFighting(false);
                setWaitingForReset(false);
            }, 2500);
        }
    };

    // Determine if this is a boss based on the flag or the name
    const displayAsBoss = isBoss || name.toLowerCase().includes("boss");

    return (
        <div className={`${styles.cardContainer} ${isFighting ? styles.fighting : ''} ${displayAsBoss ? styles.bossCard : ''}`}>
            <div className={styles.cardInner}>
                {!isFighting && (
                    <>
                        <div className={`${styles.cardFront} `} onClick={() => setIsFlipped(!isFlipped)}>
                            {imageId && (
                                <img src={`/api/files/${imageId}`} alt={imageName || ''} className={styles.cardImage} />
                            )}
                            <h3>{name} {displayAsBoss && <span className={styles.bossLabel}>BOSS</span>}</h3>
                            <p>{description}</p>
                            
                            {/* Only show the Fight button if the fight hasn't been won */}
                            {!hasWonFight && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFightClick();
                                    }}
                                    className={displayAsBoss ? styles.bossFightButton : ''}
                                >
                                    Fight {displayAsBoss ? 'Boss' : ''}
                                </button>
                            )}
                            
                            {/* Show victory message if fight was won */}
                            {hasWonFight && (
                                <p className={styles.victoryMessage}>
                                    You defeated {displayAsBoss ? 'the BOSS!' : 'this enemy!'}
                                </p>
                            )}
                        </div>
                        <div className={`${styles.cardBack} `} onClick={() => setIsFlipped(!isFlipped)}>
                            <p>Strength: {strength}</p>
                            <p>Will: {will}</p>
                            
                            {/* Only show the Fight button if the fight hasn't been won */}
                            {!hasWonFight && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFightClick();
                                    }}
                                    className={displayAsBoss ? styles.bossFightButton : ''}
                                >
                                    Fight {displayAsBoss ? 'Boss' : ''}
                                </button>
                            )}
                            
                            {/* Show victory message if fight was won */}
                            {hasWonFight && (
                                <p className={styles.victoryMessage}>
                                    You defeated {displayAsBoss ? 'the BOSS!' : 'this enemy!'}
                                </p>
                            )}
                        </div>
                    </>
                )}
                {isFighting && (
                    <div className={styles.fightMode}>
                        {imageId && ( 
                            <img src={`/api/files/${imageId}`} alt={imageName || ''} className={styles.cardImage} />
                        )}
                        <h3>{name} {displayAsBoss && <span className={styles.bossLabel}>BOSS</span>}</h3>
                        <p>Strength: {strength}</p>
                        <p>Will: {will}</p>
                        
                        {!waitingForReset && attackType && !hasWonFight && (
                            <div className={styles.fightButtons}>
                                <button 
                                    className={`${styles.hitButton} ${displayAsBoss ? styles.bossHitButton : ''}`} 
                                    onClick={handleHit}
                                >
                                    HIT ({attackType === "strength" ? "Síla" : "Vůle"})
                                </button>
                            </div>
                        )}
                        
                        {waitingForReset && (
                            <div className={styles.fightResult}>
                                <p>Processing attack...</p>
                            </div>
                        )}
                        
                        {hasWonFight && (
                            <p className={styles.victoryMessage}>
                                You defeated {displayAsBoss ? 'the BOSS!' : 'this enemy!'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnemyCard;