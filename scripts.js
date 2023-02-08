(function() {
    const body = document.body;
    const container = document.createElement('div');
    const h1 = document.createElement('h1');
    const paragraph = document.createElement('p');
    const setupForm = document.createElement('form');
    const inputNumber = document.createElement('input');
    const gameContainer = document.createElement('div');
    const buttonContainer = document.createElement('div');
    const startButton = document.createElement('button');


    body.classList.add('body');
    container.classList.add('container');
    h1.classList.add('mainHeading');
    paragraph.classList.add('simpleText');
    setupForm.classList.add('setupForm');
    inputNumber.classList.add('inputNumber');
    startButton.classList.add('startButton');
    gameContainer.classList.add('gameContainer');

    h1.textContent = 'Игра в пары';
    paragraph.textContent = 'Количество карточек по вертикали/горизонтали';

    inputNumber.setAttribute('type', 'text');
    inputNumber.setAttribute('name', 'inputNumber');
    inputNumber.setAttribute('autocomplete', 'off');
    inputNumber.setAttribute('pattern', '[0-9]+$');
    inputNumber.setAttribute('placeholder', 'Введите четное число от 2 до 10');

    startButton.textContent = 'Начать игру';

    function makeShuffledArr(vert, hor) {
        console.log('makeShuffledArr');
        sessionStorage.clear();
        let arr = [];

        for (let i = 0; i < vert * hor / 2; ++i) {
            arr.push(i + 1);
            arr.push(i + 1);
        }

        let shuffledArr = [];
        let n = arr.length;
        let i;
        while (n) {
            i = Math.floor(Math.random() * n--);
            shuffledArr.push(arr.splice(i, 1)[0]);
        }
        sessionStorage.setItem('shuffledArr', JSON.stringify(shuffledArr));
        return shuffledArr;
    }

    function createCards(numberOfCards) {
        console.log('createCards');
        makeShuffledArr(numberOfCards, numberOfCards);
        let shuffledArr = JSON.parse(sessionStorage.getItem('shuffledArr'));

        if (gameContainer.childElementCount !== 0) {
            gameContainer.innerHTML = '';
        }

        for (let i = 0; i < numberOfCards * numberOfCards; ++i) {
            let card = document.createElement('div');
            card.classList.add('card');
            card.textContent = shuffledArr[i];
            gameContainer.append(card);
        }

        if (numberOfCards === '2') {
            gameContainer.style.gridTemplateColumns = 'repeat(2, 80px)';
        } else if (numberOfCards === '4') {
            gameContainer.style.gridTemplateColumns = 'repeat(4, 80px)';
        } else if (numberOfCards === '6') {
            gameContainer.style.gridTemplateColumns = 'repeat(6, 80px)';
        } else if (numberOfCards === '8') {
            gameContainer.style.gridTemplateColumns = 'repeat(8, 80px)';
        } else if (numberOfCards === '10') {
            gameContainer.style.gridTemplateColumns = 'repeat(10, 80px)';
        }
    }

    function startGame(e) {
        console.log('startGame');
        e.target.style.color = '#061b33';
        let idChecker = parseInt(e.target.id);
        let currentNumber = parseInt(e.target.textContent);

        if (isNaN(idChecker)) {
            i++;
            e.target.setAttribute('id', `${i}`);
            ++numberOfOpenedCards;
            compareArr.push(currentNumber);

            if (compareArr.length > 2 && compareArr[i - 2] !== compareArr[i - 3]) {
                let checkPrePreCard = document.getElementById(i - 3);

                if (numberOfOpenedCards === JSON.parse(sessionStorage.getItem('shuffledArr')).length) {
                    finishGame();
                    return;
                }

                if (compareArr.length > 3 &&
                    compareArr[i - 3] === compareArr[i - 4] &&
                    checkPrePreCard !== null) {
                    return;
                }

                let getCard1 = document.getElementById(i - 1);
                let getCard2 = document.getElementById(i - 2);

                if (getCard1 !== null && getCard2 !== null) {
                    getCard1.removeAttribute('style');
                    getCard2.removeAttribute('style');

                    getCard1.removeAttribute('id');
                    getCard2.removeAttribute('id');

                    numberOfOpenedCards = numberOfOpenedCards - 2;
                }
            }
        }
    }

    function finishGame() {
        console.log('finishGame');
        const playAgainButton = document.createElement('button');
        playAgainButton.classList.add('playAgainButton');
        playAgainButton.textContent = 'Сыграть еще раз';
        container.append(playAgainButton);

        playAgainButton.addEventListener('click', repeatGame);
    }

    function repeatGame() {
        console.log('repeatGame');
        let numberOfCards;
        compareArr = [];
        i = 0;
        numberOfOpenedCards = 0;
        let repeatCards = JSON.parse(sessionStorage.getItem('numberOfCards'));

        container.removeChild(container.lastChild);

        if (!repeatCards ||
            repeatCards <= 2 ||
            repeatCards % 2 !== 0) {
            let createCardGrid = createCards('2');
            numberOfCards = 2;
            sessionStorage.setItem('numberOfCards', numberOfCards);
        } else if (repeatCards <= 10) {
            let createCardGrid = createCards(repeatCards);
            sessionStorage.setItem('numberOfCards', repeatCards);
        }

        startGame;

        let cards = document.getElementsByClassName('card');
        for (const card of cards) {
            card.addEventListener('click', startGame, false);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        body.append(container);
        container.append(h1);
        container.append(setupForm);
        container.append(gameContainer);

        setupForm.append(paragraph);
        setupForm.append(inputNumber);
        setupForm.append(buttonContainer);
        buttonContainer.append(startButton);

        startButton.addEventListener('click', (e) => {
            e.preventDefault();

            let checkPlayAgainButton = document.getElementsByClassName('playAgainButton').length;
            let playAgainButtons = document.getElementsByClassName('playAgainButton');

            if (checkPlayAgainButton) {
                for (const playAgainButton of playAgainButtons) {
                    playAgainButton.remove();
                }
            }

            let numberOfCards;
            compareArr = [];
            i = 0;
            numberOfOpenedCards = 0;

            if (!inputNumber.value ||
                inputNumber.value <= 2 ||
                inputNumber.value % 2 !== 0) {
                let createCardGrid = createCards('2');
                numberOfCards = 2;
                sessionStorage.setItem('numberOfCards', numberOfCards);
            } else if (inputNumber.value <= 10) {
                let createCardGrid = createCards(inputNumber.value);
                numberOfCards = parseInt(inputNumber.value);
                sessionStorage.setItem('numberOfCards', parseInt(inputNumber.value));
            }
            inputNumber.value = '';

            let cards = document.getElementsByClassName('card');
            for (const card of cards) {
                card.addEventListener('click', startGame, false);
            }
        });
    });
})();