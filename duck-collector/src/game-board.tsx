import React, { useState, useEffect } from "react";

const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const GameBoard: React.FC = () => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = debounce(() => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }, 100); 

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="game-board" style={{ width: dimensions.width, height: dimensions.height }}>
        </div>
    );
};
