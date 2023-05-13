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

    setPosition(){
        document.querySelector(`#${this.posX}${this.posY}`).appendChild(this.value);
    }

    propagation(i,j,ip,jp){
        while(checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp)!=false){
            let square = checkPosition(this.posX.charCodeAt(0)+ip,this.posY+jp);
            let circle = createCircle(this.posX,this.posY,ip,jp);
            square.appendChild(circle); 
            if(square.firstChild.getAttribute("class")!="circulo"){
                if(square.firstChild == null || (this.team == white && square.firstElementChild.getAttribute("team") == black) || (this.team == black && square.firstElementChild.getAttribute("team") == white)){
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
    }

    move(x,y){
        this.posX = x;
        this.posY = parseInt(y);
        document.querySelectorAll(".circulo").forEach(element => element.remove());
        if(document.querySelector(`#${this.posX}${this.posY}`).firstChild){
            document.querySelector(`#${this.posX}${this.posY}`).firstChild.remove();
        }
        this.setPosition();
    }
    
    setEvents(){
        this.value.addEventListener("click",() =>{
            if(selected == null){
                selected = this;
                this.getPossiblePositions();               
            }else if(selected != this){
                document.querySelectorAll(".circulo").forEach(element => element.remove());
                selected = this;
                this.getPossiblePositions();               
            }else{
                document.querySelectorAll(".circulo").forEach(element => element.remove());
                selected = null;
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
    getPossiblePositions(){
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
    getPossiblePositions(){
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
    getPossiblePositions(){
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
    getPossiblePositions(){
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
    getPossiblePositions(){
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
    }
    propagation(i,j,k){
            let square = checkPosition(this.posX.charCodeAt(0)+i,this.posY+j);
            let circle = createCircle(this.posX,this.posY,i,j);
            if(i==-1 || i==1){
                if(square.firstElementChild!=null && ((this.team == white && square.firstElementChild.getAttribute("team") == black) || (this.team == black && square.firstElementChild.getAttribute("team") == white))){
                    circle.setAttribute("id","upper");
                    square.appendChild(circle); 
                }
            }
            else{
                if(square.firstChild==null){
                    square.appendChild(circle); 
                    if(this.isFirstMove && k==0){
                        this.propagation(i,j+j,1);
                    }
                }
            } 
    }

    getPossiblePositions(){
        let j = -1;
        for(let i=-1;i<=1;i++){
            this.propagation(i,j + 2*(this.team == white),0);              
        }
    }
}
