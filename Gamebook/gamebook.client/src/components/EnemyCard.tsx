import React, { useState } from 'react';
import styles from '../styles/EnemyCard.module.css';
import { API_BASE_URL } from '../api/apiConfig';

interface EnemyCardProps {
    name: string;
    description: string;
    strength: number;
    will: number;
    onFight: (enemyStrength: number, enemyWill: number, statToUse?: "strength" | "will") => void;
    onDontFight: () => void;
    imageId?: number | null;
    imageName: string | null;
}

const EnemyCard: React.FC<EnemyCardProps> = ({
    name,
    description,
    strength,
    will,
    onFight,
    imageId,
    imageName = "Enemy",
}) => {
    console.log("EnemyCard re-rendered");

    const [isFlipped, setIsFlipped] = useState(false);
    const [isFighting, setIsFighting] = useState(false);

    const handleFightClick = () => {
        console.log("handleFightClick called");
        console.log("isFighting before:", isFighting);
        setIsFighting(prevIsFighting => {
            console.log("prevIsFighting:", prevIsFighting);
            const newIsFighting = true;
            console.log("newIsFighting:", newIsFighting);
            return newIsFighting;
        });
    };



    //New functions
    const handleHitStrength = () => {
        onFight(strength, will, "strength");
    }

    const handleHitWill = () => {
        onFight(strength, will, "will");
    }


    return (
        <div className={`${styles.cardContainer} ${isFighting ? styles.fighting : ''}`}>
            <div className={styles.cardInner}>
                {!isFighting && (
                    <>
                        <div className={`${styles.cardFront} `} onClick={() => setIsFlipped(!isFlipped)}>
                            {imageId && (
                                <img src={`${API_BASE_URL}/files/${imageId}`} alt={imageName || ''} className={styles.cardImage} /> //Handle NULL
                            )}
                            <h3>{name}</h3>
                            <p>{description}</p>
                        </div>
                        <div className={`${styles.cardBack} `} onClick={() => setIsFlipped(!isFlipped)}>
                            <p>Strength: {strength}</p>
                            <p>Will: {will}</p>
                            <button onClick={handleFightClick}>Fight</button>
                        </div>
                    </>
                )}
                {isFighting && (
                    <div className={styles.fightMode}>
                         {imageId && ( // Přidáno: Podmíněné zobrazení obrázku
                            <img src={`${API_BASE_URL}/files/${imageId}`} alt={imageName || ''} className={styles.cardImage} />
                         )}
                        <h3>{name}</h3>
                        <p>Strength: {strength}</p>
                        <p>Will: {will}</p>
                         <div className={styles.fightButtons}>
                            <button className={styles.hitButton} onClick={handleHitStrength}>HIT (Síla)</button>
                            <button className={styles.hitButton} onClick={handleHitWill}>HIT (Vůle)</button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnemyCard;