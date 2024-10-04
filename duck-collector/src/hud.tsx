import React, { useEffect, useState } from 'react';

interface HUDProps {
    collectedCount: number;
    timeLeft: number; 
}

export const HUD: React.FC<HUDProps> = ({ collectedCount, timeLeft }) => {
    return (
        <div className="hud">
            <div>Ducks Collected: {collectedCount}</div>
            <div className="vertical-line"></div> 
            <div>Time Left: {timeLeft}s</div> 
        </div>
    );
};
