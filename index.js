class Card{
    constructor(suit,rank,isJocker = false,){
        this.suit = suit
        this.isJocker = isJocker
        this.rank = rank
    }
}
// class Deck{
//     constructor(numberOfCards){
//      this.numberOfCards = numberOfCards;
//      create(){

//      }
//     }
// }
let deck = function createCard(){
    const cards={};
    const shapes = ["Spade", "Heart", "Club", "Diamond"]
    for(let shape of shapes){
        for(let i = 1; i<=13; i++){
            const propName = shape+i
                cards[propName]=new Card(shape, i,undefined,);
            
        }

    }
    return cards;
}
console.log(deck())