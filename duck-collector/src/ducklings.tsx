import React, { useEffect } from "react";

export const Ducklings: React.FC<{ 
    gameStarted: boolean; 
    setDucklingPositions: React.Dispatch<React.SetStateAction<{ left: number; top: number }[]>>;
    ducklingPositions: { left: number; top: number }[];
    onCollision: (ducklingIndex: number) => void;
    mamaDuckPosition: { x: number; y: number };
}> = ({ gameStarted, setDucklingPositions, ducklingPositions, onCollision, mamaDuckPosition }) => {

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
            interval = setInterval(spawnDuckling, 3500); 
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [gameStarted, setDucklingPositions]);

    const detectCollision = (duckling: { left: number; top: number }, ducklingIndex: number) => {
        const proximity = 50; 

        const distance = Math.sqrt(
            Math.pow(mamaDuckPosition.x - duckling.left, 2) + 
            Math.pow(mamaDuckPosition.y - duckling.top, 2)
        );

        if (distance < proximity) {
            console.log(`Collision with duckling ${ducklingIndex}`);
            onCollision(ducklingIndex);
        }
    };

    useEffect(() => {
        ducklingPositions.forEach((position, index) => detectCollision(position, index));
    }, [ducklingPositions, mamaDuckPosition]); 
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
