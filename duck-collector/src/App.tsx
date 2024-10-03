import React from 'react';
import './App.css';
import { GameBoard } from './game-board';
import { GameStart } from './game-start';

function App() {
  return (
    <>
      <div>
        <GameBoard />
      </div>
      <div>
      <GameStart />
      </div>
    </>
  );
}

export default App;
