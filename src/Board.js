import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

//DEFAULT GAME SET UP: SET PARAMETERTO 5
function Board({ nrows=5, ncols=5, chanceLightStartsOn= 0.25 }) {
  const [board, setBoard] = useState(createBoard());//THIS STATE HODLS THE LOGICAL REPRESENTATION OF THE GAME BOARD


  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {//this IS CALLED WHEN BOARD COMPONENT IS MOUNTED TO THE DOM WITH STATE
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    for (let y=0; y < nrows; y++){
      let row = [];
      for  (let x=0; x < ncols; x++){
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }
  // function createBoard() {
  //   return Array.from({ length: nrows }, () => 
  //     Array.from({ length: ncols }, () => Math.random() < chanceLightStartsOn)
  //   );
  // }


  // TODO: check the board in state to determine whether the player has won. - CHECKS OF CELL IS TURNED OFF. 
  function hasWon() {
    return board.every(row => row.every(cell => !cell));//EVERY TEST WHETHER ALL ELEMENTS IN AN ARRAY PASS THE TEST IMPLEMENTED BY THE FUNCTION AND RETURNS TRUE IF SO, OTHERWISE FALSE.
    //1ST .EVERY CALL IS APPLIED TO BOARD, ITERATING THROUGH EACH ROW. 2ND CALL IS TO EACH INDIVIDUAL ROW (EACH CELL WITHIN IT) AND EACH CELL IS IS A BOOLEAN VALUE REPRESENDING WHETHER THE LIGHT IS ON OR OFF
  }


//DEFINES HOW THE CELLS(LIGHTS) ON BOARD CHANGE THEIR STATES WHEN A CELL IS CLICKED
  function flipCellsAround(coord) {//COORD IS STRING (IN THE FORMAT 'Y(ROW INDEX)-X(COLUMN INDEX OF CALL) REPRESENDING THE COORDINATES OF THE CELL THAT WAS CLICKED
    setBoard(oldBoard => {//map(number) converts string to numbers
      const [y, x] = coord.split("-").map(Number);//SPLIT STRING INTO TWO PARTS WITH - RESULTING IN AN ARRAY OF TWO STRINGS: Y ROW INDEX, AND X COLUMN INDEX

// TODO: Make a (deep) copy of the oldBoard BC WE SHOULD NEVER MUTATE THE STATE DIRECTLY!!!
      const boardCopy = oldBoard.map(row => [...row]);//CREATE SHALLOW COPY TO REPRESENT THE CURRENT STATE OF THE GAME BOARD

      const flipCell = (y, x) => {
// if this coord is actually on board, flip it= TOGGLES THE STATE OF THE CELL, FIRST CHECKING IF THE CELL COORDINATES ARE VALID- THIS IS IMPORT TO ENSURE THAT THE FUNCTION DOESN'T TRY TO ACCESS CELLS OUTSIDE OF THE BOUNDS OF THE BOARD. 
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];//THIS CHANGED THE STATE TO OFF IF ON(TRUE) AND ON IF OFF(FALSE)
        }
      };

      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x); // Flip initial cell
      flipCell(y, x - 1); // Flip left
      flipCell(y, x + 1); // Flip right
      flipCell(y - 1, x); // Flip above
      flipCell(y + 1, x); // Flip below

      // TODO: return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  // TODO
  if (hasWon()) {
    return <div className="Winner">You Won!</div>;
  }

  // make table board: THIS CREATES AN ARRAY OF <tr>: THE REASON FOR THIS IS TO HAVE ANTOHER LAYER OF ARRAYS TO SEPERATE THE GAMES LOGIC FROM IT'S PRESENTATION!!!!!
    let tableBoard = [];// THIS VARIABLE HOLDS THE JSX ELEMENTS THAT CREATE THE VISUAL REPRESENTATION OF THE GAME BOARD IN THE DOM.
    //This separation of concerns makes it easier to manage the game's state and UI independently. The board state is purely for the game's logic, and tableBoard is a transformation of that state into a visual format that can be rendered by React
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}// the KEY PROP IS GIVEN TO EACH CELL AND TR TO HELP REACT IDENTIFY WHICH ITEMS HAVE CHANGED, ARE ADDED OR REMOVED
            isLit={board[y][x]}// THIS PROP FOR EACH CELL IS DERIVED FROM THE CURRENT STATE OF THE BOARD WHICH DETERMINES APPEARANCE OF CELL (LIT OR UNLIT)
            flipCellsAroundMe={() => flipCellsAround(coord)}
          />
        );
      }
      tableBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <table className="Board">
        <tbody>{tableBoard}</tbody>
      </table>
    );
}

export default Board;
