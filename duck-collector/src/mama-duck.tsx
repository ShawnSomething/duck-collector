import React, { useState, useEffect } from "react";

export const MamaDuck: React.FC = () => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const speed = 10;

      if (key === "w") {
        setPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - speed) }));
      } else if (key === "a") {
        setPosition((prev) => ({ ...prev, x: Math.max(0, prev.x - speed) }));
      } else if (key === "s") {
        setPosition((prev) => ({
          ...prev,
          y: Math.min(window.innerHeight - 50, prev.y + speed),
        }));
      } else if (key === "d") {
        setPosition((prev) => ({
          ...prev,
          x: Math.min(window.innerWidth - 50, prev.x + speed),
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div
        className="mama-duck"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: "absolute",
        }}
      ></div>
    </>
  );
};
