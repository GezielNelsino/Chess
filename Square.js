export class Square{
    constructor(x,y,value,color){
        this.piece;
        this.posX = x;
        this.posY = y;
        this.value = value;
        this.color = color;
        this.isAffectedByBlack;
        this.isAffectedByWhite;
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
    }

    getPiece(){
        return this.piece;
    }

    getValue(){
        return this.value;
    }

    setPiece(piece){
        this.piece = piece;
    }
};