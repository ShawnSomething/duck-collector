import React, { useState, useEffect } from "react";

interface DucklingPosition {
    x: number;
    y: number;
}

export const Wolf: React.FC<{ gameStarted: boolean; collectedDucklings: DucklingPosition[] }> = ({ gameStarted, collectedDucklings }) => {
    const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPosition((prev) => {
                if (collectedDucklings.length === 0) return prev;
                const targetDuckling = collectedDucklings[collectedDucklings.length - 1];

                const dx = targetDuckling.x - prev.x;
                const dy = targetDuckling.y - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const collisionThreshold = 30;
                if (distance < collisionThreshold) {
                    return prev;
                }

                const speed = 30;
                const newX = prev.x + (dx / distance) * speed;
                const newY = prev.y + (dy / distance) * speed;

                return { x: newX, y: newY };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [collectedDucklings]);

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
