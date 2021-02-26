class Card{
    constructor(suit, rank,value, isJocker = false){
        this.suit = suit;
        this.isJocker = isJocker;
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

const deck = new Deck();
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
const yaniv = document.getElementById('yaniv');


