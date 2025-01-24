import React, { useState } from "react";
import Dice from "../components/Dice";

const DiceControl: React.FC = () => {
  const [canRoll, setCanRoll] = useState(true);
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = (result: number) => {
    setCanRoll(false);
    setResult(result);
  };

  return (
    <>     
    <div>
      <Dice onRoll={handleRoll} canRoll={canRoll} />
    </div>
    <button onClick={() => setCanRoll(true)}>Roll again!</button>
    <p>Result : {result} </p>
</>

  );
}

export default DiceControl;
