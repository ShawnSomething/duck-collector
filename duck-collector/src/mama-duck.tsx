import React, { useState, useEffect } from "react";

export const MamaDuck: React.FC<{ 
    collectedDucklings: { left: number; top: number }[],
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    mamaDuckPosition: { x: number; y: number }; // Pass Mama Duck's position
}> = ({ collectedDucklings, setPosition, mamaDuckPosition }) => {
    const [position, updatePosition] = useState(mamaDuckPosition);
    const speed = 4.5; // Control the speed of movement

    // Store currently pressed keys
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

    // State for rotation angle
    const [rotation, setRotation] = useState(0);

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

            // Update targetPosition based on the keys currently pressed
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

            // Update rotation if there is any movement
            if (directionX !== 0 || directionY !== 0) {
                // Calculate rotation angle in radians
                const angle = Math.atan2(directionY, directionX);
                // Convert to degrees
                const degrees = angle * (180 / Math.PI);
                setRotation(degrees + 90); // Adjusting angle for CSS rotation
            }

            // Update the position
            updatePosition(targetPosition);
            setPosition(targetPosition); // Update the parent with the new position

            requestAnimationFrame(animate);
        };

        // Start the animation loop
        requestAnimationFrame(animate);
    }, [keysPressed, position, setPosition]);

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
