import React, {useState, useEffect} from "react";

export const GameStart: React.FC = () => {
    const [startGame, setStartGame] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)

    useEffect (() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space' && !startGame) {
                setStartGame(true)
                setCountdown(3)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [startGame])

    useEffect(() => {
        if (countdown === null || countdown === 0)
            return
        const timer = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [countdown])

  return (
    <>
    {!startGame && (
      <div className="start-screen">
        <h1>Duck Collector</h1>
        <h2>Help Mama Duck Collect her Ducklings before the time runs out.</h2> 
        <h3>Watch out for the Wolf!</h3>
        <p>WASD to move, Space to Start</p>
      </div>
      )}

      {startGame && countdown !== null && countdown > 0 && (
        <div className="countdown">
            <h1 key={countdown} className="fade">{countdown}</h1>
        </div>
      )}
    </>
  );
};
