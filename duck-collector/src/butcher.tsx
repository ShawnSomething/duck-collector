import React, { useState, useEffect } from "react";

export const Butcher: React.FC<{
    gameStarted: boolean;
    collectedDucklings: { x: number; y: number }[];
    onButcherCollision: () => void;
    mamaDuckPosition: { x: number; y: number };
}> = ({ gameStarted, collectedDucklings, onButcherCollision, mamaDuckPosition }) => {
    const [isButcherVisible, setIsButcherVisible] = useState(false);
    const butcherPosition = { x: window.innerWidth / 2, y: 0 };

    useEffect(() => {
        const showButcher = () => {
            if (collectedDucklings.length >= 10) {
                setIsButcherVisible(true);
            } else if (collectedDucklings.length < 5) {
                setIsButcherVisible(false);
            }
        };
        showButcher();
    }, [collectedDucklings.length]);

    useEffect(() => {
        const detectButcherCollision = () => {
            const distanceX = mamaDuckPosition.x - butcherPosition.x;
            const distanceY = mamaDuckPosition.y - butcherPosition.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance <= 80) {
                onButcherCollision();
            }
        };

        if (isButcherVisible) {
            detectButcherCollision();
        }
    }, [mamaDuckPosition, isButcherVisible, onButcherCollision]);

    return (
        <>
            {isButcherVisible && (
                <div className="butcher" style={{ position: 'absolute', left: butcherPosition.x, top: butcherPosition.y }}>
                </div>
            )}
        </>
    );
};
