class Card{
    constructor(suit, rank,value, isJoker = false){
        this.suit = suit;
        this.isJoker = isJoker;
        this.value =value;
        this.imgName = value + suit;
        if(isJoker){
            this.name = 'Joker'
            this.imgName = 'Black_joker';
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
        this.name = this.suit + " " + this.rank
    }
}


class Deck{
    constructor(){
        this.cards=[];
    }
    create(){
        const shapes = ["S", "H", "C", "D"];
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
        this.score = 0;
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

const players = [new PlayerDeck("player1"),new PlayerDeck("player2"),new PlayerDeck("player3"),new PlayerDeck("player4")];
let turn = Math.floor(Math.random() * 4);
const deck = new Deck();
const pileDeck = new PileDeck();

function removeCards(){
    document.querySelectorAll('.card').forEach(div => div.remove());
    players.forEach(player => player.playerCards.splice(0, player.playerCards.length));
    pileDeck.pileCards.splice(0, pileDeck.pileCards.length);
    deck.cards.splice(0, deck.cards.length);
}

function startRound(){
    deck.create();
    deck.suffle();
    for (const player of players) {
        const playerName=document.getElementById(player.playerName);
        for (let i = 0; i < 5; i++) {
            drawCard(player,playerName)
        }
    }
    pileDeck.pileCards.push(deck.cards[0]);
    let img = document.createElement('img');
    img.alt = deck.cards[0].name;
    img.src = 'assests/cards-svg/' + deck.cards[0].imgName + '.svg';
    
    document.getElementById('used-cards').appendChild(img)
    img.setAttribute("id", "top-pile");
    img.alt = deck.cards[0].name;
    deck.cards.shift()
    
}
startRound()

function drawCard(playerDiraction, divDiraction){
    playerDiraction.playerCards.push(deck.cards[0]);
    let img = document.createElement('img');
    img.setAttribute("class", "card fliped");
    img.alt = deck.cards[0].name;
    img.src = 'assests/cards-svg/' + deck.cards[0].imgName + '.svg';
    
    divDiraction.appendChild(img)
    deck.cards.shift()
}
function updateTable(playersArr){
    const trHead = document.createElement("tr");
    const table = document.createElement("table");
    table.setAttribute("id", "point-table")
    const tableDiv = document.getElementById("table");
    const tr = document.createElement("tr");
    for (const player of playersArr) {
        const th = document.createElement("th");
        th.innerHTML = player.playerName;
        trHead.append(th);
    }
    table.append(trHead);
    for (const player of playersArr) {
        const td = document.createElement("td");
        td.innerHTML = player.score;
        tr.append(td);
    }
    table.append(tr);
    tableDiv.append(table)
}

updateTable(players);
(function startGame(x){
    let thisTurnPlayer = players[x]
    let playerDiv = document.getElementById(thisTurnPlayer.playerName);
    let playerPoints = document.createElement("div");
    playerPoints.innerHTML = thisTurnPlayer.points()
    playerPoints.setAttribute("class", "playerPoints");
    playerDiv.append(playerPoints);
    playerDiv.querySelectorAll(".card").forEach(card => card.className = "card");
    const yaniv = document.getElementById('yaniv');
    yaniv.addEventListener('click',pushYaniv);

    function pushYaniv(){
        if(thisTurnPlayer.points() <= 7){
            let winnerPlayer = thisTurnPlayer;
            turn = x;
            for (let i = 0; i <players.length; i++) {
                let player = players[i];
                if(player.points() <= winnerPlayer.points()){
                    winnerPlayer = player;
                    turn = i;
                }
                player.score += player.points();
                if(player.score > 200){
                    players.splice(i, 1);
                    document.getElementById(`${player.playerName}`).remove();
                }
                if(player.score % 50 === 0 && player.score !== 50 && player.score !== 0){
                    player.score -= 50;
                }
                if(players.length === 1){
                    alert(`you won!`);
                    return;
                }
            }  
            if(winnerPlayer.playerName === thisTurnPlayer.playerName){
                alert(`YANIV ${winnerPlayer.playerName}`)
                thisTurnPlayer.score -= thisTurnPlayer.points(); 
            } else{
                alert("ASAF " + winnerPlayer.playerName)
                thisTurnPlayer.score += 30;
                winnerPlayer.score -= winnerPlayer.points();
            } 
            removeCards()
            startRound()
            // playerDiv.querySelectorAll(".card").forEach(card => card.className = "card fliped");
            document.getElementById('top-pile').remove()
            playerPoints.remove()
            document.getElementById("point-table").remove();
            yaniv.removeEventListener('click',pushYaniv);
            playerDiv.removeEventListener("click",add);
            dropButton.removeEventListener("click",dropFunction);
            usedCards.removeEventListener("click",drewFromPile);
            updateTable(players);
            startGame(turn)
        }
    }


    let selectedCards = []
    playerDiv.addEventListener("click",add)
    function add(event){
        let target = event.target.closest('img');
        
        if(target){
            if(target.className === "card selected "){
                target.className = "card ";
                for(let i = 0; i<selectedCards.length; i++){
                    if(selectedCards[i].name === target.alt){
                        selectedCards.splice(i, 1);
                    }
                }
            }
            else{
                target.className = "card selected ";
                for(let i = 0; i<thisTurnPlayer.playerCards.length; i++){
                    if(thisTurnPlayer.playerCards[i].name === target.alt){
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
                if(turn === players.length){
                    turn = 0
                }
                playerPoints.remove()
                playerDiv.querySelectorAll(".card").forEach(card => card.className = "card fliped");


                yaniv.removeEventListener('click',pushYaniv);
                playerDiv.removeEventListener("click",add);
                dropButton.removeEventListener("click",dropFunction);
                usedCards.removeEventListener("click",drewFromPile);
                startGame(turn);
            }
            else{
                alert("you enter worng cards")
            }
        }
    }

    function doTheDrop(){
       const topCard = document.getElementById('top-pile');
       const img = document.getElementById('top-pile');
       for(let i=0; i<selectedCards.length; i++){
           img.alt = selectedCards[i].name;
           img.src = 'assests/cards-svg/'+selectedCards[i].imgName+'.svg';
           pileDeck.pileCards.push(selectedCards[i]);
       }
       for (const card of selectedCards) {
           for (let i = 0; i < thisTurnPlayer.playerCards.length; i++) {
               const playerCard = thisTurnPlayer.playerCards[i];
               if(playerCard.name === card.name){
                thisTurnPlayer.playerCards.splice(i, 1);
               }
           }
        }
        selectedCards.splice(0, selectedCards.length);
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
        let joker = sortedCards.findIndex((card)=>card.value>0) //[0,0,2,5]
        for (let i = joker; i < sortedCards.length-1; i++) {
            
            if(sortedCards[i].suit !== sortedCards[i+1].suit){
                return 0;
            }
            const dif = sortedCards[i].value - sortedCards[i+1].value +1;
            joker += dif

            if(joker < 0 ){
                return 0;
            }
            
            // if(sortedCards[i].value !== (sortedCards[i+1].value - 1) && sortedCards[i].suit !== sortedCards[i+1].suit){
            //     alert("you enter worng cards")
            //         return 0;
            // }
            
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
                playerPoints.remove()
                playerDiv.querySelectorAll(".card").forEach(card => card.className = "card fliped");
                yaniv.removeEventListener('click',pushYaniv)
                playerDiv.removeEventListener("click",add);
                dropButton.removeEventListener("click",dropFunction);
                usedCards.removeEventListener("click",drewFromPile);
    
                startGame(turn)
            }
            else{
                alert("you enter worng cards");
            }
        }
    }
    const card = document.createElement("div");
    // playerDiraction.playerCards.push(deck.cards[0]);
    // const card = document.createElement("div");
    // card.setAttribute("class", "card");
    // card.innerText = deck.cards[0].name;
    // let img = document.createElement('img');
    // img.setAttribute("class", "card fliped");
    // img.alt = deck.cards[0].name;
    // img.src = 'assests/cards-svg/' + deck.cards[0].imgName + '.svg';
    
    // divDiraction.appendChild(img)
    // img.append(card);
    function drewFromPileCard(playerDiraction,divDiraction){
        
        let len = pileDeck.pileCards.length - 1
        const card = document.createElement("div");
        card.setAttribute("class", "card");
        let img = document.createElement('img');
        img.setAttribute("class", "card fliped");
        card.innerText = pileDeck.pileCards[len].name;
        img.alt = pileDeck.pileCards[len].name;
        img.src = 'assests/cards-svg/' + pileDeck.pileCards[len].imgName + '.svg';
        playerDiraction.playerCards.push(pileDeck.pileCards[len]);
        divDiraction.appendChild(img)
        img.append(card);
        pileDeck.pileCards.pop();
        
 
    }
})(turn)

