import React, { useState, useEffect } from "react";

export const Ducklings: React.FC<{ gameStarted: boolean }> = ({ gameStarted }) => {
    const [ducklingPositions, setDucklingPositions] = useState<{ left: number; top: number }[]>([]);

    const spawnDuckling = () => {
        const ducklingWidth = 20;
        const ducklingHeight = 20;

        const boardWidth = window.innerWidth;
        const boardHeight = window.innerHeight;

        const randomLeft = Math.random() * (boardWidth - ducklingWidth);
        const randomTop = Math.random() * (boardHeight - ducklingHeight);

        setDucklingPositions((prev) => [
            ...prev,
            { left: randomLeft, top: randomTop },
        ]);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (gameStarted) {
            spawnDuckling();
            interval = setInterval(spawnDuckling, 2000); 
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [gameStarted]);

    return (
        <>
            {ducklingPositions.map((position, index) => (
                <div
                    key={index}
                    className="ducklings"
                    style={{
                        position: "absolute",
                        left: `${position.left}px`,
                        top: `${position.top}px`,
                    }}
                ></div>
            ))}
        </>
    );
};
