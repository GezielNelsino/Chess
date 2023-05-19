const main = document.querySelector("main");

class endGameScreen{
    constructor(){
        this.winner;
        this.value = document.createElement("div");
    }
    
    setComponents(){
        this.value.setAttribute("class","endGame");
        let div = document.createElement("div");
        let buttons = document.createElement("div");
        let continueButton = document.createElement("button");
        continueButton.setAttribute("type","button");
        continueButton.addEventListener("click",() => {
            this.setWinner(false, "");
        });
        let restartButton = document.createElement("button");
        restartButton.setAttribute("type","button");
        restartButton.addEventListener("click",() => {
            window.location.href = "./index.html";
        });
        div.setAttribute("class","status");
        buttons.setAttribute("class","buttons");
        restartButton.setAttribute("class","button");
        continueButton.setAttribute("class","button");
        div.innerHTML = this.winner;
        continueButton.innerText = "CONTINUE";
        restartButton.innerText = "RESTART";
        buttons.appendChild(continueButton);
        buttons.appendChild(restartButton);
        this.value.appendChild(div);
        this.value.appendChild(buttons);
    }

    setWinner(bool, text){
        this.winner = `${text}`;
        if(bool){
            main.appendChild(this.value);
            this.setComponents();
        }
        else{
            this.value.remove();
        }
    }
};

let screen = new endGameScreen();
export{screen};