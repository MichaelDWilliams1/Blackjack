const card = document.querySelector('.card');
const displayPlayerCount = document.querySelector('.count');
const displayDealerCount = document.querySelector('.dealerScore')
const drawButton = document.querySelector('.drawButton')
const holdButton = document.querySelector('.holdButton')
const modalToggle = document.querySelector('.modalContainer')
const modalLoseTogle = document.querySelector('.modalLoseContainer')
const submitButton = document.querySelector('.submitBet')
const gameOverModal = document.querySelector('.gameOverContainer')

//arrays to store drawn cards in.
let playerCards = [];
let computerCards = [];

let bet;
let playerCount = 0;
let dealerCount = 0;

let firstDraw = true;
let afterFirstDraw = false;
let gameOver = true;
let section = false;
let dealerSection = false;
let doubled = false;

//player submit amount they want to bet with
const dollarAmountSpan = document.querySelector('.dollarAmount')
currentMoney = parseInt(dollarAmountSpan.innerHTML);

 //shuffles deck when the window loads.  
window.onload = () => {
    shuffleDeck();
}

//this function takes and submits the bet. The game wont start until this functin is ran. 
function betPlaced() {
    doubled = false;
    gameOver = false;
    bet = document.querySelector('#betAmount').value;
    if(bet < 0){
        return alert('betting a negative amount is a no no')
    }
    if (bet > currentMoney)
    {
        return alert('You dont have that much to bet with silly')
        
    }
    if(bet === '')
    {
        return alert('Please choose an amount to bet with')
    }
    playerBet = document.querySelector('.betDisplay').innerHTML = bet;
     playerBet = parseInt(playerBet);
    document.querySelector('.betContainer').classList.remove('toggle');
    callCard();
    
}

//this function will only draw cards from the deck at the very beginning of the game.
const callCard = async () => { 
    if(firstDraw === false) return;
    if(gameOver === true) return;
    const config = { headers: { Accept: 'application.json'} }
const res = await axios.get('https://deckofcardsapi.com/api/deck/01xacw4ounry/draw/?count=2', config) 
drawFirstSet(res.data.cards);
firstDraw = false;
computerFirstDraw();
}

//this function will run after the player has drawn the first set of cards. 
const afterFirstCall = async () => { 
    if(gameOver === true) return;
    const config = { headers: { Accept: 'application.json'} }
const res = await axios.get('https://deckofcardsapi.com/api/deck/01xacw4ounry/draw/?count=1', config)
drawFirstSet(res.data.cards);
}

//This function will reshuffle the deck when the deck of cards is running low.
const shuffleDeck = async () => {
    const config = { headers: { Accept: 'application.json'} }
const res = await axios.get('https://deckofcardsapi.com/api/deck/01xacw4ounry/shuffle/', config)
}

const drawFirstSet = (card)=>{
    //will loop through the card array so that we can get a value from each of the cards drawn.
    for(let i = 0; i < card.length; i++){
        createSection();
        let img = document.createElement('IMG');
        img.src = card[i].image;
        document.querySelector(".cardHolder").append(img);
      
        if (card[i].value === 'KING' || card[i].value === 'QUEEN' || card[i].value === 'JACK')
        {
            cardNumber = 10;
        }
        else if (card[i].value === 'ACE')
        {
        if (playerCount + 11 <= 21)
        {
        cardNumber = 11;
        }
       else {
           cardNumber = 1;
       }
        }
        else{
        cardNumber = parseInt(card[i].value);
        }
        playerCount = playerCount+cardNumber;
        updateCountDisplay();
        playerCards.push(cardNumber);
    }
    
    checkWin();
}


//computer logic for drawing cards --------------------------------------------------------------

//this function will only be called at the start of the game to get the dealers first cards on the board
const computerFirstDraw = async () => { 

    const config = { headers: { Accept: 'application.json'} }
 const res = await axios.get('https://deckofcardsapi.com/api/deck/01xacw4ounry/draw/?count=1', config);   
 computerIsDrawing(res.data.cards)
    
}


const computerDraw = async () => { 
    //draw cards until the game is over. 
    while(!gameOver){
    const config = { headers: { Accept: 'application.json'} }
 const res = await axios.get('https://deckofcardsapi.com/api/deck/01xacw4ounry/draw/?count=1', config);   
 computerIsDrawing(res.data.cards)
    }
}


const computerIsDrawing = (card)=>{    
    //loops through the card array
    for(let i = 0; i < card.length; i++){
        //section where dealers cards will go is created
        createDealerSection();
        let img = document.createElement('IMG');
        img.src = card[i].image;
        document.querySelector(".dealerContainer").append(img);
    
        if (card[i].value === 'KING' || card[i].value === 'QUEEN' || card[i].value === 'JACK')
        {
            cardNumber = 10;
        }
        else if (card[i].value === 'ACE')
        {
        if (dealerCount + 11 <= 21)
        {
        cardNumber = 11;
        }
       else {
           cardNumber = 1;
       }
    }
        else{
            //had to parse because the card value comes through as a string
        cardNumber = parseInt(card[i].value);
        }
        dealerCount = dealerCount+cardNumber;
        updateCountDisplay();
        computerCards.push(cardNumber);
   
    }
    if (computerCards.length === 1)
    {
        img = document.createElement('IMG');
        img.src = ('backcard.jpeg');
        img.classList.add('back');
        document.querySelector(".dealerContainer").append(img)
        img.classList.add('toggle')
        return;
    }
    else{
        document.querySelector('.back').classList.remove('toggle');
    checkWin();
    }

}

