import React, { useState } from 'react';

const Pokusy = () => {
  const [data, setData] = useState(null); // Stav pro uchování odpovědi z API
  const [loading, setLoading] = useState(false); // Stav pro sledování načítání
  const [error, setError] = useState(null); // Stav pro chyby

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Resetování chybového stavu před novým požadavkem

    try {
      const response = await fetch(`/api/Enemies`);

      
      if (!response.ok) {
        throw new Error('Chyba při načítání dat');
      }

      const result = await response.json(); // Parsování odpovědi
      setData(result); // Uložení odpovědi do stavu
    } catch (err) {
    } finally {
      setLoading(false); // Nastavení načítání na false
    }
  };

  return (
    <div>
      <h1>Fetch Data from API</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Načítání...' : 'Načíst data'}
      </button>

      {error && <div style={{ color: 'red' }}>Chyba: {error}</div>}

      <div>
        <h2>Odpověď z API:</h2>
        <pre>{data ? JSON.stringify(data, null, 2) : 'Žádná data k zobrazení'}</pre>
      </div>
    </div>
  );
};

export default Pokusy;
