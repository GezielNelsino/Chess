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
        return document.querySelector(`#${String.fromCharCode(a)}${b}`);
    }
    else{
        return false;
    }
}

function createCircle(x,y,ip,jp){
    let circle = document.createElement("div");
        circle.setAttribute("class","circulo");
        circle.setAttribute("x",String.fromCharCode(x.charCodeAt(0)+ip));
        circle.setAttribute("y",y+jp);
        circle.addEventListener("click",() => {
        board.selected.move(circle.getAttribute("x"),circle.getAttribute("y"));
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

    propagation(i,j,ip,jp,shoudPaint){
        while(checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp)!=false){            
            let square = checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp);
            let circle = createCircle(this.posX,this.posY,ip,jp);
            square.appendChild(circle); 
            if(ip!=0 || jp!=0){
                if(this.team==white){
                    board.squares[this.posX.charCodeAt(0)+ip-97][this.posY+jp-1].isAffectedByWhite = true;
                }else{
                    board.squares[this.posX.charCodeAt(0)+ip-97][this.posY+jp-1].isAffectedByBlack = true;
                }  
            }
            if(square.firstChild.getAttribute("class")!="circulo"){
                if(square.firstChild == null || (this.team != square.firstElementChild.getAttribute("team"))){
                    circle.setAttribute("id","upper");
                }else{
                    circle.remove();
                }
                break;
            }     
            if(this.isLimited){
                break;
            }
            ip+=i;
            jp+=j;
        }
        if(!shoudPaint){
            document.querySelectorAll(".circulo").forEach(element => element.remove());
        }
    }

    move(x,y){
        board.removePiecesOfBoard(board.selected);
        this.posX = x;
        this.posY = parseInt(y);
        document.querySelectorAll(".circulo").forEach(element => element.remove());
        if(document.querySelector(`#${this.posX}${this.posY}`).firstChild){
            board.removePiecesOfList(board.squares[board.selected.getPosX().charCodeAt(0)-97][board.selected.getPosY()-1].piece);
            document.querySelector(`#${this.posX}${this.posY}`).firstChild.remove();
        }
        board.squares[board.selected.getPosX().charCodeAt(0)-97][board.selected.getPosY()-1].piece = board.selected;
        this.setPosition();  
        board.setAffected();   
    }

    setEvents(){
        this.value.addEventListener("click",() =>{
            if(board.selected == null){
                board.selected = this;
                this.getPossiblePositions(true);               
            }else if(board.selected != this){
                document.querySelectorAll(".circulo").forEach(element => element.remove());
                board.selected = this;
                this.getPossiblePositions(true);               
            }else{
                document.querySelectorAll(".circulo").forEach(element => element.remove());
                board.selected = null;
            }
        });
        this.setPosition();
    }
}

class King extends Piece {
    constructor(posX,posY,team) {
        super(posX, posY,team,"King",true);
        this.setEvents();
    }
    getPossiblePositions(shoudPaint){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                this.propagation(i,j,ip,jp,shoudPaint);    
            }                
        }
    }
}

class Queen extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Queen",false);
        this.setEvents();
    }
    getPossiblePositions(shoudPaint){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                this.propagation(i,j,ip,jp,shoudPaint);    
            }                
        }
    }
}
class Rook extends Piece {
    constructor(posX,posY, team) {
        super(posX,posY,team,"Rook",false);
        this.setEvents();
    }
    getPossiblePositions(shoudPaint){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                if((i==0 || j==0)){
                    this.propagation(i,j,ip,jp,shoudPaint);
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
    getPossiblePositions(shoudPaint){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                let ip = i;
                let jp = j;
                if(i!=0 && j!=0){
                    this.propagation(i,j,ip,jp,shoudPaint);
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
    getPossiblePositions(shoudPaint){
        for(let i=-2;i<=2;i++){
            for(let j=-2;j<=2;j++){
                let ip = i;
                let jp = j;
                if((i!=0 && j!=0) && (i!=j) && (i!=-j) && (!(i%2) || !(j%2))){
                    this.propagation(i,j,ip,jp,shoudPaint);
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
        if(this.getPosY() == 8){
            this.promote();
        }
    }

    promote(){        
        board.removePiecesOfList(board.selected);
        board.removePiecesOfBoard(board.selected);
        let Pqueen = new Queen(this.getPosX(),this.getPosY(),this.team);
        board.insertPieces([Pqueen]);
        board.setAffected();   
    }

    propagation(i,j,k){
            let square = checkPosition(this.posX.charCodeAt(0)+i,this.posY+j);
            let circle = createCircle(this.posX,this.posY,i,j); 
            if((i==-1 || i==1) && square!=false){                    
                if(square.firstElementChild!=null && (this.team != square.firstElementChild.getAttribute("team"))){
                    circle.setAttribute("id","upper");
                    square.appendChild(circle); 
                }
                if(this.team==white){
                    board.squares[this.posX.charCodeAt(0)+i-97][this.posY+j-1].isAffectedByWhite = true;
                }
                else{
                    board.squares[this.posX.charCodeAt(0)+i-97][this.posY+j-1].isAffectedByBlack = true;
                } 
            }
            else{
                if(square!=false && square.firstChild==null){
                    square.appendChild(circle); 
                    if(this.isFirstMove && k==0){
                        this.propagation(i,j+j,1);
                    }
                }
            } 
    }

    getPossiblePositions(shoudPaint){
        let j = -1;
        for(let i=-1;i<=1;i++){
            this.propagation(i,j + 2*(this.team == white),0);  
            if(!shoudPaint){
                document.querySelectorAll(".circulo").forEach(element => element.remove());
            }            
        }
    }
}

export {King,Queen,Rook,Bishop,Horse, Pawn};