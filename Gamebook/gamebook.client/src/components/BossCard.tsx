import React from 'react';

interface BossCardProps {
  title: string;
  type: string;
  description: string;
  specialAbilities?: string;
  bonusWile?: number;
  bonusStrength?: number;
  bonusHP?: number;
  classOnly?: string;
  diceRollResults?: { [key: number]: string };
  imageUrl?: string; // Assuming you want to display an image

  enemyName?: string; // Assuming you want to display the enemy's name
}

const BossCard: React.FC<BossCardProps> = ({
  title,
  type,
  description,
  specialAbilities,
  bonusWile,
  bonusStrength,
  bonusHP,
  classOnly,
  diceRollResults,
  imageUrl,
  enemyName
}) => {
  return (
    <div className="boss-card">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="boss-card-image" />
      )}
      <h2 className="boss-card-title">{title}</h2>
      <p className="boss-card-type">Type: {type}</p>
      <p className="boss-card-description">{description}</p>

      {enemyName && (
        <p className="boss-card-enemy">Enemy: {enemyName}</p>
      )}

      {specialAbilities && (
        <div className="boss-card-abilities">
          <h3>Special Abilities:</h3>
          <p>{specialAbilities}</p>
        </div>
      )}

      {bonusWile !== undefined && (
        <p className="boss-card-bonus">Wile Bonus: {bonusWile}</p>
      )}
      {bonusStrength !== undefined && (
        <p className="boss-card-bonus">Strength Bonus: {bonusStrength}</p>
      )}
      {bonusHP !== undefined && (
        <p className="boss-card-bonus">HP Bonus: {bonusHP}</p>
      )}

      {classOnly && (
        <p className="boss-card-class-only">Class Only: {classOnly}</p>
      )}

      {diceRollResults && Object.keys(diceRollResults).length > 0 && (
        <div className="boss-card-dice-results">
          <h3>Dice Roll Results:</h3>
          <ul>
            {Object.entries(diceRollResults).map(([roll, result]) => (
              <li key={roll}>Roll {roll}: {result}</li>
            ))}
          </ul>
        </div>
      )}
     
    </div>
  );
};

export default BossCard;