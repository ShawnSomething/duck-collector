import React, { useState, useEffect } from "react";

interface DucklingPosition {
    left: number;
    top: number;
}

export const Wolf: React.FC<{ gameStarted: boolean; collectedDucklings: DucklingPosition[] }> = ({ gameStarted, collectedDucklings }) => {
    const [currentPosition, setCurrentPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPosition((prev) => {
                if (collectedDucklings.length === 0) return prev; // No collected ducklings to follow

                // Get the position of the last collected duckling
                const targetDuckling = collectedDucklings[collectedDucklings.length - 1];

                const dx = targetDuckling.left - prev.left;
                const dy = targetDuckling.top - prev.top;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Collision detection: if distance is less than a certain threshold, assume collision
                const collisionThreshold = 30; // Adjust this value based on your game design
                if (distance < collisionThreshold) {
                    return prev; // Stop moving if collision detected
                }

                const speed = 10; // Adjust speed as needed
                const newLeft = prev.left + (dx / distance) * speed;
                const newTop = prev.top + (dy / distance) * speed;

                return { left: newLeft, top: newTop };
            });
        }, 20);

        return () => clearInterval(interval);
    }, [collectedDucklings]);

    return (
        <>
            <div
                className="wolf"
                style={{
                    position: "absolute",
                    left: `${currentPosition.left}px`,
                    top: `${currentPosition.top}px`,
                    transition: "left 0.03s linear, top 0.03s linear",
                }}
            ></div>
        </>
    );
};
