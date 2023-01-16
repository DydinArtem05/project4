class BlackJackGame {
    constructor(rootNode) {
        this.playercards = null;
        this.computercards = null;
        this.playerScore = null;
        this.computerScore = null;
        this.timeClock = null;
        this.playerWings = null;
        this.computerWings = null;
        this.playerTurn = null;
        this.gameCoins = null;
        this.amountOfRounds = null;

        this.deck = null;
        this.scorePlayerHand = null;
        this.scoreComputerHand = null;
        this.DOMComputerScore = null;
        this.DOMPlayerScore = null;
        this.DOMComputerCards = null;
        this.DOMComputerWings = null;
        this.DOMPlayerWings = null;
        this.DOMGameCoins = null;
        this.DOMPlayersCards = null;
        this.DOMDeckofCards = null;
        this.DOMScoreTable = null;
        this.gameRounds = null;
        this.DOMContinuePlayButton = null;
        this.DOMRestartGameButton = null;
        this.DOMStartGame = null;
        this.DOMStartGameButton = null;

        this.DOMPassButton = null;
        this.DOMRootNode = null;

        this.DOMRootNode = rootNode;
        this.init();
    }

    init() {
        this.playercards = [];
        this.computercards = [];
        this.playerScore = [];
        this.computerScore = [];
        this.playerWings = 0;
        this.computerWings = 0;
        this.playerTurn = true;
        this.gameCoins = [];
        this.scorePlayerHand = 0;
        this.scoreComputerHand = 0;
        this.amountOfRounds = 0;
        this.gameRounds = 5;
        this.deck = this._createDeck();

        this.DOMRootNode.innerHTML = `
            <div class='start-game'>
                <p>Welcome to BlackJack game ;)</p>
            </div>
            <div class='computer-score'>0</div>
            <div class='player-score'>0</div>
            <div class='computer-wings'>0</div>
            <div class='game-coins'></div>
            <div class='player-wings'>0</div>
            <div class='deck-of-cards'></div>
            <div class='computer-cards'></div>
            <div class='player-cards'></div>
            <div class='score-table'></div>
            <button class='start-game-button'>Start</button>
            <div class='button-container'>    
                <button class='continue-play-button'>Continue</button>
                <button class='restart-game-button'>Restart</button>
            </div>
            <button class='pass'>Pass</button>
        `
        this.DOMComputerScore = this.DOMRootNode.querySelector('.computer-score');
        this.DOMPlayerScore = this.DOMRootNode.querySelector('.player-score');
        this.DOMComputerCards = this.DOMRootNode.querySelector('.computer-cards');
        this.DOMComputerWings = this.DOMRootNode.querySelector('.computer-wings');
        this.DOMGameCoins = this.DOMRootNode.querySelector('.game-coins');
        this.DOMPlayerWings = this.DOMRootNode.querySelector('.player-wings');
        this.DOMPlayersCards = this.DOMRootNode.querySelector('.player-cards');
        this.DOMDeckofCards = this.DOMRootNode.querySelector('.deck-of-cards');
        this.DOMScoreTable = this.DOMRootNode.querySelector('.score-table');
        this.DOMStartGame = this.DOMRootNode.querySelector('.start-game');
        this.DOMStartGameButton = this.DOMRootNode.querySelector('.start-game-button');
        this.DOMContinuePlayButton = this.DOMRootNode.querySelector('.continue-play-button');
        this.DOMRestartGameButton = this.DOMRootNode.querySelector('.restart-game-button');
        this.DOMPassButton = this.DOMRootNode.querySelector('.pass');
        this.addCardsToDeck();
        this.addGameCoins();
        this.DOMDeckofCards.addEventListener('click', () => {
            if (!this.playerTurn) {
                return
            }
            this.pickPlayerCard();
        });

        this.DOMPassButton.addEventListener('click', () => {
            if (!this.playerTurn) {
                return
            }
            this.pass();
        });
        this.DOMContinuePlayButton.addEventListener('click',(e)=>{
            this.startRound();
        });
        this.DOMRestartGameButton.addEventListener('click',(e)=>{
            this.restartGame();
        });
        this.DOMStartGameButton.addEventListener('click',(e)=>{
            this.playerTurn = true;
            this.DOMRootNode.classList.remove('blur');
            this.DOMStartGame.style.display = 'none';
            this.DOMStartGameButton.style.display = 'none';
        });
        this.renderScore();
		this.clearMessage();
        this.startGame();
    }

    startGame(){
        this.playerTurn = false;
        this.DOMRootNode.classList.add('blur');
        this.DOMStartGame.style.display = 'flex';
        this.DOMStartGameButton.style.display = 'block';
    }

    addGameCoins(){
        for(var i = 1; i < this.gameRounds+1; i++){
            var gameCoinMarginTop = 11 + i*50;
            var coin = '<div class=game-coin style = "background-image:url(./img/coin.png); margin-top:'+gameCoinMarginTop+'%; margin-left:-5%;" id='+i+'></div>';
            this.DOMGameCoins.innerHTML = this.DOMGameCoins.innerHTML + coin;
        }
    }

    addCardsToDeck() {
        this.DOMDeckofCards.innerHTML = null;
        for (var i = 0; i < this.deck.length - 1; i++) {
            this.DOMDeckofCards.innerHTML = this.DOMDeckofCards.innerHTML + '<div class=card style = margin-left:' + [i] * 2 + 'px></div>';
        }
    }

    sumOfParticipantsScore(participantsScore) {
        var s = 0;
        for (var i = 0; i < participantsScore.length; i++) {
            s += participantsScore[i];
        }
        return s;
    }

    pickPlayerCard() {
        const card = this.deck.pop();
        this.addCardsToDeck();
        this.playerScore.push(card.weight);
        this.scorePlayerHand = this.sumOfParticipantsScore(this.playerScore);
        this.playercards.push(card);
        this.renderPlayerHand(card);
        if(this.scorePlayerHand === 21 || this.scorePlayerHand>21){
            this.playerTurn = false;
            setTimeout(()=>{
                this.endRound();
            },1500)
        }
    }

    renderPlayerHand(card) {

        this.DOMPlayersCards.innerHTML = this.DOMPlayersCards.innerHTML + `
            <div class= player-card style=background-image:url(./img/` + card.name + `-` + card.suit + `.jpg)></div>
        `
        this.DOMPlayerScore.innerHTML = `
            ${JSON.stringify(this.scorePlayerHand)}
        `
    }

    pickComputerCard() {
        const card = this.deck.pop();
        this.addCardsToDeck();
        this.computerScore.push(card.weight);
        this.computercards.push(card);
        this.scoreComputerHand = this.sumOfParticipantsScore(this.computerScore);
        this.renderComputerHand(card);
        if(this.scoreComputerHand < 18){
            setTimeout(()=>{
                this.pickComputerCard()
            },1000);
        }else{
            this.playerTurn = false;
            setTimeout(()=>{
                this.endRound();
            },1500)
        }
    }

    renderComputerHand(card) {
        this.DOMComputerCards.innerHTML = this.DOMComputerCards.innerHTML + `
            <div class=computer-card style=background-image:url(./img/` + card.name + `-` + card.suit + `.jpg)></div>
        `
        this.DOMComputerScore.innerHTML = `
            ${JSON.stringify(this.scoreComputerHand)}
        `
    }

    pass() {
        this.playerTurn = false;
        this.renderTurn();
        this.pickComputerCard();
    }

    renderTurn() {
        this.DOMPassButton.disabled = !this.playerTurn;
        this.DOMDeckofCards.disabled = !this.playerTurn;
    }
    restartGame(){
        this.computerCards = [];
		this.playersCards = [];
        this.scorePlayerHand = 0;
        this.scoreComputerHand = 0;
        this.playerScore = [];
        this.computerScore = [];
        this.DOMComputerScore.innerHTML = '0';
        this.DOMPlayerScore.innerHTML = '0';
        this.DOMComputerCards.innerHTML = '';
		this.DOMPlayersCards.innerHTML = '';
		this.deck = this._createDeck()
        this.playerTurn = true;
        this.DOMPassButton.disabled = false;
        this.playerWings = 0;
        this.computerWings = 0;
        this.DOMGameCoins.innerHTML = '';
        this.addGameCoins();

        this.renderScore();
        this.clearMessage();
    }

    startRound(){
        this.computerCards = [];
		this.playersCards = [];
        this.scorePlayerHand = 0;
        this.scoreComputerHand = 0;
        this.playerScore = [];
        this.computerScore = [];
        this.DOMComputerScore.innerHTML = '0';
        this.DOMPlayerScore.innerHTML = '0';
        this.DOMComputerCards.innerHTML = '';
		this.DOMPlayersCards.innerHTML = '';
		this.deck = this._createDeck()
        this.playerTurn = true;
        this.DOMPassButton.disabled = false;

        this.renderScore();
        this.clearMessage();
    }

    animate({timing, draw, duration}) {

        let start = performance.now();
      
        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
          let progress = timing(timeFraction);
          draw(progress);
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
      
        });
      }

    giveCoinToPlayer(){
        var playerCoin = this.DOMGameCoins.querySelector('.game-coin');
        var playerCoinMarginTop =playerCoin.id * 10;
        this.animate({
            duration: 1000,
            timing: function(timeFraction) {
            return timeFraction;
            },
            draw: function(progress) {
                playerCoin.style.marginTop = progress * 650 + playerCoinMarginTop  + '%';
            }
        });
        playerCoin.className = 'player-coin';
    };

    giveCoinToComputer(){
        var computerCoin = this.DOMGameCoins.querySelector('.game-coin');
        var computerCoinMarginTop = computerCoin.id * 10;
        this.animate({
            duration: 1000,
            timing: function(timeFraction) {
            return timeFraction;
            },
            draw: function(progress) {
                computerCoin.style.marginTop = progress * - 350 - computerCoinMarginTop +  '%';
            }
        });
        computerCoin.className = 'computer-coin';
    };

    endRound(){
        if (this.scorePlayerHand <= 21 && this.scoreComputerHand <= 21) {
			if(this.scorePlayerHand > this.scoreComputerHand) {
				this.playerWings += 1;
                this.giveCoinToPlayer();
            }else if (this.scoreComputerHand > this.scorePlayerHand) {
				this.computerWings += 1;
                this.giveCoinToComputer();
            }
		}else if (this.scorePlayerHand >= 21 && this.scoreComputerHand <= 21) {
			this.computerWings += 1;
            this.giveCoinToComputer();
            
        }else if (this.scoreComputerHand >= 21 && this.scorePlayerHand <= 21) {
			this.playerWings += 1;
            this.giveCoinToPlayer();
        }else{
            return
        }    
        
        this.showMessage(this.getMessage());
        this.renderScore();
        this.renderTurn();
    }

    renderScore(){
        this.DOMComputerWings.innerHTML = this.computerWings;
        this.DOMPlayerWings.innerHTML = this.playerWings;
    }

    showMessage(text){
        this.DOMScoreTable.innerHTML = text;
        this.DOMRootNode.classList.add('blur');
        this.DOMScoreTable.style.display = 'flex';
        if(this.amountOfRounds === 5){
            this.DOMContinuePlayButton.style.display = 'none';
            this.DOMRestartGameButton.style.display = 'block';
        }else{
            this.DOMContinuePlayButton.style.display = 'inline-block';
            this.DOMRestartGameButton.style.display = 'inline-block';
        }
        
    }

    clearMessage(){
        this.DOMScoreTable.innerHTML = ' ';
        this.DOMRootNode.classList.remove('blur');
        this.DOMScoreTable.style.display = 'none';
        this.DOMContinuePlayButton.style.display = 'none';
        this.DOMRestartGameButton.style.display = 'none';
    }

    getMessage(){
        this.amountOfRounds++;
        if(this.amountOfRounds < 5){
            if (this.scorePlayerHand <= 21 && this.scoreComputerHand <= 21) {
                if (this.scorePlayerHand > this.scoreComputerHand) {
                    return 'Player Win !'
                } else if (this.scoreComputerHand > this.scorePlayerHand) {
                    return 'Computer Win !'
                }
            } else if (this.scorePlayerHand > 21 && this.scoreComputerHand <= 21) {
                return 'Computer Win !'
            } else if (this.scoreComputerHand > 21 && this.scorePlayerHand <= 21) {
                return 'Player Win !'
            } else if(this.scoreComputerHand === this.scorePlayerHand){
                return 'Nobody win !'
            }
        }else if(this.amountOfRounds === 5){
            if(this.playerWings > this.computerWings){
                return 'Player win this game !'
            }else{
                return 'Computer win this game !'
            }
        }
    }

    _createDeck() {
        const suits = ['hearts', 'clubs', 'diamonds', 'spades'];
        const cards = [{ name: 'tuz', weight: 11 }, { name: 'korol', weight: 4 }, { name: 'dama', weight: 3 }, { name: 'valet', weight: 2 }, { name: '10', weight: 10 }, { name: '9', weight: 9 }, { name: '8', weight: 8 }, { name: '7', weight: 7 }, { name: '6', weight: 6 }];
        const deck = [];
        for (let suit of suits) {
            for (let cardInfo of cards) {
                deck.push({
                    suit: suit,
                    name: cardInfo.name,
                    weight: cardInfo.weight
                })
            }
        }
        deck.sort(() => {
            return Math.random() > 0.5 ? 1 : -1;
        })

        return deck;
    }
}

new BlackJackGame(document.querySelector('.game'));


