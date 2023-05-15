import { board } from "./Board.js";

var images = [
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/45px-Chess_klt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/45px-Chess_kdt45.svg.png"],
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/45px-Chess_qlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/45px-Chess_qdt45.svg.png"],
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/45px-Chess_rlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/45px-Chess_rdt45.svg.png"],
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/45px-Chess_blt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/45px-Chess_bdt45.svg.png"],
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/45px-Chess_nlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/45px-Chess_ndt45.svg.png"],
    ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/45px-Chess_plt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/45px-Chess_pdt45.svg.png"]
];

const white = "w";
const black = "b";

function nameToNumber(name){
    switch (name){
        case "King":
            return 0;
        case "Queen":
            return 1;
        case "Rook":
            return 2;
        case "Bishop":
            return 3;
        case "Horse":
            return 4;
        case "Pawn":
            return 5;
    }
}

function checkPosition(a,b){
    if(a>=97 && a<= 104 && b >= 1 && b <= 8){
        return board.getSquareWithCoordinates(a,b);
    }
    else{
        return null;
    }
}

function createCircle(square){
    let circle = document.createElement("div");
    circle.setAttribute("class","circulo");
    circle.setAttribute("x",square.getPosX());
    circle.setAttribute("y",square.getPosY());
    circle.addEventListener("click",() => {
        board.selected.move(square.getPosX(),square.getPosY());
        board.selected=null;
     });
    return circle;
}

class Piece {
    constructor(posX,posY,team,name,isLimited){
        this.posX = posX;
        this.posY = posY;      
        this.team = team;
        this.name = name;
        this.isLimited=isLimited;
        this.value = document.createElement("img");
        this.value.setAttribute("team",this.team);
        this.value.src = `${(this.team == "w"?images[nameToNumber(this.name)][0]:images[nameToNumber(this.name)][1])}`;
        this.possibleMoves = [];
        this.validMoves = [];
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
    }

    setPosition(){
        document.querySelector(`#${this.posX}${this.posY}`).appendChild(this.value);
    }

    propagation(i,j,ip,jp){
        while(checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp)!=null){
            let square = checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp);
            let valid;
            if(this.name == "King"){
                if((square.piece==null || square.piece.team != this.team) && (this.team==white && !board.squares[this.posX.charCodeAt(0)+ip-97][this.posY+jp-1].isAffectedByBlack 
                || this.team==black && !board.squares[this.posX.charCodeAt(0)+ip-97][this.posY+jp-1].isAffectedByWhite)){
                    valid = true;
                    this.possibleMoves.push(square);
                }
            }else{
                valid = true;
                this.possibleMoves.push(square);
            }
            if(ip!=0 || jp!=0){
                if(this.team==white){
                    board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).isAffectedByWhite = true;
                }else{
                    board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).isAffectedByBlack = true;
                }  
            }
            if(valid && square.piece!=null){
                if(square.value.firstElementChild != null &&this.team != square.value.firstElementChild.getAttribute("team")){
                    if(board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).piece.name=="King"){
                        ip+=i;
                        jp+=j;
                        continue;
                    }
                }else{
                    this.possibleMoves.pop();
                }
                break;
            }     
            if(this.isLimited){
                break;
            }
            ip+=i;
            jp+=j;
        }
    }

    move(x,y){
        board.removePiecesOfBoard(board.selected);
        this.posX = x;
        this.posY = parseInt(y);
        document.querySelectorAll(".circulo").forEach(element => element.remove());
        if(document.querySelector(`#${this.posX}${this.posY}`).firstChild){
            board.removePiecesOfList(board.getSquare(board.selected).piece);
            document.querySelector(`#${this.posX}${this.posY}`).firstChild.remove();
        }
        board.getSquare(board.selected).piece = board.selected;
        this.setPosition(); 
        board.turn = !board.turn;
        board.setAffected();  
        board.checkKingThreatened(board.selected.team==white?black:white);
    }

    drawPossiblePositions(){        
        this.validMoves = [];
        this.possibleMoves.forEach(square => {
            if(this.checkValidMove(square.getPosX(),square.getPosY())){
            let circle = createCircle(square);
            this.validMoves.push(square);    
            if(square.piece != null && (square.isAffectedByWhite || square.isAffectedByBlack) && square.piece.team != this.team){
                    circle.setAttribute("id","upper");
                }
                board.squares[square.getPosX().charCodeAt(0)-97][square.getPosY()-1].value.appendChild(circle);
            }                
        });
    }

    getPossiblePositions(){
        this.validMoves = [];
        this.possibleMoves.forEach(square => {
            if(this.checkValidMove(square.getPosX(),square.getPosY())){
                this.validMoves.push(square);
            }
        });
    }

    checkValidMove(x,y){       
        board.removePiecesOfList(board.getSquare(this).piece);
        board.removePiecesOfBoard(board.getSquare(this).piece);
        let a = this.posX;
        let b = this.posY;
        let piece = null;
        this.posX = x;
        this.posY = parseInt(y);
        if(document.querySelector(`#${this.posX}${this.posY}`).firstChild){
            piece = board.squares[this.getPosX().charCodeAt(0)-97][this.getPosY()-1].piece;
            board.removePiecesOfList(board.getSquare(piece).piece);
            board.removePiecesOfBoard(board.getSquare(piece).piece);
        }
        board.getSquare(this).piece = this;
        board.setAffected();
        let valid = !((this.team==white)?board.wKing.threatened:board.bKing.threatened);  
        board.removePiecesOfBoard(board.getSquare(this).piece);  
        this.posX = a;
        this.posY = b;
        board.getSquare(this).piece = this;
        board.insertPieces([this]);
        if(piece !=null){
            board.insertPieces([piece]);
            piece.setPosition();
        }
        this.setPosition();
        board.setAffected();  
        return valid;
    }

    setEvents(){
        this.value.addEventListener("click",() =>{
            if(board.turn && this.team==white || !board.turn && this.team==black){
                if(board.selected == null){
                    board.selected = this;
                    this.possibleMoves = [];
                    this.setPossiblePositions();               
                    this.drawPossiblePositions();               
                }else if(board.selected != this){
                    document.querySelectorAll(".circulo").forEach(element => element.remove());
                    board.selected = this;
                    this.possibleMoves = [];
                    this.setPossiblePositions();               
                    this.drawPossiblePositions();               
                }else{
                    document.querySelectorAll(".circulo").forEach(element => element.remove());
                    board.selected = null;
                }
            }            
        });
        this.setPosition();
    }
}

