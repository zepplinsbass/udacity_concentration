/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function Card (name, status) {
    this.name = name;
    this.status = status;
}

/* The game object contains the deck array (an array of Card objects), the
 * cardElems array (the NodeList of html card elements), and the checkCard
 * property, which always contains one of the Card objects from the deck. It
 * also contains the flipCard and checkMatch methods, which run in the
 * EventListener for each card.*/

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

function playDeck () {

    function createCards () {
        const cardList = document.body.querySelector('.deck');
        const cardStatus = cardList.getElementsByTagName('li');
        for (let i = 0; i < cardStatus.length; i++) {
            const cardName = cardStatus[i].getElementsByTagName('i');
            game.deck[i] = new Card(cardName[0].className, cardStatus[i].className);

            //Adds the event listener to each card.
            cardStatus[i].addEventListener('click', function () {
                  if (game.start === false) {
                      game.start = true;
                      checkMatch(game.deck[i], cardStatus[i]);
                      toggleTimer();
                  } else {
                      checkMatch(game.deck[i], cardStatus[i]);
                  }
            });
        }
    }

    function toggleTimer () {
        if (!game.toggle) {
            game.toggle = window.setInterval(runTimer, 1000);
        } else {
            window.clearInterval(game.toggle);
            game.toggle = null;
        }
    }

    function runTimer() {
        const elem = document.body.querySelector('.timer');
        elem.innerHTML = `${game.timer}s`;
        game.timer += 1;
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

    function checkMatch (card, elem) {
        if ((game.cardA === null) && (elem.className === 'card')) {
            game.cardA = card;
            elem.className = 'card open show';
            game.cardA.status = 'card open show';
            return;
        } else if ((game.cardA !== null) && (game.cardA !== card) && (elem.className === 'card')) {
            game.cardB = card;
            elem.className = 'card open show';
            game.cardB.status = 'card open show';

            //move count is updated
            game.moves++;
            updateScorePanel(game.moves, 'moves');
        } else return;

        if (game.cardA.name === game.cardB.name) {
            isMatch();
        } else {
            flipDown();
        }
        updateStars();
    }

    function isMatch () {
        ++game.score;
        if (game.score === (game.deck.length/2)) {
            game.start = false;
            toggleTimer();
            popCongrats();
        } else {
        const list = document.body.querySelector('.deck');
        let match = list.querySelectorAll('li.card.open.show');
        match[0].className = 'card match';
        match[1].className = 'card match';

        game.cardA = null;
        game.cardB = null;
        }
    }

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

    function updateStars () {
        const element = document.body.querySelector('.stars');
        const stars = ((10 + game.score) - game.moves);
        if (stars > 6) {
            game.starRating = 3;
        }
        else if ((stars <= 6) && (stars > -1)) {
            game.starRating = 2;
        }
        else if ((stars <= -1) && (stars > -7)) {
            game.starRating = 1;
        }
        else if (stars <= -7) {
            game.starRating = 0;
        }
        for (let i = game.starRating; i < 3; i++) {
            const x = element.getElementsByTagName('li');
            x[i].style.display = 'none';
        }

        if (game.start === false) {
            for (let j = 0; j < 3; j++) {
                const x = element.getElementsByTagName('li');
                x[j].style.display = '';
            }
        }
    }

    function updateScorePanel (update, element) {
        const selectElem = document.body.getElementsByClassName(element);
        selectElem[0].innerHTML = update;
    }

    function gameOver () {
        game.deck = [];
        game.moves = 0;
        game.score = 0;
        game.timer = 0;
        game.starRating = 3;
        game.start = false;
        game.cardA = null;
        game.cardB = null;
        game.toggle = null;
        updateScorePanel(game.moves, 'moves');
        updateStars();
        createDeck();
    }

    function resetDeck () {
        const reset = document.body.querySelector('.restart');
        reset.addEventListener('click', function() {
              toggleTimer();
              gameOver();
        });
    }

    function popCongrats (rating, time) {
        const yourRating = document.body.querySelector('#js-rating');
        const yourTime = document.body.querySelector('#js-time');
        const stars = document.body.querySelector('.stars');
        const modal = document.body.querySelector('.congrats');
        const close = modal.querySelector('.close');
        const button = modal.querySelector('#play-again');
        modal.style.display = 'flex';
        yourTime.innerHTML = `${game.timer}s`;
        yourRating.innerHTML = stars.innerHTML;
        yourRating.className = 'stars';

        close.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        button.addEventListener('click', function() {
            modal.style.display = 'none';
            gameOver();
        });
    }

createDeck();

}

playDeck();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
