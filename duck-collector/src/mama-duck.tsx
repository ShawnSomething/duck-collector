import React, { useState, useEffect, useRef, useMemo } from "react";

export const MamaDuck: React.FC<{
  collectedDucklings: { x: number; y: number, id: string }[];
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  mamaDuckPosition: { x: number; y: number };
}> = ({ collectedDucklings, setPosition, mamaDuckPosition }) => {
  const [position, updatePosition] = useState(mamaDuckPosition);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([]);
  const speed = 4.5;
  const keysPressed = useRef<Set<string>>(new Set());
  const [rotation, setRotation] = useState(0);
  const maxHistoryLength = collectedDucklings.length * 14;
  const animationRef = useRef<number | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    keysPressed.current.add(key);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const { key } = event;
    keysPressed.current.delete(key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      let targetPosition = { ...position };
      let directionX = 0;
      let directionY = 0;

      if (keysPressed.current.has("w")) {
        targetPosition.y = Math.max(0, position.y - speed);
        directionY -= 1;
      }
      if (keysPressed.current.has("a")) {
        targetPosition.x = Math.max(0, position.x - speed);
        directionX -= 1;
      }
      if (keysPressed.current.has("s")) {
        targetPosition.y = Math.min(window.innerHeight - 50, position.y + speed);
        directionY += 1;
      }
      if (keysPressed.current.has("d")) {
        targetPosition.x = Math.min(window.innerWidth - 50, position.x + speed);
        directionX += 1;
      }

      if (directionX !== 0 || directionY !== 0) {
        const angle = Math.atan2(directionY, directionX);
        const degrees = angle * (180 / Math.PI);
        setRotation(degrees + 90);
      }

      if (position.x !== targetPosition.x || position.y !== targetPosition.y) {
        updatePosition(targetPosition);
        setPosition(targetPosition);
        setHistory((prevHistory) => {
          const updatedHistory = [...prevHistory, targetPosition];
          if (updatedHistory.length > maxHistoryLength) {
            updatedHistory.shift();
          }
          return updatedHistory;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position, setPosition, maxHistoryLength]);

  const ducklingPositions = useMemo(() => {
    return collectedDucklings.map((_, index) => {
      const historyIndex = Math.max(0, history.length - (index + 2.5) * 4);
      const ducklingPosition = history[historyIndex] || position;
      const angleOffset = (index / collectedDucklings.length) * (Math.PI / 2);
      const distanceFromMama = 45 + (index % 3) * 5;

      return {
        x: ducklingPosition.x - distanceFromMama * Math.cos(rotation * (Math.PI / 260)) + distanceFromMama * Math.cos(angleOffset),
        y: ducklingPosition.y - distanceFromMama * Math.sin(rotation * (Math.PI / 300)) + distanceFromMama * Math.sin(angleOffset),
      };
    });
  }, [collectedDucklings, history, position, rotation]);

  return (
    <>
      <div
        className="mama-duck"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: "absolute",
          transform: `rotate(${rotation}deg)`,
        }}
      ></div>

      {ducklingPositions.map((ducklingPosition, index) => (
        <div
          key={index}
          className="ducklings"
          style={{
            position: "absolute",
            left: `${ducklingPosition.x}px`,
            top: `${ducklingPosition.y}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        ></div>
      ))}
    </>
  );
};
