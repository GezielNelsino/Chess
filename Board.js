import { Square } from "./Square.js";
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
        this.blackPieces = [];
        this.whitePieces = [];

    }

    insertSquares(list){
        list.forEach(square => {
            this.squares[square.getPosX().charCodeAt(0)-97][square.getPosY()-1] = square;
        });
    }

    insertPieces(list){
        list.forEach(piece => {
            if(piece.team == "b"){
                this.blackPieces.push(piece);
            }else{
                this.whitePieces.push(piece);
            }
            this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1].piece = piece;
        });
    }

    removePiecesOfBoard(piece){
        this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1].piece = null;
        this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1].value.firstChild.remove();
    }

    removePiecesOfList(piece){
        if(piece.team == black){
            let index = this.blackPieces.indexOf(this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1].piece);
            this.blackPieces.splice(index, 1);
        }else{
            let index = this.whitePieces.indexOf(this.squares[piece.getPosX().charCodeAt(0)-97][piece.getPosY()-1].piece);
            this.whitePieces.splice(index, 1);
        }
    }
    clearAffected(){
        this.squares.forEach(line => {
            line.forEach(square => {
                square.isAffectedByBlack = false;
                square.isAffectedByWhite = false;
            });
        });
    }

    setAffected(){
        this.clearAffected();
        this.blackPieces.forEach((piece) => {
            piece.getPossiblePositions(false);
        });
        this.whitePieces.forEach((piece) => {
            piece.getPossiblePositions(false);
        });
    }

};

let selected = null;
let board = new Board();

const main = document.querySelector("main");
function createSquares(){
    var paint;
    for(var i=8; i>=1;i--){
        paint=i%2;
        for(var j=1; j<=8;j++){
            let div = document.createElement("div");
            div.setAttribute("id",`${String.fromCharCode(97 + j-1)}${i}`);
            div.addEventListener("click",(e) => {
                if (e.target !== e.currentTarget)
                    return;
                document.querySelectorAll(".circulo").forEach(element => element.remove());
                selected = null;
            })
            if(paint){
                div.style.background = "rgb(88, 83, 83)";
                paint=false;   
            }else{
                paint=true;
            }
            let square = new Square(String.fromCharCode(97 + j-1),i,div);
            board.insertSquares([square]);
            main.appendChild(div);
        }
    }
}
createSquares();
export {board};