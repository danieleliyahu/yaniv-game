class Card{
    constructor(suit, rank,value, isJoker = false){
        this.suit = suit;
        this.isJoker = isJoker;
        this.value =value;
        if(isJoker){
            this.arr = [1,2,3,4,5,6,7,8,9,10,11,12,13]
            this.name = 'Joker'
        }
        switch (rank) {
            case 1:
                this.rank = 'A'
                break;
            case 11:
                this.rank = 'J'
                break;
            case 12:
                this.rank = 'Q'
                break;
            case 13:
                this.rank = 'K'
                break;
            default:
                this.rank =rank;
                break;
        }
        this.name =this.suit + " " + this.rank
    }
}


class Deck{
    constructor(){
        this.cards=[];
    }
    create(){
        const shapes = ["Spade", "Heart", "Club", "Diamond"];
        for (const shape of shapes) {
            for (let i = 1; i <= 13; i++) {
                this.cards.push(new Card(shape,i, i))
            }
        }
        this.cards.push(new Card("Joker", null, 0, true));
        this.cards.push(new Card("Joker", null, 0, true));
    }

    suffle(){
        let location1, location2, tmp;
        for (let i = 0; i < 1000; i++) {
            location1 = Math.floor((Math.random() * this.cards.length));
            location2 = Math.floor((Math.random() * this.cards.length));
            tmp = this.cards[location1];
            this.cards[location1] = this.cards[location2];
            this.cards[location2] = tmp; 
        }
    }
}

class PlayerDeck extends Deck{
    constructor(playerName){
        super();
        this.playerName = playerName
        this.playerCards = [];
    }
    points(){
        let sum = 0
        for (const cards of this.playerCards) {
            if(cards.value > 10){
                cards.value = 10;
            }
             sum += cards.value;
        }
        return sum
    }
}

class PileDeck extends Deck{
    constructor(){
        super()
        this.pileCards = [];
    }
}

function drawCard(playerDiraction, divDiraction){
    playerDiraction.playerCards.push(deck.cards[0]);
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    card.innerText = deck.cards[0].name;
    divDiraction.append(card);
    deck.cards.shift()
}

const deck = new Deck();
const pileDeck = new PileDeck();
const players = [new PlayerDeck("player1"),new PlayerDeck("player2"),new PlayerDeck("player3"),new PlayerDeck("player4")];
deck.create();
deck.suffle();
for (const player of players) {
    const playerName=document.getElementById(player.playerName);
    for (let i = 0; i < 5; i++) {
        drawCard(player,playerName)
    }
}

pileDeck.pileCards.push(deck.cards[0]);
const card = document.createElement("div");
card.setAttribute("class", "card");
card.setAttribute("id", "top-pile");
card.innerText = deck.cards[0].name;
document.getElementById('used-cards').append(card);
deck.cards.shift()
const yaniv = document.getElementById('yaniv');

