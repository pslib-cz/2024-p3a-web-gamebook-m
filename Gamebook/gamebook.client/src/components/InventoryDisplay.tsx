import React, { useState, useEffect } from 'react';

interface Inventory {
  id: number;
  cardIds: number[];
}

const InventoryDisplay: React.FC<{inventoryId: number}> = ({inventoryId}) => {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadData = async () => {
            try{
              setLoading(true)
                const response = await fetch(`http://localhost:5000/api/inventories/${inventoryId}`);

                if (!response.ok) {
                  const errorText = await response.text();
                   throw new Error(`Failed to fetch inventory data: ${response.status} ${response.statusText} ${errorText}`);
                }

                const data: Inventory = await response.json();
                setInventory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load inventory data.");
            } finally {
              setLoading(false)
            }
        };

        loadData();
    }, [inventoryId]);

   if(loading)
        return <p>Loading...</p>

    if (error) {
        return <p>Error: {error}</p>
    }

    if (!inventory) {
        return <p>Inventory not found.</p>
    }
    return (
         <div >
              <div >
                 <h2>Inventory ID: {inventory.id}</h2>
                {inventory.cardIds.length > 0 ? (
                  <ul>
                  {inventory.cardIds.map((cardId) => (
                     <li key={cardId}>Card ID: {cardId}</li>
                     ))}
                  </ul>
               ) : (
                   <p>No cards in this inventory.</p>
                )}
            </div>
         </div>
    );
};

export default InventoryDisplay;