import React, { useEffect } from "react";

export const Ducklings: React.FC<{ 
    gameStarted: boolean; 
    setDucklingPositions: React.Dispatch<React.SetStateAction<{ left: number; top: number }[]>>;
    ducklingPositions: { left: number; top: number }[];
}> = ({ gameStarted, setDucklingPositions, ducklingPositions }) => {

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
    }, [gameStarted, setDucklingPositions]);

    return (
        <>
            {ducklingPositions.map((position: { left: number; top: number }, index: number) => (
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
