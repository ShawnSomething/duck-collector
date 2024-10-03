import React, { useState, useEffect } from "react";

export const MamaDuck: React.FC<{ 
    collectedDucklings: { left: number; top: number }[],
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    mamaDuckPosition: { x: number; y: number }; 
}> = ({ collectedDucklings, setPosition, mamaDuckPosition }) => {
    const [position, updatePosition] = useState(mamaDuckPosition);
    const speed = 4.5; 
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { key } = event;
            setKeysPressed((prev) => new Set(prev).add(key));
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const { key } = event;
            setKeysPressed((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            let targetPosition = { ...position };

            if (keysPressed.has('w')) targetPosition.y = Math.max(0, position.y - speed);
            if (keysPressed.has('a')) targetPosition.x = Math.max(0, position.x - speed);
            if (keysPressed.has('s')) targetPosition.y = Math.min(window.innerHeight - 50, position.y + speed);
            if (keysPressed.has('d')) targetPosition.x = Math.min(window.innerWidth - 50, position.x + speed);

            updatePosition(targetPosition);
            setPosition(targetPosition); 

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [keysPressed, position, setPosition]);

    return (
        <>
            <div className="mama-duck"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    position: 'absolute',
                }}>
            </div>

            {collectedDucklings.map((_, index) => {
                const angle = (index - (collectedDucklings.length - 1) / 2) * (Math.PI / (collectedDucklings.length + 2));
                const radius = 30; 
                const ducklingX = position.x + radius * Math.cos(angle);
                const ducklingY = position.y + radius * Math.sin(angle);

                return (
                    <div
                        key={index}
                        className="ducklings"
                        style={{
                            position: "absolute",
                            left: `${ducklingX}px`,
                            top: `${ducklingY}px`,
                        }}
                    ></div>
                );
            })}
        </>
    );
};
