import React, { useState, useEffect } from "react";

export const Ducklings: React.FC<{ gameStarted: boolean }> = ({
  gameStarted,
}) => {
  const [ducklingPosition, setDucklingPosition] = useState<{
    left: Number;
    top: number;
  } | null>(null);

  const spawnDuckling = () => {
    const ducklingWidth = 20;
    const ducklingHeight = 20;

    const boardWidth = window.innerWidth;
    const boardHeight = window.innerHeight;

    const randomLeft = Math.random() * (boardWidth - ducklingWidth);
    const randomTop = Math.random() * (boardHeight - ducklingHeight);

    setDucklingPosition({ left: randomLeft, top: randomTop });
  };

  useEffect(() => {
    if (gameStarted) {
      spawnDuckling();
    }
  }, [gameStarted]);

  return (
    <>
      {ducklingPosition && (
        <div
          className="ducklings"
          style={{
            position: "absolute",
            left: `${ducklingPosition.left}px`,
            top: `${ducklingPosition.top}px`,
          }}
        ></div>
      )}
    </>
  );
};
