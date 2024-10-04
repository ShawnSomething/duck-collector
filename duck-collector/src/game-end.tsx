import React, { useEffect } from "react";

interface GameEndProps {
    totalScore: number;
    onReset: () => void;
}

export const GameEnd: React.FC<GameEndProps> = ({ totalScore, onReset }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                onReset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onReset]);

    return (
        <header>
            <h1>Game Over</h1>
            <p>Total Ducks Collected: {totalScore}</p>
            <p>Press Space to Restart</p>
        </header>
    );
};
