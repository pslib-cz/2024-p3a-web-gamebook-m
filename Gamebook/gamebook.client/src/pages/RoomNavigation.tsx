import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchField, fetchImage, fetchFields } from '../utils/api';
import styles from "../styles/RoomNavigate.module.css"
import { getRandomNumber } from '../utils/utils';


interface Field {
    fieldId: number;
    title: string;
    description: string;
    difficulty: number;
    numOfCards: number;
    diceRollResults: string;
    imageId: number | null;
    enemyId: number | null;
}

const RoomNavigate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
    const [fieldImage, setFieldImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

  const startingFieldId = id ? parseInt(id, 10) : null;

    useEffect(() => {
    const loadData = async () => {
       if(!startingFieldId){
            navigate("/")
          return;
       }
      try {
        setLoading(true)
        const fetchedField = await fetchField(startingFieldId)
        setField(fetchedField)
        if(fetchedField.imageId){
            const imageUrl = await fetchImage(fetchedField.imageId);
            setFieldImage(imageUrl)
        }
        else{
          setFieldImage(null)
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load field data.");
      }finally{
        setLoading(false)
      }
    }
    loadData();
  }, [startingFieldId, navigate]);

    const handleFilterAndMove = async () => {
        try {
            setLoading(true)
            const fields = await fetchFields();
            const filteredFields = fields.filter((field: Field) => field.difficulty === 1);

            if (filteredFields.length === 0) {
                setError("No fields with difficulty 1 found.");
              return;
            }

             const randomNumber = getRandomNumber(1, 6);
            const currentIndex = filteredFields.findIndex((f: { fieldId: number | null; }) => f.fieldId === startingFieldId);


            let nextIndex = (currentIndex + randomNumber) % filteredFields.length;

            if(nextIndex < 0)
                nextIndex += filteredFields.length
            const nextField = filteredFields[nextIndex]
             if (nextField) {
              navigate(`/game/${nextField.fieldId}`);
             }else {
                 setError("No next field found")
             }
         } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load or filter fields.");
        } finally {
            setLoading(false)
        }

    };

  if(loading)
    return <p>Loading...</p>
    if (error) {
        return <p>Error: {error}</p>
    }


    if (!field) {
        return <p>Chyba: Pole s ID {startingFieldId} nenalezeno.</p>;
    }

  return (
    <div className={styles.container}>
         {fieldImage && (
            <div
             className={styles.background}
             style={{ backgroundImage: `url(${fieldImage})` }}
          />
        )}
        <div className={styles.content}>
            <h1>{field.title}</h1>
            <p>{field.description}</p>
            <p>Difficulty: {field.difficulty}</p>
            <button onClick={handleFilterAndMove}>Hodit kostkou</button>
        </div>
    </div>
  );
};

export default RoomNavigate;