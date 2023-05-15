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

    insertSquares(list){
        list.forEach(square => {
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
            }else{
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
            let index = this.blackPieces.indexOf(this.getSquare(piece).piece);
            this.blackPieces.splice(index, 1);
        }else{
            let index = this.whitePieces.indexOf(this.getSquare(piece).piece);
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
    
    checkMate(color){
        let a=true;
        if(color==white){
            this.whitePieces.forEach((piece) => {        
                piece.getPossiblePositions();
            if(piece.validMoves.length>0){
                a = false;
            }
            });
        }
        else{
            this.blackPieces.forEach((piece) => {
                piece.getPossiblePositions();
                if(piece.validMoves.length>0){
                    a = false;
                }
            });
            }    
        if(a){
            if(color == white && this.getSquare(this.wKing).isAffectedByBlack || color == black && this.getSquare(this.bKing).isAffectedByWhite){
                console.log("mate");
            }else{
                console.log("afogado");
            }
        }else{
            console.log("notMate");
        }
        return a;
    }

    checkKingThreatened(color){
        this.checkMate(color);
        if(color == white && this.getSquare(this.wKing).isAffectedByBlack){
            this.wKing.threatened = true;
            this.paintKingSquare(this.wKing);
        }else{            
            this.wKing.threatened = false;
            this.paintKingSquare(this.wKing);
        }
        if(color == black && this.getSquare(this.bKing).isAffectedByWhite){
            this.bKing.threatened = true;
            this.paintKingSquare(this.bKing);
        }else{
            this.bKing.threatened = false;
            this.paintKingSquare(this.bKing);
        }
    }

    paintKingSquare(king){
        if(king.threatened){
            this.getSquare(king).value.style.background = "red";
        }else{
            this.getSquare(king).value.style.background = !this.getSquare(king).color?"white":"rgb(88, 83, 83)";
        }
    }

    printKing(){
        console.log(this.bKing);
        console.log(this.wKing);
    }

    print(){
        this.squares.forEach(square => {
            console.log(square);  
        });
        console.log("Peças:");
        console.log(this.blackPieces);
        console.log(this.whitePieces);
    }
};

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
                board.selected = null;
            })
            if(paint){
                div.style.background = "rgb(88, 83, 83)";
                paint=false;   
            }else{
                paint=true;
            }
            let square = new Square(String.fromCharCode(97 + j-1),i,div,!paint);
            board.insertSquares([square]);
            main.appendChild(div);
        }
    }
}
createSquares();
export {board};