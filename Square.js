export class Square{
    constructor(x,y,value){
        this.piece;
        this.posX = x;
        this.posY = y;
        this.value = value;
        this.isAffectedByBlack;
        this.isAffectedByWhite;
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
    }
    
    insertInto(piece){
        this.piece = piece;
    }  
};