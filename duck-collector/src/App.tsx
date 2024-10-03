import React, { useState } from "react";
import "./App.css";
import { GameBoard } from "./game-board";
import { GameStart } from "./game-start";
import { MamaDuck } from "./mama-duck";
import { Ducklings } from "./ducklings";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ducklingPositions, setDucklingPositions] = useState<
    { left: number; top: number }[]
  >([]);
  const [collectedDucklings, setCollectedDucklings] = useState<
    { left: number; top: number }[]
  >([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const handleCollision = (ducklingIndex: number) => {
    const collectedDuckling = ducklingPositions[ducklingIndex];
    setDucklingPositions(prev => prev.filter((_, index) => index !== ducklingIndex));
    setCollectedDucklings(prev => [...prev, collectedDuckling]);
};

  return (
    <>
      <div>
        <GameBoard />

        {!gameStarted && <GameStart onStart={() => setGameStarted(true)} />}

        {gameStarted && (
          <>
            <MamaDuck
              collectedDucklings={collectedDucklings}
              setPosition={setMamaDuckPosition}
              mamaDuckPosition={mamaDuckPosition}
            />
            <Ducklings
              gameStarted={gameStarted}
              setDucklingPositions={setDucklingPositions}
              ducklingPositions={ducklingPositions}
              onCollision={handleCollision}
              mamaDuckPosition={mamaDuckPosition}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