let turn = 0;
(function startGame(x){
    let thisTurnPlayer = players[x]
    // yaniv.addEventListener('click',function(){
        
    //     if(thisTurnPlayer.points() <= 7){
    //         for(let p = 0; p < players.length; p++){
    //             for(let c = 1; c<players.length; c++){
                    
    //             }
    //         }
    //         return 4
       
    //     else{
    //         alert("your points are higher then 7")
    //     }
    // })
    let playerDiv = document.getElementById(thisTurnPlayer.playerName);
    let selectedCards = []
    let indexs = [];
    playerDiv.addEventListener("click",add)
    function add(event){
        const target = event.target.closest('.card');
        if(target){
            if(target.className === "card selected"){
                target.className = "card";
                for(let i = 0; i<selectedCards.length; i++){
                    if(selectedCards[i].name === target.innerText){
                        indexs.splice(i, 1);
                        selectedCards.splice(i, 1);
                    }
                }
            }
            else{
                target.className = "card selected";
                for(let i = 0; i<thisTurnPlayer.playerCards.length; i++){
                    if(thisTurnPlayer.playerCards[i].name === target.innerText){
                        indexs.push(i);
                        selectedCards.push(thisTurnPlayer.playerCards[i]);
                    }
                }
            }
        }
        
    }
    let dropButton = document.getElementById(`drop-${thisTurnPlayer.playerName}`);
    dropButton.addEventListener("click",dropFunction);
    function dropFunction(){
        if(selectedCards.length === 0){
             alert('you need to pick a card')
        }else{

            let ok = 0;
            if(selectedCards.length >= 3){
                ok += checkVaildSeria(selectedCards);
            }
            if(ok === 0){
                ok += checkVaildSameNumber(selectedCards)
            }
            if(ok > 0){
                doTheDrop()
                drawCard(thisTurnPlayer, playerDiv)
                turn++
                if(turn === 4){
                    turn = 0
                }
                playerDiv.removeEventListener("click",add);
                dropButton.removeEventListener("click",dropFunction);
                startGame(turn)
            }
        }
    }

    function doTheDrop(){
       const topCard = document.getElementById('top-pile');
       for(let i=0; i<selectedCards.length; i++){
           topCard.innerText = selectedCards[i].name;
           pileDeck.pileCards.push(selectedCards[i]);
       }
       selectedCards.splice(0, selectedCards.length);
       for (const index of indexs) {
           thisTurnPlayer.playerCards.splice(index, 1);
       }
       document.querySelectorAll('.selected').forEach(element => element.remove());
    }

    function checkVaildSameNumber(selectedCards){
        for (let i = 0; i<selectedCards.length; i++) {
            for(let t = i + 1; t<selectedCards.length; t++){
                if(selectedCards[i].isJoker){
                    i++
                }
                if(selectedCards[t].isJoker){
                    t++
                    if(t === selectedCards.length){
                        return 1;
                    }
                }
                if(selectedCards[i].rank !== selectedCards[t].rank){
                    alert("you enter worng cards")
                    return 0;
                }
            }
        }
        return 1;
    }
    function checkVaildSeria(selectedCards){
        const sortedCards = [...selectedCards];
        sortedCards.sort((a,b)=>{
            if(a.value > b.value){
                return 1;
            }
            if(a.value < b.value){
                return -1;
            }
            return 0;
        });
        for (let i = 0; i < sortedCards.length; i++) {
            if(i + 1 === sortedCards.length){
                return 1
            }
    
            if(sortedCards[i].value !== (sortedCards[i+1].value - 1) && sortedCards[i].suit !== sortedCards[i+1].suit){
                alert("you enter worng cards")
                    return 0;
            }
            
        }

        return 1;
    }

    const usedCards = document.getElementById("used-cards");
    usedCards.addEventListener('click',drewFromPile);
    function drewFromPile(){
        if(selectedCards.length === 0){
            alert('you need to pick a card')
        }else{

            let ok = 0;
            if(selectedCards.length >= 3){
                ok += checkVaildSeria(selectedCards);
            }
            if(ok === 0){
                ok += checkVaildSameNumber(selectedCards)
            }
            if(ok > 0){
                drewFromPileCard(thisTurnPlayer,playerDiv);
                doTheDrop()
                turn++
                if(turn === 4){
                    turn = 0
                }
                playerDiv.removeEventListener("click",add);
                dropButton.removeEventListener("click",dropFunction);
                usedCards.removeEventListener("click",drewFromPile);
    
                startGame(turn)
            }
        }
    }

    function drewFromPileCard(playerDiraction,divDiraction){
        
        let len = pileDeck.pileCards.length - 1
        const card = document.createElement("div");
        card.setAttribute("class", "card");
        card.innerText = pileDeck.pileCards[len].name;
        divDiraction.append(card);
        playerDiraction.playerCards.push(pileDeck.pileCards[len]);
        pileDeck.pileCards.pop();
        
    }
})(turn)

