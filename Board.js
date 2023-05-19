import { Square } from "./Square.js";
import { screen } from "./endGameScreen.js";
const main = document.querySelector("main");

const white = "w";
const black = "b";

class Board{
    constructor(){
        this.squares = [
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null]
        ];
        this.selected = null;
        this.wKing;
        this.bKing;
        this.turn = true;
        this.blackPieces = [];
        this.whitePieces = [];
    }

    getSquare(piece){
        return this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1];
    }

    getSquareWithCoordinates(x,y){
        return this.squares[x-97][y-1];
    }

    getTurn(){
        return this.turn;
    }

    setTurn(turn){
        this.turn = turn;
    }
    
    insertSquares(list){
        list.forEach((square) => {
            this.squares[square.getPosX().charCodeAt(0)-97][square.getPosY()-1] = square;
        });
    }

    insertPieces(list){
        list.forEach(piece => {
            if(piece.team == "b"){
                this.blackPieces.push(piece);
                if(piece.name=="King"){
                    this.bKing = piece;
                }
            }
            else{
                this.whitePieces.push(piece);
                if(piece.name=="King"){
                    this.wKing = piece;
                }
            }
            this.getSquare(piece).piece = piece;
        });
    }

    removePiecesOfBoard(piece){
        this.getSquare(piece).piece = null;
        if(this.getSquare(piece).value.firstChild!=null){
            this.getSquare(piece).value.firstChild.remove();
        }
    }

    removePiecesOfList(piece){
        if(piece.team == black){
            let index = this.blackPieces.indexOf(piece);
            this.blackPieces.splice(index, 1);
        }else{
            let index = this.whitePieces.indexOf(piece);
            this.whitePieces.splice(index, 1);
        }
    }

    clearMoves(){
        this.whitePieces.forEach((piece) => {
            piece.possibleMoves = [];
        });
        this.blackPieces.forEach((piece) => {
            piece.possibleMoves = [];
        });
    }

    clearAffected(){
        this.squares.forEach(line => {
            line.forEach(square => {
                square.isAffectedByBlack = false;
                square.isAffectedByWhite = false;
            });
        });
    }

    resetEnPassant(team){
        if(team == white){
            this.whitePieces.forEach((piece) => {
                if(piece.name=="Pawn"){
                    piece.lEnPassant = false;
                    piece.rEnPassant = false;
                }
            });
        }else{
            this.blackPieces.forEach((piece) => {
                if(piece.name=="Pawn"){
                    piece.lEnPassant = false;
                    piece.rEnPassant = false;
                }
            });
        }
    }

    setAffected(){
        this.clearMoves();
        this.clearAffected();
        this.blackPieces.forEach((piece) => {
            piece.setPossiblePositions();
        });
        this.whitePieces.forEach((piece) => {
            piece.setPossiblePositions();
        });
        this.wKing.threatened = this.getSquare(this.wKing).isAffectedByBlack;
        this.bKing.threatened = this.getSquare(this.bKing).isAffectedByWhite;
    }
    
    checkMoves(color){
        for(let i=0;i<8;i++){
            for(let j = 0; j<8;j++){
                let square = this.squares[i][j];
                if(square.piece != null && square.piece.team==color){
                    square.piece.getPossiblePositions();
                    if(square.piece.validMoves.length>0){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    checkMate(color){
        if(this.checkMoves(color)){
            if(color == white && this.getSquare(this.wKing).isAffectedByBlack || color == black && this.getSquare(this.bKing).isAffectedByWhite){
                screen.setWinner(true,color=="b"?"WHITE":"BLACK");
            }else{
                screen.setWinner(true,"tie");
            }
        }
    }

    checkKingThreatened(color){
        if(color == white && this.getSquare(this.wKing).isAffectedByBlack){
            this.wKing.threatened = true;
        }
        else{
            this.wKing.threatened = false;
        }
        this.paintKingSquare(this.wKing);
        if(color == black && this.getSquare(this.bKing).isAffectedByWhite){
            this.bKing.threatened = true;
        }
        else{
            this.bKing.threatened = false;
        }
        this.paintKingSquare(this.bKing);
        this.checkMate(color);
    }

    paintKingSquare(king){
        if(king.threatened){
            this.getSquare(king).value.style.background = "red";
        }
        else{
            this.getSquare(king).value.style.background = !this.getSquare(king).color?"white":"rgb(88, 83, 83)";
        }
    }

    createSquares(){
        var paint;
        for(var i=8; i>=1;i--){
            paint=i%2;
            for(var j=1; j<=8;j++){
                let squareValue = document.createElement("div");
                squareValue.setAttribute("id",`${String.fromCharCode(97 + j-1)}${i}`);
                squareValue.addEventListener("click",(e) => {
                    if (e.target == e.currentTarget){
                    document.querySelectorAll(".circulo").forEach(element => element.remove());
                    this.selected = null;   
                    }
                })
                if(paint){
                    squareValue.style.background = "rgb(88, 83, 83)";
                }
                paint = !paint;
                let square = new Square(String.fromCharCode(97 + j-1),i,squareValue,!paint);
                this.insertSquares([square]);
                main.appendChild(squareValue);
            }
        }
    }

    startGame(){
        this.setAffected();
        this.checkKingThreatened(white);
        this.checkKingThreatened(black);
    }

};
let board = new Board();
board.createSquares();
export {board};