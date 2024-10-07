import React, { useState, useEffect } from "react";

export const Wolf: React.FC<{ gameStarted: boolean; collectedDucklings: { x: number; y: number }[]; mamaDuckPosition: { x: number; y: number }; onEating: () => void }> = ({ gameStarted, collectedDucklings, mamaDuckPosition, onEating }) => {
    const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [eatingDuckling, setEatingDuckling] = useState(false);
    const wolfSpeed = 2.5;
    const stoppingDistance = 25; 

    useEffect(() => {
        if (!gameStarted || eatingDuckling) return;

        const moveWolf = () => {
            setCurrentPosition((prev) => {
                if (collectedDucklings.length === 0) return prev;

                const dx = mamaDuckPosition.x - prev.x;
                const dy = mamaDuckPosition.y - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < stoppingDistance) {
                    console.log("Wolf reached Mama Duck, stopping for 2 seconds.");
                    setEatingDuckling(true);
                    onEating();
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

        const interval = setInterval(moveWolf, 5);

        return () => clearInterval(interval);
    }, [gameStarted, collectedDucklings, mamaDuckPosition, eatingDuckling, onEating]);

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
