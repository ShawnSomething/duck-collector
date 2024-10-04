import React, { useEffect, useState } from 'react';

interface HUDProps {
    collectedCount: number;
}

export const HUD: React.FC<HUDProps> = ({ collectedCount }) => {
    const [timeLeft, setTimeLeft] = useState(300); 

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null; 

        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timer as unknown as NodeJS.Timeout);
        }

        return () => {
            if (timer) {
                clearInterval(timer); 
            }
        }; 
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <div className="hud">
            <div>Ducks Collected: {collectedCount}</div>
            <div className="vertical-line"></div>
            <div>Time Left: {formatTime(timeLeft)}</div> 
        </div>
    );
};
