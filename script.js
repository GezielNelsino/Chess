
const main = document.querySelector("main");

const white = "w";
const black = "b";

var selected = null;

var images = [
["https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/45px-Chess_klt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/45px-Chess_kdt45.svg.png"],
["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/45px-Chess_qlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/45px-Chess_qdt45.svg.png"],
["https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/45px-Chess_rlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/45px-Chess_rdt45.svg.png"],
["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/45px-Chess_blt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/45px-Chess_bdt45.svg.png"],
["https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/45px-Chess_nlt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/45px-Chess_ndt45.svg.png"],
["https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/45px-Chess_plt45.svg.png","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/45px-Chess_pdt45.svg.png"]
];

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
        selected.move(circle.getAttribute("x"),circle.getAttribute("y"));
        selected=null;
     });
    return circle;
}

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
            main.appendChild(div);
        }
    }
}

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
        let pawn = new Pawn(`${String.fromCharCode(97+i)}`,2,white);
    }
    for(var i=0; i<8;i++){
        let pawn = new Pawn(`${String.fromCharCode(97+i)}`,7,black);
    }
}

createSquares();
startGame();
