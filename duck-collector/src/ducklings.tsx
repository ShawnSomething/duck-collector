import React, { useEffect, useCallback, useMemo } from "react";

export const Ducklings: React.FC<{
  gameStarted: boolean;
  setDucklingPositions: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  ducklingPositions: { x: number; y: number }[];
  onCollision: (ducklingIndex: number) => void;
  mamaDuckPosition: { x: number; y: number };
}> = ({ gameStarted, setDucklingPositions, ducklingPositions, onCollision, mamaDuckPosition }) => {

  const ducklingWidth = 20;
  const ducklingHeight = 20;

  const spawnDuckling = useCallback(() => {
    const boardWidth = window.innerWidth;
    const boardHeight = window.innerHeight;

    const randomX = Math.random() * (boardWidth - ducklingWidth);
    const randomY = Math.random() * (boardHeight - ducklingHeight);

    setDucklingPositions((prev) => [
      ...prev,
      { x: randomX, y: randomY },
    ]);
  }, [setDucklingPositions]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted) {
      spawnDuckling();
      interval = setInterval(spawnDuckling, 50000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStarted, spawnDuckling]);

  const detectCollision = useCallback((duckling: { x: number; y: number }, ducklingIndex: number) => {
    const proximity = 50;

    const distance = Math.sqrt(
      Math.pow(mamaDuckPosition.x - duckling.x, 2) +
      Math.pow(mamaDuckPosition.y - duckling.y, 2)
    );

    if (distance < proximity) {
      console.log(`Collision with duckling ${ducklingIndex}`);
      onCollision(ducklingIndex);
    }
  }, [mamaDuckPosition, onCollision]);

  useEffect(() => {
    ducklingPositions.forEach((position, index) => detectCollision(position, index));
  }, [ducklingPositions, detectCollision]);

  return (
    <>
      {ducklingPositions.map((position, index) => (
        <div
          key={index}
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
