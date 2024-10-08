import React, { useState, useEffect, useCallback } from "react";

const WOLF_SPEED = 11;
const STOPPING_DISTANCE = 25;
const MOVE_INTERVAL = 15;

export const Wolf: React.FC<{
  gameStarted: boolean;
  collectedDucklings: { x: number; y: number }[];
  mamaDuckPosition: { x: number; y: number };
  onEating: () => void;
}> = ({ gameStarted, collectedDucklings, mamaDuckPosition, onEating }) => {
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [eatingDuckling, setEatingDuckling] = useState(false);

  const moveWolf = useCallback(() => {
    setCurrentPosition((prev) => {
      if (collectedDucklings.length === 0) return prev;

      const dx = mamaDuckPosition.x - prev.x;
      const dy = mamaDuckPosition.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < STOPPING_DISTANCE) {
        console.log("Wolf reached Mama Duck, stopping for 2 seconds.");
        setEatingDuckling(true);
        onEating();
        setTimeout(() => {
          console.log("Wolf resumes movement after eating.");
          setEatingDuckling(false);
        }, 2000);
        return prev; // Stop moving the wolf
      }

      const directionX = (dx / distance) * WOLF_SPEED;
      const directionY = (dy / distance) * WOLF_SPEED;

      return {
        x: prev.x + directionX,
        y: prev.y + directionY,
      };
    });
  }, [collectedDucklings, mamaDuckPosition, onEating]);

  useEffect(() => {
    if (!gameStarted || eatingDuckling) return;

    const interval = setInterval(moveWolf, MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, [gameStarted, eatingDuckling, moveWolf]);

  return (
    <div
      className="wolf"
      style={{
        position: "absolute",
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        transition: "left 0.03s linear, top 0.03s linear",
      }}
    ></div>
  );
};
