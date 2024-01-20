import React from "react";
import Board from "./Board";
import "./App.css";

/** Simple app that just shows the LightsOut game. */
//potentially could hold game-level state or methods (ex tracking if game is won, and resetting the game)
function App() {
  return (
      <div className="App">
        <Board />
      </div>
  );
}

export default App;
