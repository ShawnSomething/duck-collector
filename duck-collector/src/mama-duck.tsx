import React, { useState, useEffect } from "react";

export const MamaDuck: React.FC<{ 
    collectedDucklings: { left: number; top: number }[],
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    mamaDuckPosition: { x: number; y: number }; 
}> = ({ collectedDucklings, setPosition, mamaDuckPosition }) => {
    const [position, updatePosition] = useState(mamaDuckPosition);
    const [history, setHistory] = useState<{ x: number; y: number }[]>([]); 
    const speed = 4.5; 
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
    const [rotation, setRotation] = useState(0);
    const maxHistoryLength = collectedDucklings.length * 14; 

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
            let directionX = 0;
            let directionY = 0;

            if (keysPressed.has('w')) {
                targetPosition.y = Math.max(0, position.y - speed);
                directionY -= 1;
            }
            if (keysPressed.has('a')) {
                targetPosition.x = Math.max(0, position.x - speed);
                directionX -= 1;
            }
            if (keysPressed.has('s')) {
                targetPosition.y = Math.min(window.innerHeight - 50, position.y + speed);
                directionY += 1;
            }
            if (keysPressed.has('d')) {
                targetPosition.x = Math.min(window.innerWidth - 50, position.x + speed);
                directionX += 1;
            }

            if (directionX !== 0 || directionY !== 0) {
                const angle = Math.atan2(directionY, directionX);
                const degrees = angle * (180 / Math.PI);
                setRotation(degrees + 90); 
            }

       
            updatePosition(targetPosition);
            setPosition(targetPosition);
            setHistory((prevHistory) => {
                const updatedHistory = [...prevHistory, targetPosition];
                if (updatedHistory.length > maxHistoryLength) {
                    updatedHistory.shift(); 
                }
                return updatedHistory;
            });

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [keysPressed, position, setPosition, maxHistoryLength]);

    return (
        <>
            <div className="mama-duck"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    position: 'absolute',
                    transform: `rotate(${rotation}deg)` 
                }}>
            </div>

            {collectedDucklings.map((_, index) => {
                const historyIndex = Math.max(0, history.length - (index + 2.5) * 4);
                const ducklingPosition = history[historyIndex] || position;
                const angleOffset = (index / collectedDucklings.length) * Math.PI / 2;
                const distanceFromMama = 45 + (index % 3) * 5; 
          
                const ducklingX = ducklingPosition.x - distanceFromMama * Math.cos(rotation * (Math.PI / 260)) + distanceFromMama * Math.cos(angleOffset);
                const ducklingY = ducklingPosition.y - distanceFromMama * Math.sin(rotation * (Math.PI / 300)) + distanceFromMama * Math.sin(angleOffset);

                return (
                    <div
                        key={index}
                        className="ducklings"
                        style={{
                            position: "absolute",
                            left: `${ducklingX}px`,
                            top: `${ducklingY}px`,
                            transform: `rotate(${rotation}deg)`,
                        }}
                    ></div>
                );
            })}
        </>
    );
};
