import React, { useState, useEffect, useCallback } from "react";
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
  const [ducklingPositions, setDucklingPositions] = useState<{ x: number; y: number }[]>([]);
  const [collectedDucklings, setCollectedDucklings] = useState<{ x: number; y: number }[]>([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2 
  });
  const [gameEnded, setGameEnded] = useState(false);

  const handleCollision = useCallback((ducklingIndex: number) => {
    const collectedDuckling = ducklingPositions[ducklingIndex];
    setDucklingPositions((prev) => prev.filter((_, index) => index !== ducklingIndex));
    setCollectedDucklings((prev) => [...prev, collectedDuckling]);
  }, [ducklingPositions]);

  const handleEating = useCallback(() => {
    setCollectedDucklings((prev) => {
      const newCollectedDucklings = prev.slice(0, -1);
      if (newCollectedDucklings.length === 0) {
        setGameEnded(true);
      }
      return newCollectedDucklings;
    });
  }, []);

  const handleTimerTick = useCallback((timeLeft: number) => {
    if (timeLeft === 0) {
      setGameEnded(true);
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setDucklingPositions([]);
    setCollectedDucklings([]);
    setMamaDuckPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setGameEnded(false);
  }, []);

  return (
    <div>
      <GameBoard />
      {!gameStarted ? (
        <GameStart onStart={() => setGameStarted(true)} />
      ) : gameEnded ? (
        <GameEnd totalScore={collectedDucklings.length} onReset={resetGame} />
      ) : (
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
          {collectedDucklings.length > 0 && (
            <Wolf
              gameStarted={gameStarted}
              collectedDucklings={collectedDucklings} 
              mamaDuckPosition={mamaDuckPosition}
              onEating={handleEating}              
            />
          )}
          <HUD
            collectedCount={collectedDucklings.length}
            onTimerTick={handleTimerTick}
          />
        </>
      )}
    </div>
  );
}

export default App;
