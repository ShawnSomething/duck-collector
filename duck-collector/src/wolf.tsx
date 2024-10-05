import React, { useState, useEffect } from "react";

export const Wolf: React.FC<{ gameStarted: boolean; wolfPosition: { left: number; top: number } }> = ({ gameStarted, wolfPosition }) => {
    const [currentPosition, setCurrentPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPosition((prev) => {
                const dx = wolfPosition.left - prev.left;
                const dy = wolfPosition.top - prev.top;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 1) {
                    return prev;
                }

                const speed = 10; 
                const newLeft = prev.left + (dx / distance) * speed;
                const newTop = prev.top + (dy / distance) * speed;

                return { left: newLeft, top: newTop };
            });
        }, 30);

        return () => clearInterval(interval); 
    }, [wolfPosition]);

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
