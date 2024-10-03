import React, { useState, useEffect } from "react";

export const MamaDuck: React.FC<{ 
    collectedDucklings: { left: number; top: number }[],
    setPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>,
    mamaDuckPosition: { x: number; y: number };
}> = ({ collectedDucklings, setPosition, mamaDuckPosition }) => {
    const [position, updatePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { key } = event;
            const speed = 10;

            updatePosition((prev) => {
                let newPosition = { ...prev };
                if (key === 'w') newPosition = { ...prev, y: Math.max(0, prev.y - speed) };
                else if (key === 'a') newPosition = { ...prev, x: Math.max(0, prev.x - speed) };
                else if (key === 's') newPosition = { ...prev, y: Math.min(window.innerHeight - 50, prev.y + speed) };
                else if (key === 'd') newPosition = { ...prev, x: Math.min(window.innerWidth - 50, prev.x + speed) };
                return newPosition;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        setPosition(position);
    }, [position, setPosition]);

    return (
        <>
            <div className="mama-duck"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: 'absolute',
            }}>
            </div>

            {collectedDucklings.map((duckling, index) => (
                <div
                    key={index}
                    className="ducklings"
                    style={{
                        position: "absolute",
                        left: `${position.x - 30 * (index + 1)}px`,
                        top: `${position.y}px`,
                    }}
                ></div>
            ))}
        </>
    );
};
