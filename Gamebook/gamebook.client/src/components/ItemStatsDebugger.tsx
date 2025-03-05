import React, { useEffect, useState } from 'react';
import styles from '../styles/ItemStatsDebugger.module.css';

interface ItemStatsDebuggerProps {
  showDebug?: boolean;
}

/**
 * Debug component to display item stat information and localStorage values
 * Useful during development to verify that stats are being calculated and applied correctly
 */
const ItemStatsDebugger: React.FC<ItemStatsDebuggerProps> = ({ showDebug = false }) => {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    const loadLocalStorageData = () => {
      const relevantKeys = [
        'itemStrengthBonus',
        'itemWillBonus',
        'itemHPBonus',
        'currentHP',
        'maxHP',
        'strengthBonusFromEnemies',
        'willBonusFromEnemies',
        'equippedItemIds',
        'playerInventory',
        'currentDifficulty'
      ];
      
      const data: Record<string, string> = {};
      
      relevantKeys.forEach(key => {
        const value = localStorage.getItem(key);
        data[key] = value || 'null';
      });
      
      setLocalStorageData(data);
    };
    
    if (showDebug) {
      loadLocalStorageData();
      // Refresh every second to catch updates
      const interval = setInterval(loadLocalStorageData, 1000);
      return () => clearInterval(interval);
    }
  }, [showDebug]);
  
  if (!showDebug) return null;
  
  return (
    <div className={`${styles.debuggerContainer} ${expanded ? styles.expanded : ''}`}>
      <div 
        className={styles.debuggerHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <h3>Item Stats Debug {expanded ? '[-]' : '[+]'}</h3>
      </div>
      
      {expanded && (
        <div className={styles.debuggerContent}>
          <h4>LocalStorage Values:</h4>
          <table className={styles.debuggerTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(localStorageData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td className={styles.valueCell}>
                    {key === 'equippedItemIds' || key === 'playerInventory' 
                      ? value.length > 20 ? value.substring(0, 20) + '...' : value
                      : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles.actions}>
            <button 
              onClick={() => {
                // Reset all item-related stats
                localStorage.setItem('itemStrengthBonus', '0');
                localStorage.setItem('itemWillBonus', '0');
                localStorage.setItem('itemHPBonus', '0');
                // Refresh the component
                setLocalStorageData({...localStorageData});
              }}
            >
              Reset Item Bonuses
            </button>
            
            <button 
              onClick={() => {
                // Reset enemy-related stats
                localStorage.setItem('strengthBonusFromEnemies', '0');
                localStorage.setItem('willBonusFromEnemies', '0');
                // Refresh the component
                setLocalStorageData({...localStorageData});
              }}
            >
              Reset Enemy Bonuses
            </button>
            
            <button 
              onClick={() => {
                // Restore HP to max
                const maxHP = localStorage.getItem('maxHP') || '10';
                localStorage.setItem('currentHP', maxHP);
                // Refresh the component
                setLocalStorageData({...localStorageData});
              }}
            >
              Restore Full HP
            </button>
            
            <button 
              onClick={() => {
                // Clear equipment
                localStorage.removeItem('equippedItemIds');
                // Refresh the component
                setLocalStorageData({...localStorageData});
              }}
            >
              Unequip All Items
            </button>
            
            <button 
              onClick={() => {
                // Reload the page to force a complete refresh
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemStatsDebugger;