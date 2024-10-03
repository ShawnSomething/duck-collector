import React, {useState} from 'react';
import './App.css';
import { GameBoard } from './game-board';
import { GameStart } from './game-start';
import { MamaDuck } from './mama-duck';

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <>
      <div>
        <GameBoard />
        
        {!gameStarted && <GameStart onStart={() => setGameStarted(true)} />}
        
        {gameStarted && <MamaDuck />}
      </div>
    </>
  );
}

export default App;