class King extends Piece {
    constructor(posX,posY,team) {
        super(posX, posY,team,"King",true);
        this.threatened = false;
        this.setEvents();
    }
    move(i,j,actualBoard){
        if(this.threatened){
            this.threatened = false;
        }
        board.paintKingSquare(this);
        super.move(i,j,actualBoard);
    }
    setPossiblePositions(){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                this.propagation(i,j,ip,jp);    
            }                
        }
    }
}

class Queen extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Queen",false);
        this.setEvents();
    }
    setPossiblePositions(){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                this.propagation(i,j,ip,jp);    
            }                
        }
    }
}

class Rook extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Rook",false);
        this.setEvents();
    }
    setPossiblePositions(){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                if((i==0 || j==0)){
                    this.propagation(i,j,ip,jp);
                }
            }                
        }
    }
}

class Bishop extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Bishop",false);
        this.setEvents();
    }
    setPossiblePositions(){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                if(i!=0 && j!=0){
                    this.propagation(i,j,ip,jp);
                }
            }                
        }
    }
}

class Horse extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Horse",true);
        this.isLimited = true;
        this.setEvents();
    }
    setPossiblePositions(){
        for(let i=-2;i<=2;i++){
            for(let j=-2;j<=2;j++){
                let ip = i;
                let jp = j;
                if((i!=0 && j!=0) && (i!=j) && (i!=-j) && (!(i%2) || !(j%2))){
                    this.propagation(i,j,ip,jp);
                }
            }                
        }
    }
}

class Pawn extends Piece {
    constructor(posX, posY, team) {
        super(posX,posY,team,"Pawn",true);
        this.isFirstMove = true;
        this.setEvents();
    }
    move(i,j,ip,jp){
        super.move(i,j,ip,jp);
        this.isFirstMove = false;
        if(this.getPosY() == 8 || this.getPosY() == 1){
            this.promote();
        }
    }

    promote(){        
        board.removePiecesOfList(board.selected);
        board.removePiecesOfBoard(board.selected);
        let Pqueen = new Queen(this.getPosX(),this.getPosY(),this.team);
        board.insertPieces([Pqueen]);
        board.setAffected();   
        board.checkKingThreatened(board.selected.team==white?black:white);
    }

    propagation(i,j,k){
        let square = checkPosition(this.posX.charCodeAt(0)+i,this.posY+j);
        if((i==-1 || i==1) && square!=null){                    
            if(square.piece!=null && (this.team != square.piece.team)){
                this.possibleMoves.push(square);
            }
            if(this.team==white){
                board.getSquareWithCoordinates(this.posX.charCodeAt(0)+i,this.posY+j).isAffectedByWhite = true;
            }
            else{
                board.getSquareWithCoordinates(this.posX.charCodeAt(0)+i,this.posY+j).isAffectedByBlack = true;
            } 
        }
        else{
            if(square!=null && square.piece == null){
                this.possibleMoves.push(square);
                if(this.isFirstMove && k==0){
                    this.propagation(i,j+j,1);
                }
            }
        } 
    }

    setPossiblePositions(){
        let j = -1;
        for(let i=-1;i<=1;i++){
            this.propagation(i,j + 2*(this.team == white),0);         
        }
    }
}

export {King,Queen,Rook,Bishop,Horse, Pawn};