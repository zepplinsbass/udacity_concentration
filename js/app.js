
//Card constructor. Creates cards that will be placed in the game.deck array.
function Card (name, status) {
    this.name = name;
    this.status = status;
}

//Game object is referenced throughout the remainder of the program.
const game = {
    deck: [],
    cardA: null,
    cardB: null,
    toggle: null,
    timer: 0,
    score: 0,
    starRating: 3,
    moves: 0,
    start: false,
}

//Contains all other functions.
function playDeck () {

    //Grabs the list of card elements, adds an EventListener to each, creates a Card object for each, and places
    //those Card objects in the game.deck array.
    function createCards () {
        const cardList = document.body.querySelector('.deck');
        const cardStatus = cardList.getElementsByTagName('li');
        for (let i = 0; i < cardStatus.length; i++) {
            const cardName = cardStatus[i].getElementsByTagName('i');
            game.deck[i] = new Card(cardName[0].className, cardStatus[i].className);

            //Adds the event listener to each card. The EventListener will
            //start the game.timer, if it hasn't already started, and flip the
            //cards to check for matches.
            cardStatus[i].addEventListener('click', function () {
                  if (game.start === false) {
                      game.start = true;
                      startTimer();
                      checkMatch(game.deck[i], cardStatus[i]);
                  } else {
                      checkMatch(game.deck[i], cardStatus[i]);
                  }
            });
        }
    }

    //Starts the game timer. Only called at the beginning of the game, by
    //createCards function.
    function startTimer () {
        game.toggle = window.setInterval(runTimer, 1000);
        console.log('timer on');
    }

    //Incrementally increases game.timer and then writes that value to the
    //timer html element. Called by the startTimer function.
    function runTimer() {
        const elem = document.body.querySelector('.timer');
        elem.innerHTML = `${game.timer}s`;
        game.timer += 1;
    }

    //Stops the game timer and writes the game.timer value to the timer html
    //element. Called when a player wins the game, and then again if the game
    //resets.
    function resetTimer() {
        window.clearInterval(game.toggle);
        const elem = document.body.querySelector('.timer');
        elem.innerHTML = `${game.timer}s`;
        console.log('timer off');
    }

    /* Shuffle the deck array. Shuffle function from http://stackoverflow.com/a/2450976 */
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
        return array;
    }

    //Executes the createCards function to fill the game.deck array with Cards,
    //then shuffles that array and writes those values back to the list of card
    //html elements. So, no card elements are added or removed, but each has
    //their class changed to match the game.deck array.
    //Also executes the resetDeck function, which adds an EventListener to the
    //'reset button'.
    function createDeck () {
        createCards();
        shuffle(game.deck);
        resetDeck();
        const list = document.body.querySelector('.deck');
        const elem = list.getElementsByTagName('li');
        for (let i = 0; i < game.deck.length; i++) {
            const name = elem[i].getElementsByTagName('i');
            elem[i].className = 'card';
            game.deck[i].status = 'card';
            name[0].className = game.deck[i].name
        }
    }

    //Flips a card face up when it's clicked and checks for matches.
    //First, is the clicked card face-down AND there are no other face-up cards?
    //If YES, then flip the card face-up and set it to game.cardA.
    //If NO, then is the clicked card face-down AND there is another face-up card?
    //If YES, then flip the card face-up and set it to game.cardB. Update the
    //move count.
    //If NO, then do nothing.
    function checkMatch (card, elem) {
        if ((game.cardA === null) && (elem.className === 'card')) {
            game.cardA = card;
            elem.className = 'card open show';
            game.cardA.status = 'card open show';
            return;
        } else if ((game.cardB === null) && (game.cardA !== card) && (elem.className === 'card')) {
            game.cardB = card;
            elem.className = 'card open show';
            game.cardB.status = 'card open show';

            //move count is updated
            game.moves++;
            updateScorePanel(game.moves, 'moves');
        } else {
            return;
        }

        //Then, check if the names of the two face-up cards match. Update the
        //star rating afterwards.
        if (game.cardA.name === game.cardB.name) {
            isMatch();
        } else {
            flipDown();
        }
        const stars = document.body.querySelector('.stars');
        updateStars(stars);
    }

    //This runs when two cards are matched.
    //Incrememnets the score, which affects the star rating.
    //Changes the class of the card elements for styling and locks them.
    //Checks if all cards have been matched.
    //If YES, then stops the game timer and starts the end-game modal.
    function isMatch () {
        ++game.score;
        const list = document.body.querySelector('.deck');
        let match = list.querySelectorAll('li.card.open.show');
        match[0].className = 'card match';
        match[1].className = 'card match';

        game.cardA = null;
        game.cardB = null;

        if(game.score === (game.deck.length/2)) {
            popCongrats();
            resetTimer();
        }
    }

    //This runs when two cards are face-up, and they do not match.
    //Flips them face-down after a brief delay. And resets game.cardA and
    //game.cardB placeholders.
    function flipDown () {
        setTimeout(function () {
            const list = document.body.querySelector('.deck');
            const mixed = list.querySelectorAll('li.card.open.show');
            mixed[0].className = 'card';
            mixed[1].className = 'card';

            game.cardA = null;
            game.cardB = null;
        }, 600);
    }

    //Calculates a star rating whenever game.move increases by 1. Then changes
    //the html element to reflect the star rating.
    //Star rating is just the result of game.moves subtracted from some constant added to game.score.
    function updateStars (element) {
        const stars = ((10 + game.score) - game.moves);
        if (stars > 5) {
            game.starRating = 3;
        }
        else if ((stars <= 5) && (stars > -1)) {
            game.starRating = 2;
        }
        else if ((stars <= -1) && (stars > -6)) {
            game.starRating = 1;
        }

        for (let i = game.starRating; i < 3; i++) {
            const x = element.getElementsByTagName('li');
            x[i].style.display = 'none';
        }

        if (game.start === false) {
            for (let j = 0; j < 3; j++) {
                const x = element.getElementsByTagName('li');
                x[j].style.display = 'inline-block';
            }
        }
    }

    //Used to update the html element for move count. Could be used to update
    //timer as well (but currently it's not).
    function updateScorePanel (update, element) {
        const selectElem = document.body.getElementsByClassName(element);
        selectElem[0].innerHTML = update;
    }

    //Runs whenever the 'reset button' is clicked or if a player selects 'Play
    //Again?' on the congrats modal.
    //Resets the game object, removes all Card objects, and updates all html
    //elements accordingly.
    function gameOver (element) {
        game.deck = [];
        game.moves = 0;
        game.score = 0;
        game.timer = 0;
        game.starRating = 3;
        game.start = false;
        game.cardA = null;
        game.cardB = null;
        updateScorePanel(game.moves, 'moves');
        updateStars(element);
        resetTimer();
        createDeck();
    }

    //Adds an EventListener to the 'reset button'.
    function resetDeck () {
        const reset = document.body.querySelector('.restart');
        const stars = document.body.querySelector('.stars');
        reset.addEventListener('click', function() {
            gameOver(stars);
        });
    }

    //Congrats modal which appears when a player wins the game.
    //Displays the player's star rating and completion time.
    function popCongrats () {
        const yourRating = document.body.querySelector('#js-rating');
        const yourTime = document.body.querySelector('#js-time');
        const stars = document.body.querySelector('.stars');
        const modal = document.body.querySelector('.congrats');
        const close = modal.querySelector('.close');
        const button = modal.querySelector('#play-again');
        modal.style.display = 'flex';
        yourTime.innerHTML = `${game.timer}s`;
        yourRating.innerHTML = stars.innerHTML;
        yourRating.className = 'stars-clone';
        updateStars(yourRating);

        close.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        button.addEventListener('click', function() {
            modal.style.display = 'none';
            gameOver(stars);
        });
    }

createDeck();

}

playDeck();