//Next two functions are there to create the sections in which the cards being drawn will be held.

function createSection(){
    if(section)
    {
        return;
    }else{
    aNewSection = document.createElement('section');
    aNewSection.classList.add('cardHolder');
    document.querySelector('.cardSection').append(aNewSection);
    section = true;
    }

}

function createDealerSection() {
    if(dealerSection)
    {
        return;
    }else{
    dealerNewSection = document.createElement('section');
    dealerNewSection.classList.add('dealerContainer');
    document.querySelector('.dealerSection').append(dealerNewSection);
    }
    dealerSection = true;
    
}

 //updates the total amount of cards in hand. Quick maths! Also updates current amount left to bet with.
function updateCountDisplay(){
    displayPlayerCount.innerHTML = playerCount;
    displayDealerCount.innerHTML = dealerCount;
    dollarAmountSpan.innerHTML = currentMoney;
    document.querySelector('.modalWinAmount').innerHTML = currentMoney;
    document.querySelector('.modalLoseAmount').innerHTML = currentMoney;

}

function doubleBet(){
    

    if (doubled) 
    return;
    
    else{
   playerBet+=playerBet;
   document.querySelector('.betDisplay').innerHTML = playerBet;
   doubled =true;
    }
}


//If else statements checking if there is a win on the board
function checkWin(){    

    if (playerCount === 21)
    {
    return modalWin()
    }

    if(gameOver) return;

    if (playerCount > 21){
        if (playerCards.includes(11))
{
    index = playerCards.findIndex( num => num === 11)
playerCards[index] = 1;
playerCount = playerCards.reduce((a,b) => a+b);
updateCountDisplay();
}
else{
        modalLose();
    }
}

    if(gameOver) return;

    if(dealerCount === 21)
    {
   modalLose()
    }

    if(gameOver) return;

    if(dealerCount === playerCount)
    {
    modalTie();
    }

    if(gameOver) return;

    if(dealerCount > playerCount && dealerCount < 21)
    {
      modalLose();
    }

    if(gameOver) return;

    if(dealerCount > 21)
    {
        if(computerCards.includes(11))
        {
    index = computerCards.findIndex(num => num === 11)
    computerCards[index] = 1;
    dealerCount = computerCards.reduce((a,b) => a+b);
    updateCountDisplay(); 
}else{
    modalWin();
    }
}
}


//Below is all modals that will pop up depending on the event taking place.
function newGame(){
   currentMoney = 500;
   document.querySelector('.betDisplay').innerHTML = 0;
updateCountDisplay();
playAgain();
}

function modalWin() {
    gameOver = true;
    modalToggle.classList.add('toggle');
currentMoney += playerBet;
updateCountDisplay()
}

function modalLose(){
gameOver = true;
modalLoseTogle.classList.add('toggle');
currentMoney -= playerBet;
updateCountDisplay()
checkForGameOver();
}

function modalTie (){
    gameOver = true;
    document.querySelector('.tieContainer').classList.add('toggle');
}

function userQuit(){
    document.querySelector('.quitAmount').innerHTML = currentMoney;
    document.querySelector('.userQuitContainer').classList.add('toggle');
    modalToggle.classList.remove('toggle');
    modalLoseTogle.classList.remove('toggle');
}

function checkForGameOver() {
    if (currentMoney <= 0)
    {
        gameOver = true;
      gameOverModal.classList.add('toggle');
      modalLoseTogle.classList.remove('toggle');
    }
}

//this function resets everything back to the way it was at the start of the game. 
function playAgain(){
    shuffleDeck();
    aNewSection.remove();
    dealerNewSection.remove();
    modalToggle.classList.remove('toggle');
    modalLoseTogle.classList.remove('toggle');
    document.querySelector('.betContainer').classList.add('toggle');
    document.querySelector('.tieContainer').classList.remove('toggle');
    gameOverModal.classList.remove('toggle');
    playerCards = [];
    computerCards = [];
    document.querySelector('.betDisplay').innerHTML = '';
     displayPlayerCount.innerHTML = 0;
    displayDealerCount.innerHTML = 0;
    playerCount = 0;
    dealerCount = 0;
     firstDraw = true;
    afterFirstDraw = false;
    section = false;
    dealerSection = false;
}



drawButton.addEventListener('click', afterFirstCall);

submitButton.addEventListener('click', betPlaced);

holdButton.addEventListener('click', computerDraw);

document.querySelector('.tieButton').addEventListener('click', playAgain);

document.querySelector('.playAgainButton').addEventListener('click', playAgain);

document.querySelector('.anotherPlayAgainButton').addEventListener('click', playAgain);

document.querySelector('.newGameButton').addEventListener('click', newGame);

document.querySelector('.doubleButton').addEventListener('click', doubleBet);

document.querySelector('.loseNoButton').addEventListener('click', userQuit);
document.querySelector('.winNoButton').addEventListener('click', userQuit)

document.querySelector('.beginPlayingButton').addEventListener('click', () => {
document.querySelector('.loadContainer').classList.add('toggle');
document.querySelector('.betContainer').classList.add('toggle');
})