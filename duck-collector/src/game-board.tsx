import React, { useState, useEffect } from "react";

export const GameBoard: React.FC = () => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight})

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <div className="game-board">
            </div>
        </>
    )
}