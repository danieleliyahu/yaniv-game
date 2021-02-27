class Card{
    constructor(suit, rank,value, isJocker = false){
        this.suit = suit;
        this.isJocker = isJocker;
        if(isJocker){
            this.name = 'Jocker'
        }
        switch (rank) {
            case 1:
                this.rank = 'A'
                break;
            case 11:
                this.rank = 'J'
                this.value =10;
                break;
            case 12:
                this.rank = 'Q'
                this.value =10;
                break;
            case 13:
                this.rank = 'K'
                this.value =10;
                break;
            default:
                this.rank =rank;
                this.value =value;
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
        this.cards.push(new Card("Jocker", null, true));
        this.cards.push(new Card("Jocker", null, true));
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
        this.points = 0
        this.playerName = playerName
        this.playerCards = [];
    }
}

class PileDeck extends Deck{
    constructor(){
        super()
        this.pileCards = [];
    }
}

const deck = new Deck();
const pileDeck = new PileDeck();
const players = [new PlayerDeck("player1"),new PlayerDeck("player2"),new PlayerDeck("player3"),new PlayerDeck("player4")];
deck.create();
deck.suffle();
for (const player of players) {
    const playerName=document.getElementById(player.playerName);
    for (let i = 0; i < 5; i++) {
        player.playerCards.push(deck.cards[0]);
        const card = document.createElement("div");
        card.setAttribute("class", "card");

        card.innerText = deck.cards[0].suit + " " + deck.cards[0].rank;
        playerName.append(card);
        deck.cards.shift()

    }
}

pileDeck.pileCards.push(deck.cards[0]);
const card = document.createElement("div");
card.setAttribute("class", "card");
card.setAttribute("id", "top-pile");
card.innerText = deck.cards[0].suit + " " + deck.cards[0].rank;
document.getElementById('used-card').append(card);
deck.cards.shift()
const yaniv = document.getElementById('yaniv');


// while(i < 4){
    let x = 0
    let thisTurnPlayer = players[x]
    // yaniv.addEventListener('click',function(){
        
    //     if(thisTurnPlayer.points <= 7){
    //         for(player of players){
            
    //         }
    //         return 4
    //    
    //     else{
    //         alert("your points are higher then 7")
    //     }
    // })
    let playerDiv = document.getElementById(thisTurnPlayer.playerName);
    playerDiv.addEventListener("click",function(event){
        const target = event.target.closest('.card');
        if(target){
            for(let i = 0; i<thisTurnPlayer.playerCards.length; i++){
                if(thisTurnPlayer.playerCards[i].name === target.innerText){
                    const topCard = document.getElementById('top-pile');
                    topCard.innerText = thisTurnPlayer.playerCards[i].name;
                    pileDeck.pileCards.push(thisTurnPlayer.playerCards[i]);
                    thisTurnPlayer.playerCards.splice(i, 1);

                }
            }
            playerDiv.removeChild(target)

            // console.log(target.innerText)
        }
        
    })

//     i++;
// }