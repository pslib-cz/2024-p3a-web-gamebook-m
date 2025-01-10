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

  export const fetchCharacters = async () : Promise<any> => {
      const response = await fetch("/api/characters");
      const data = await handleResponse(response).then(res => res.json());
      return data.items;
  }

    export const fetchCharacter = async (id: number) : Promise<any> => {
       const response = await fetch(`/api/characters/${id}`);
       return await handleResponse(response).then(res => res.json());
    }

   export const fetchImage = async (imageId: number): Promise<string> => {
      const response = await fetch(`/api/Files/${imageId}`);
      const blob = await handleResponse(response).then(res => res.blob());
      return URL.createObjectURL(blob);
    };

    export const fetchField = async (id: number): Promise<any> => {
        const response = await fetch(`/api/fields/${id}`);
      return handleResponse(response).then(res => res.json());
    }
      export const fetchFields = async (): Promise<any> => {
        const response = await fetch(`/api/fields`);
      return handleResponse(response).then(res => res.json()).then(data => data.items)
    }