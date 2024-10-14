import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./App.css";
import { GameBoard } from "./game-board";
import { GameStart } from "./game-start";
import { Howl } from "howler";
import { MamaDuck } from "./mama-duck";
import { Ducklings } from "./ducklings";
import { HUD } from "./hud";
import { Wolf } from "./wolf";
import { Butcher } from "./butcher";
import { GameEnd } from "./game-end";

const menuMusic = new Howl({
  src: ["/audio/Peyruis-Swing.mp3"],
  loop: true,
  volume: 0.2,
  pool: 100,
});

const gameMusic = new Howl({
  src: ["/audio/ExoNova-Electro-Swingity.mp3"],
  loop: true,
  volume: 0.2,
  pool: 250,
});

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [ducklingPositions, setDucklingPositions] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [collectedDucklings, setCollectedDucklings] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [mamaDuckPosition, setMamaDuckPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wolves, setWolves] = useState<Array<{ x: number; y: number }>>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [addTime, setAddTime] = useState(0);

  const collisionSound = new Audio("/audio/Duck-Quack.mp3");
  collisionSound.volume = 0.2; 

  const eatingSound = new Howl({
    src: ["/audio/Eat-Munch.mp3"],
    volume: 0.2,
    pool: 25,
  });

  const butcherCollisionSound = new Audio("/audio/Cash-Register.mp3");
  butcherCollisionSound.volume = 0.2; 

  useEffect(() => {
    if (gameStarted) {
      if (!gameMusic.playing()) {
        gameMusic.play();
      }
      menuMusic.stop();
    } else {
      if (!menuMusic.playing()) {
        menuMusic.play();
      }
      gameMusic.stop();
    }

    return () => {
      menuMusic.stop();
      gameMusic.stop();
    };
  }, [gameStarted, gameEnded]);

  const handleCollision = (ducklingId: string) => {
    collisionSound.play(); 
    setDucklingPositions((prev) => 
      prev.filter((duckling) => duckling.id !== ducklingId)
    );
    const collectedDucklings = ducklingPositions.find(
      (duckling) => duckling.id === ducklingId
    );
    if (collectedDucklings) {
      setCollectedDucklings((prev) => [...prev, collectedDucklings]);
    }
  };

  const handleEating = () => {
    eatingSound.play();
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
    butcherCollisionSound.play();
    setCollectedDucklings((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      } else {
        return [];
      }
    });
    setAddTime((prevAddTime) => prevAddTime + 5);
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
