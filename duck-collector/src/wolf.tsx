import React, { useState, useEffect, useRef } from "react";

export const Wolf: React.FC<{
  gameStarted: boolean;
  collectedDucklings: { x: number; y: number; id: string }[];
  mamaDuckPosition: { x: number; y: number };
  onEating: () => void;
  wolfIndex: number;
}> = ({ gameStarted, collectedDucklings, mamaDuckPosition, onEating, wolfIndex }) => {
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [eatingDuckling, setEatingDuckling] = useState(false);
  const wolfSpeed = 3;
  const stoppingDistance = 20;

  const offset = (wolfIndex % 2 === 0 ? 4 : -6) * (wolfIndex * 25);

  const lastActionTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!gameStarted || eatingDuckling) return;

    const moveWolf = () => {
      setCurrentPosition((prev) => {
        if (collectedDucklings.length === 0) return prev;

        const targetX = mamaDuckPosition.x + offset;
        const targetY = mamaDuckPosition.y + offset;

        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const currentTime = Date.now();
        const timeSinceLastAction = currentTime - lastActionTimeRef.current;

        if (distance < stoppingDistance && timeSinceLastAction > 3000) {
          console.log("Wolf reached Mama Duck, stopping for 3 seconds.");
          setEatingDuckling(true);
          onEating();

          lastActionTimeRef.current = currentTime;

          setTimeout(() => {
            console.log("Wolf resumes movement after eating.");
            setEatingDuckling(false);
          }, 2000);

          return prev;
        }

        const directionX = (dx / distance) * wolfSpeed;
        const directionY = (dy / distance) * wolfSpeed;

        return {
          x: prev.x + directionX,
          y: prev.y + directionY,
        };
      });
    };

    const interval = setInterval(moveWolf, 8);

    return () => clearInterval(interval);
  }, [gameStarted, collectedDucklings, mamaDuckPosition, eatingDuckling, onEating, offset]);

  return (
    <>
      <div
        className="wolf"
        style={{
          position: "absolute",
          left: `${currentPosition.x}px`,
          top: `${currentPosition.y}px`,
          transition: "left 0.03s linear, top 0.03s linear",
        }}
      ></div>
    </>
  );
};
