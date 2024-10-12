import React, { useEffect, useCallback, useMemo } from "react"; 
import { v4 as uuidv4 } from 'uuid'

export const Ducklings: React.FC<{
  gameStarted: boolean;
  setDucklingPositions: React.Dispatch<React.SetStateAction<{ id: string, x: number; y: number }[]>>;
  ducklingPositions: { id: string, x: number; y: number }[];
  onCollision: (ducklingId: string) => void;
  mamaDuckPosition: { x: number; y: number };
}> = ({ gameStarted, setDucklingPositions, ducklingPositions, onCollision, mamaDuckPosition }) => {

  const ducklingWidth = 20;
  const ducklingHeight = 20;

  const spawnDuckling = useCallback(() => {
    const boardWidth = window.innerWidth;
    const boardHeight = window.innerHeight;

    const randomX = Math.random() * (boardWidth - ducklingWidth);
    const randomY = Math.random() * (boardHeight - ducklingHeight);
    const newDuckling = {
      id: uuidv4(),
      x: randomX,
      y: randomY,
    }

    setDucklingPositions((prev) => [
      ...prev,
      newDuckling,
    ]);
  }, [setDucklingPositions]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted) {
      spawnDuckling();
      interval = setInterval(spawnDuckling, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStarted, spawnDuckling]);

  const detectCollision = useCallback((duckling: { id: string; x: number; y: number }) => {
    const proximity = 50;

    const distance = Math.sqrt(
      Math.pow(mamaDuckPosition.x - duckling.x, 2) +
      Math.pow(mamaDuckPosition.y - duckling.y, 2)
    );

    if (distance < proximity) {
      console.log(`Collision with duckling ${duckling.id}`);
      onCollision(duckling.id);
    }
  }, [mamaDuckPosition, onCollision]);

  useEffect(() => {
    ducklingPositions.forEach((position) => detectCollision(position));
  }, [ducklingPositions, detectCollision]);

  return (
    <>
      {ducklingPositions.map((position) => (
        <div
          key={position.id}
          className="ducklings"
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      ))}
    </>
  );
};
