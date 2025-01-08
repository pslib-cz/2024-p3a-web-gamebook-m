import React, { useEffect, useState, useCallback } from "react";

const CharacterImage: React.FC = () => {
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);

  // Funkce pro načtení obrázku charakteru s ID 1
  const fetchCharacterImage = useCallback(async () => {
    try {
      const response = await fetch(`/api/Files/1`); // Endpoint pro načtení obrázku s ID 1
      if (!response.ok) {
        throw new Error("Nepodařilo se načíst obrázek charakteru.");
      }

      // Načtení binárních dat (blob)
      const blob = await response.blob();

      // Vytvoření URL pro tento blob
      const imageUrl = URL.createObjectURL(blob);

      setCharacterImageUrl(imageUrl); // Uložení URL pro obrázek
    } catch (error) {
      console.error("Chyba při načítání obrázku charakteru:", error);
    }
  }, []);

  useEffect(() => {
    fetchCharacterImage(); // Načíst obrázek při mountu komponenty
  }, [fetchCharacterImage]);

  return (
    <div>
      {characterImageUrl ? (
        <img src={characterImageUrl} alt="Character" />
      ) : (
        <p>Načítám obrázek...</p>
      )}
    </div>
  );
};

export default CharacterImage;
