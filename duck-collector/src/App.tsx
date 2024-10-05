import React, { useState } from "react";
import "./App.css";
import { GameBoard } from "./game-board";
import { GameStart } from "./game-start";
import { MamaDuck } from "./mama-duck";
import { Ducklings } from "./ducklings";
import { HUD } from "./hud";
import { Wolf } from "./wolf";
import { GameEnd } from "./game-end";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ducklingPositions, setDucklingPositions] = useState<
    { left: number; top: number }[]
  >([]);
  const [collectedDucklings, setCollectedDucklings] = useState<
    { left: number; top: number }[]
  >([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wolfPosition, setWolfPosition] = useState({ left: 0, top: 0 });
  const [gameEnded, setGameEnded] = useState(false);

  const handleCollision = (ducklingIndex: number) => {
    const collectedDuckling = ducklingPositions[ducklingIndex];
    setDucklingPositions((prev) =>
      prev.filter((_, index) => index !== ducklingIndex)
    );
    setCollectedDucklings((prev) => [...prev, collectedDuckling]);

    setWolfPosition(collectedDuckling)
  };

  const handleTimerTick = (timeLeft: number) => {
    if (timeLeft === 0) {
      setGameEnded(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setDucklingPositions([]);
    setCollectedDucklings([]);
    setMamaDuckPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    setGameEnded(false);
  };

  return (
    <>
      <div>
        <GameBoard />

        {!gameStarted && <GameStart onStart={() => setGameStarted(true)} />}

        {gameEnded && (
          <GameEnd totalScore={collectedDucklings.length} onReset={resetGame} />
        )}

        {gameStarted && !gameEnded && (
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
            {collectedDucklings.length === 1 && (
              <div>
                <Wolf gameStarted={false} wolfPosition={wolfPosition}/>
              </div>
            )}

            <div>
              <HUD
                collectedCount={collectedDucklings.length}
                onTimerTick={handleTimerTick}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
