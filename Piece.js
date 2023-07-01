import { board } from "./Board.js";

const white = "w";
const black = "b";

function checkPosition(a,b){
    if(a>=97 && a<= 104 && b >= 1 && b <= 8){
        return board.getSquareWithCoordinates(a,b);
    }
    return null;
}

function createCircle(square){
    let circle = document.createElement("div");
    circle.setAttribute("class","circulo");
    circle.setAttribute("x",square.getPosX());
    circle.setAttribute("y",square.getPosY());
    circle.addEventListener("click",() => {
        board.selected.move(square.getPosX(),square.getPosY());
        board.selected = null;
     });
    return circle;
}

class Piece {
    constructor(posX,posY,team,name,isLimited){
        this.posX = posX;
        this.posY = posY;      
        this.team = team;
        this.name = name;
        this.isLimited = isLimited;
        this.value = document.createElement("img");
        this.value.setAttribute("team",this.team);
        this.value.src = `./images/${this.team}${this.name}.svg`;
        this.isFirstMove = true;
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
            this.possibleMoves.push(square);
            if(ip!=0 || jp!=0){
                if(this.team==white){
                    board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).isAffectedByWhite = true;
                }else{
                    board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).isAffectedByBlack = true;
                }  
            }
            if(square.getPiece()!=null){
                if(this.team != square.getPiece().team){
                    if(board.getSquareWithCoordinates(this.posX.charCodeAt(0)+ip,this.posY+jp).getPiece().name=="King"){
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
        if(this.isFirstMove && this.name=="King"){
            if(x == "g" && ((y == 1 && this == board.wKing) || (y==8 && this == board.bKing))){
                board.getSquareWithCoordinates("h".charCodeAt(0),this.posY).getPiece().move("f",this.posY);      
                board.setTurn(!board.getTurn());
            }else if(x == "c" && ((y == 1 && this == board.wKing) || (y==8 && this == board.bKing))){
                board.getSquareWithCoordinates("a".charCodeAt(0),this.posY).getPiece().move("d",this.posY);
                board.setTurn(!board.getTurn());
            }
        }
        else if(this.name=="Pawn"){
            if(x != this.posX && board.getSquareWithCoordinates(x.charCodeAt(0),y).getPiece()==null){
                board.removePiecesOfList(board.getSquareWithCoordinates(x.charCodeAt(0),this.posY).getPiece());
                board.removePiecesOfBoard(board.getSquareWithCoordinates(x.charCodeAt(0),this.posY).getPiece());
            }
        }
        board.removePiecesOfBoard(this);
        this.posX = x;
        this.posY = parseInt(y);
        document.querySelectorAll(".circulo").forEach(element => element.remove());
        if(document.querySelector(`#${this.posX}${this.posY}`).firstChild){
            board.removePiecesOfList(board.getSquare(this).getPiece());
            board.removePiecesOfBoard(board.getSquare(this).getPiece());
        }
        board.getSquare(this).piece = this;
        this.setPosition(); 
        board.setTurn(!board.getTurn());
        board.setAffected(); 
        board.resetEnPassant(this.team);
        board.checkKingThreatened(this.team==white?black:white);
        if(this.name != "Pawn"){
            this.isFirstMove = false;
        }
    }

    drawPossiblePositions(){
        this.validMoves = [];
        this.possibleMoves.forEach(square => {
            if(this.checkValidMove(square.getPosX(),square.getPosY())){
            let circle = createCircle(square);
            this.validMoves.push(square);    
            if(square.getPiece() != null && (square.isAffectedByWhite || square.isAffectedByBlack) && square.getPiece().team != this.team){
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
        board.removePiecesOfList(this);
        board.removePiecesOfBoard(this);
        let a = this.posX ;
        let b = parseInt(this.posY);
        let piece = null;
        this.posX = x;
        this.posY = parseInt(y);
        if(board.getSquare(this).piece != null){
            piece = board.getSquare(this).getPiece();
            board.removePiecesOfList(piece);
            board.removePiecesOfBoard(piece);
        }
        board.insertPieces([this]);
        board.setAffected();
        let valid = !((this.team==white)?board.wKing.threatened:board.bKing.threatened);
        board.removePiecesOfList(this);
        board.removePiecesOfBoard(this);
        this.posX = a;
        this.posY = b;
        board.insertPieces([this]);
        if(piece != null){
            board.insertPieces([piece]);
            piece.setPosition();
        }
        this.setPosition();
        board.setAffected();
        return valid;
    }

    trowAnimation(){
        this.value.classList.toggle("shake");
        setTimeout(() => (this.value.classList.remove("shake")), 300);
    }

    setEvents(){
        this.value.addEventListener("click",() =>{
            if(board.getTurn() && this.team==white || !board.getTurn() && this.team==black){
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
                if(this.validMoves.length==0){
                    this.trowAnimation();
                }
            }
            else{
                this.trowAnimation();
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

    CastlingPossible(){
        if(this.isFirstMove && !this.threatened){
            let leftSquare = board.getSquareWithCoordinates("a".charCodeAt(0),this.posY);
            let rigthSquare = board.getSquareWithCoordinates("h".charCodeAt(0),this.posY);
            if(leftSquare.getPiece()!=null && leftSquare.getPiece().name=="Rook" && leftSquare.getPiece().isFirstMove && board.getSquareWithCoordinates("b".charCodeAt(0),this.posY).getPiece()==null && board.getSquareWithCoordinates("c".charCodeAt(0),this.posY).getPiece()==null && board.getSquareWithCoordinates("d".charCodeAt(0),this.posY).getPiece()==null
            && ((this.team== white && !board.getSquareWithCoordinates("d".charCodeAt(0),this.posY).isAffectedByBlack && !board.getSquareWithCoordinates("c".charCodeAt(0),this.posY).isAffectedByBlack)
            ||(this.team== black && !board.getSquareWithCoordinates("d".charCodeAt(0),this.posY).isAffectedByWhite && !board.getSquareWithCoordinates("c".charCodeAt(0),this.posY).isAffectedByWhite))){
                this.possibleMoves.push(board.getSquareWithCoordinates("c".charCodeAt(0),this.posY));
            }
            if(rigthSquare.getPiece()!=null && rigthSquare.getPiece().name=="Rook" && rigthSquare.getPiece().isFirstMove && rigthSquare.getPiece().isFirstMove && board.getSquareWithCoordinates("f".charCodeAt(0),this.posY).getPiece()==null && board.getSquareWithCoordinates("g".charCodeAt(0),this.posY).getPiece()==null
            && ((this.team== white && !board.getSquareWithCoordinates("f".charCodeAt(0),this.posY).isAffectedByBlack && !board.getSquareWithCoordinates("g".charCodeAt(0),this.posY).isAffectedByBlack)
            || (this.team== black && !board.getSquareWithCoordinates("f".charCodeAt(0),this.posY).isAffectedByWhite && !board.getSquareWithCoordinates("g".charCodeAt(0),this.posY).isAffectedByWhite))){
                this.possibleMoves.push(board.getSquareWithCoordinates("g".charCodeAt(0),this.posY));
            }
        }
    }

    move(x,y){
        if(this.threatened){
            this.threatened = false;
        }
        board.paintKingSquare(this);
        super.move(x,y);
    }

    setPossiblePositions(){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                this.propagation(i,j,ip,jp);
            }
        }
        this.CastlingPossible();
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
        this.rEnPassant = false;
        this.lEnPassant = false;
        this.setEvents();
    }
    move(i,j){
        super.move(i,j);
        if(this.getPosY() == 8 || this.getPosY() == 1){
            this.promote();
        }
        if(this.isFirstMove){
            if(this.getPosY() == 4 || this.getPosY() == 5){
                let leftSquare = checkPosition(this.posX.charCodeAt(0)-1,this.posY);
                if(leftSquare!=null && leftSquare.getPiece() != null && leftSquare.getPiece().team != this.team && leftSquare.getPiece().name=="Pawn"){
                    leftSquare.getPiece().lEnPassant = true;
                }
                let rigthSquare = checkPosition(this.posX.charCodeAt(0)+1,this.posY);
                if(rigthSquare!=null && rigthSquare.getPiece() != null && rigthSquare.getPiece().team != this.team && rigthSquare.getPiece().name=="Pawn"){
                    rigthSquare.getPiece().rEnPassant = true;
                }
            }
            this.isFirstMove = false;
        }
    }

    promote(){
        board.removePiecesOfList(this);
        board.removePiecesOfBoard(this);
        let Pqueen = new Queen(this.getPosX(),this.getPosY(),this.team);
        board.insertPieces([Pqueen]);
        board.setAffected();
        board.checkKingThreatened(this.team==white?black:white,true);
    }

    propagation(i,j,k){
        let square = checkPosition(this.posX.charCodeAt(0)+i,this.posY+j);
        if((i==-1 || i==1) && square!=null){
            if(square.getPiece()!=null && (this.team != square.getPiece().team)){
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
            if(square!=null && square.getPiece() == null){
                this.possibleMoves.push(square);
                if(this.isFirstMove && !k){
                    this.propagation(i,j+j,true);
                }
            }
        } 
    }

    setPossiblePositions(){
        let j = -1;
        for(let i=-1;i<=1;i++){
            this.propagation(i,j + 2*(this.team == white),false);         
        }
        if(this.lEnPassant){
            this.possibleMoves.push(checkPosition(this.posX.charCodeAt(0)+1,this.posY + j + 2*(this.team == white)));
        }
        if(this.rEnPassant){
            this.possibleMoves.push(checkPosition(this.posX.charCodeAt(0)-1,this.posY + j + 2*(this.team == white)));
        }
    }
}

export {King,Queen,Rook,Bishop,Horse, Pawn};