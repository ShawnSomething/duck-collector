import React, { useState, useEffect, useRef } from "react";

export const Butcher: React.FC<{
  gameStarted: boolean;
  collectedDucklings: { x: number; y: number; id: string }[];
  onButcherCollision: () => void;
  mamaDuckPosition: { x: number; y: number };
}> = ({ gameStarted, collectedDucklings, onButcherCollision, mamaDuckPosition }) => {
  const [isButcherVisible, setIsButcherVisible] = useState(false);
  const butcherPosition = { x: window.innerWidth / 2, y: 0 };

  const lastCollisionTimeRef = useRef<number>(0);

  useEffect(() => {
    const showButcher = () => {
      if (collectedDucklings.length >= 10) {
        setIsButcherVisible(true);
      } else if (collectedDucklings.length < 5) {
        setIsButcherVisible(false);
      }
    };
    showButcher();
  }, [collectedDucklings.length]);

  useEffect(() => {
    const detectButcherCollision = () => {
      const distanceX = mamaDuckPosition.x - butcherPosition.x;
      const distanceY = mamaDuckPosition.y - butcherPosition.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const currentTime = Date.now();
      const timeSinceLastCollision = currentTime - lastCollisionTimeRef.current;

      if (distance <= 80 && timeSinceLastCollision > 1000) {
        onButcherCollision();
        lastCollisionTimeRef.current = currentTime;
        console.log("Butcher collided with Mama Duck. Collision cooldown started.");
      }
    };

    if (isButcherVisible) {
      detectButcherCollision();
    }
  }, [mamaDuckPosition, isButcherVisible, onButcherCollision]);

  return (
    <>
      {isButcherVisible && (
        <div
          className="butcher"
          style={{ position: "absolute", left: butcherPosition.x, top: butcherPosition.y }}
        ></div>
      )}
    </>
  );
};
