import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'
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
    {id: string, x: number; y: number }[]
  >([]);
  const [collectedDucklings, setCollectedDucklings] = useState<
    { id: string, x: number; y: number }[]
  >([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wolves, setWolves] = useState<Array<{ x: number; y: number }>>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [addTime, setAddTime] = useState(0);

  const handleCollision = (ducklingId: string) => {
    setDucklingPositions((prev) => 
      prev.filter((duckling) => duckling.id !== ducklingId)
  )
  const collectedDucklings = ducklingPositions.find(
    (duckling) => duckling.id === ducklingId
  )
  if (collectedDucklings) {
    setCollectedDucklings((prev) => [...prev, collectedDucklings])
  }
  }

  const handleEating = () => {
    setCollectedDucklings((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      } else {
        setGameEnded(true);
        return [];
      }
    });
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
    setCollectedDucklings((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1)
      } else {
        return []
      }
    })
    setAddTime((prevAddTime) => prevAddTime + 5)
  }

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
