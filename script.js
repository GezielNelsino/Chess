import { board } from "./Board.js";
import { King, Queen,Rook,Bishop,Horse, Pawn } from "./Piece.js";

const white = "w";
const black = "b";

function startGame(){
    let Wking = new King("e",1,white);
    let Bking = new King("e",8,black);
    let Wqueen = new Queen("d",1,white);
    let Bqueen = new Queen("d",8,black);

    let WLbishop = new Bishop("c",1,white);
    let WRbishop = new Bishop("f",1,white);
    let BLbishop = new Bishop("c",8,black);
    let BRbishop = new Bishop("f",8,black);

    let WLhorse = new Horse("b",1,white);
    let WRhorse = new Horse("g",1,white);
    let BLhorse = new Horse("b",8,black);
    let BRhorse = new Horse("g",8,black);

    let WLrook = new Rook("a",1,white);
    let WRrook = new Rook("h",1,white);
    let BLrook = new Rook("a",8,black);
    let BRrook = new Rook("h",8,black);
    for(var i=0; i<8;i++){
        let Wpawn = new Pawn(`${String.fromCharCode(97+i)}`,2,white);
        let Bpawn = new Pawn(`${String.fromCharCode(97+i)}`,7,black);
        board.insertPieces([Wpawn,Bpawn]);
    }
    board.insertPieces([Wking,Bking]);
    board.insertPieces([Wqueen,Bqueen]);
    board.insertPieces([WLbishop,WRbishop,BLbishop,BRbishop]);
    board.insertPieces([WLhorse,WRhorse,BLhorse,BRhorse]);
    board.insertPieces([WLrook,WRrook,BLrook,BRrook]);
}
function train(){
    let Wking = new King("e",1,white);
    let Bking = new King("e",8,black);
    let Wqueen = new Queen("d",1,white);
    let Bqueen = new Queen("d",8,black);

    let WLbishop = new Bishop("c",1,white);
    let WRbishop = new Bishop("f",1,white);
    let BLbishop = new Bishop("c",8,black);
    let BRbishop = new Bishop("f",8,black);

    let WLhorse = new Horse("b",1,white);
    let WRhorse = new Horse("g",1,white);
    let BLhorse = new Horse("b",8,black);
    let BRhorse = new Horse("g",8,black);

    let WLrook = new Rook("a",1,white);
    let WRrook = new Rook("h",1,white);
    let BLrook = new Rook("a",8,black);
    let BRrook = new Rook("h",8,black);
    board.insertPieces([Wking,Bking]);
    board.insertPieces([Wqueen,Bqueen]);
    board.insertPieces([WLbishop,WRbishop,BLbishop,BRbishop]);
    board.insertPieces([WLhorse,WRhorse,BLhorse,BRhorse]);
    board.insertPieces([WLrook,WRrook,BLrook,BRrook]);
}
//train();
startGame();