import React, { useState, useEffect } from "react";
import "./App.css";
import { GameBoard } from "./game-board";
import { GameStart } from "./game-start";
import { MamaDuck } from "./mama-duck";
import { Ducklings } from "./ducklings";
import { HUD } from "./hud";
import { Wolf } from "./wolf";
import { Butcher } from "./butcher";
import { GameEnd } from "./game-end";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ducklingPositions, setDucklingPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [collectedDucklings, setCollectedDucklings] = useState<
    { x: number; y: number }[]
  >([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wolves, setWolves] = useState<Array<{ x: number; y: number }>>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [addTime, setAddTime] = useState(0);

  const handleCollision = (ducklingIndex: number) => {
    const collectedDuckling = ducklingPositions[ducklingIndex];
    setDucklingPositions((prev) =>
      prev.filter((_, index) => index !== ducklingIndex)
    );
    setCollectedDucklings((prev) => [...prev, collectedDuckling]);
  };

  const handleEating = () => {
    if (collectedDucklings.length > 0) {
      setCollectedDucklings((prev) => {
        const newCollectedDucklings = prev.slice(0, -1);
        if (newCollectedDucklings.length === 0) {
          setGameEnded(true);
        }
        return newCollectedDucklings;
      });
    }
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
    setWolves([]);
    setGameEnded(false);
  };

  const handleButcherCollision = () => {
    setCollectedDucklings((prev) => prev.slice(0, -1));
    setAddTime(5);
  };

  useEffect(() => {
    const numberOfWolves = Math.floor((collectedDucklings.length - 1) / 3) + 1;
    if (collectedDucklings.length > 0 && wolves.length < numberOfWolves) {
      setWolves((prevWolves) => [...prevWolves, { x: 0, y: 0 }]);
    }
  }, [collectedDucklings, wolves]);

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
            {wolves.map((wolfPosition, index) => (
              <Wolf
                key={index}
                gameStarted={gameStarted}
                collectedDucklings={collectedDucklings}
                mamaDuckPosition={mamaDuckPosition}
                onEating={handleEating}
                wolfIndex={index}
              />
            ))}
            <Butcher
              gameStarted={gameStarted}
              collectedDucklings={collectedDucklings}
              onButcherCollision={handleButcherCollision}
              mamaDuckPosition={mamaDuckPosition}
            />
            <div>
              <HUD
                collectedCount={collectedDucklings.length}
                onTimerTick={handleTimerTick}
                addTime={addTime}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
