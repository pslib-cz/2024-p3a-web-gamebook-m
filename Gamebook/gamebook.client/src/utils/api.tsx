

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = "An error occurred.";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Do nothing
        }

        throw new Error(errorMessage);
    }
    return response;
}

export interface Character{
  id: number;
  name: string;
  description: string;
  imageId: number;
}

export interface Field {
  fieldId: number;
  title: string;
  description: string;
  difficulty: number;
  numOfCards: number;
  diceRollResults: string;
  imageId: number | null;
  enemyId: number | null;
}

export interface Image {
  imageUrl: string;
}

export interface Inventory {
  id: number;
  cardIds: number[];
}
// Funkce pro fetchování dat
export const fetchCharacters = async (): Promise<Character[]> => {
    const response = await fetch(`api/characters`);
    const data = await handleResponse(response).then(res => res.json());
    return data.items;
}

export const fetchCharacter = async (id: number): Promise<Character> => {
    const response = await fetch(`api/characters/${id}`);
    return await handleResponse(response).then(res => res.json());
}

export const fetchImage = async (imageId: number): Promise<string> => {
    const response = await fetch(`api/files/${imageId}`);
     if (!response.ok) {
        let errorMessage = "An error occurred.";
        try {
           const errorData = await response.text();
             errorMessage = errorData || errorMessage;
        } catch {
         // Do nothing
         }
        throw new Error(errorMessage);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

export const fetchField = async (id: number): Promise<Field> => {
    const response = await fetch(`api/fields/${id}`);
    return handleResponse(response).then(res => res.json());
}

export const fetchFields = async (): Promise<Field[]> => {
    const response = await fetch(`api/fields`);
    return handleResponse(response).then(res => res.json()).then(data => data.items)
}

// Funkce pro fetchování imageId
export const fetchFieldImageId = async (id: number): Promise<number | null> => {
    const response = await fetch(`api/fields/${id}/imageid`);
    const data = await handleResponse(response).then(res => res.json());
     return data.imageId;
};

// Funkce pro fetchování dat inventáře
export const fetchInventory = async (id: number): Promise<Inventory> => {
    const response = await fetch(`api/inventories/${id}`);
     return await handleResponse(response).then(res => res.json());
};