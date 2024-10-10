import React, {useState, useEffect} from "react";

export const Butcher: React.FC<{gameStarted:boolean; collectedDucklings: { x: number; y: number}[]; }> = ({gameStarted, collectedDucklings}) => {
    const [isButcherVisible, setIsButcherVisible] = useState (false)

    useEffect (() => {
        const showButcher = () => {
            if(collectedDucklings.length >= 10){
                setIsButcherVisible(true)
            } else if(collectedDucklings.length <= 5) {
                setIsButcherVisible(false)
            }
        } 
        showButcher()
    }, [collectedDucklings.length])

    return (
        <>
            {isButcherVisible && (
                <div className="butcher">
                </div>
            )}
        </>
    );
};