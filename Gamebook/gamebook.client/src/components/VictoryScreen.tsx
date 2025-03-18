import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/VictoryScreen.module.css';

interface VictoryScreenProps {
  character: {
    name: string;
    imageId?: string;
    strength?: number;
    will?: number;
  };
  strengthBonusFromEnemies: number;
  willBonusFromEnemies: number;
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  character, 
  strengthBonusFromEnemies, 
  willBonusFromEnemies, 
   
}) => {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; animationDuration: string; color: string }>>([]);
  
  // Generate confetti effect
  useEffect(() => {
    const colors = ['#c19a49', '#6b3e11', '#f8deaa', '#8b5a2b', '#e0d5b1'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  }, []);

  const handleReturnToStart = () => {
    // Clear game state
    localStorage.removeItem("currentDifficulty");
    localStorage.removeItem("strengthBonusFromEnemies");
    localStorage.removeItem("willBonusFromEnemies");
    localStorage.removeItem("currentHP");
    localStorage.removeItem("playerInventory");
    localStorage.removeItem("equippedItemIds");
    
    // Navigate to start page
    navigate('/');
  };

  return (
    <div className={styles.victoryContainer}>
      {confetti.map((c) => (
        <div 
          key={c.id} 
          className={styles.confetti} 
          style={{ 
            left: c.left, 
            animationDuration: c.animationDuration,
            backgroundColor: c.color
          }}
        />
      ))}
      
      <div className={styles.victoryContent}>
        <h1 className={styles.victoryTitle}>Victory!</h1>
        
        {character?.imageId && (
          <img 
            src={`api/files/${character.imageId}`} 
            alt={character.name} 
            className={styles.character}
          />
        )}
        
        <p className={styles.victoryMessage}>
          Congratulations, brave {character?.name}! You have conquered all challenges 
          and emerged victorious. Your name shall be remembered in legends for ages to come.
        </p>
        
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Strength</div>
            <div className={styles.statValue}>
              {((character?.strength || 0) + strengthBonusFromEnemies).toFixed(1)}
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Will</div>
            <div className={styles.statValue}>
              {((character?.will || 0) + willBonusFromEnemies).toFixed(1)}
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Final Level</div>
            <div className={styles.statValue}>Master</div>
          </div>
        </div>
        
        <button className={styles.returnButton} onClick={handleReturnToStart}>
          Return to Main Menu
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;