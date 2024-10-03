import React, { useState } from "react";
import "./App.css";
import { GameBoard } from "./game-board";
import { GameStart } from "./game-start";
import { MamaDuck } from "./mama-duck";
import { Ducklings } from "./ducklings";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <>
      <div>
        <GameBoard />

        {!gameStarted && <GameStart onStart={() => setGameStarted(true)} />}

        {gameStarted && (
          <>
            <MamaDuck />
            <Ducklings gameStarted={gameStarted} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
