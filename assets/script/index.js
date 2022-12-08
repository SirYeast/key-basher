"use strict";

const timer = document.getElementById("timer");
const points = document.getElementById("points");
const display = document.getElementById("display");
const wordInput = document.getElementById("word-input");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("message");
const overlayPointStat = document.getElementById("point-stat");
const overlayPercentStat = document.getElementById("percent-stat");
const overlayPlayButton = document.getElementById("play-btn");
const scoreAside = document.getElementById("scores");
const scoreList = document.getElementById("score-list");

const music = new Audio("assets/audio/nightrun.mp3");

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
    'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
    'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
    'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
    'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
    'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
    'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
    'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
    'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
    'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
    'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
    'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
    'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window'
];

let scores = [];

let wordsCopy;
let currentWord;
let letterElements;
let timeLeft;
let timerID;
let pointCount;

function populateScores() {
    if (scores.length > 1)
        scores.sort((a, b) => b.wordsEntered - a.wordsEntered);

    scoreList.innerHTML = "";

    for (let i = 0; i < scores.length; i++) {
        const score  = scores[i];

        const scoreItem = document.createElement("li");

        const scorePlace = document.createElement("span");
        scorePlace.className = "place";
        scorePlace.innerText = `#${i + 1}`;
        scoreItem.appendChild(scorePlace);

        const scoreWordsEntered = document.createElement("span");
        scoreWordsEntered.className = "words-entered";
        scoreWordsEntered.innerText = `${score.wordsEntered} words`;
        scoreItem.appendChild(scoreWordsEntered);

        const scorePercentage = document.createElement("span");
        scorePercentage.className = "percentage";
        scorePercentage.innerText = `${score.percentage.toFixed(2)}%`;
        scoreItem.appendChild(scorePercentage);

        scoreList.appendChild(scoreItem);
    }
}

function updateWord() {
    if (wordsCopy.length == 0) {
        endGame("Won");
        return;
    }

    wordInput.value = "";
    display.innerHTML = "";

    let index = Math.floor(Math.random() * wordsCopy.length);
    currentWord = wordsCopy[index];
    wordsCopy.splice(index, 1);

    letterElements = [];

    for (let i = 0; i < currentWord.length; i++) {
        let letter = document.createElement("span");
        letter.innerText = currentWord[i];
        letterElements.push(letter);
        display.appendChild(letter);
    }
}

function processInput() {
    let input = wordInput.value.toLowerCase();

    if (currentWord === input) {
        updateWord();
        pointCount++;
        points.innerText = pointCount;
        return;
    }

    for (let i = 0; i < currentWord.length; i++) {
        letterElements[i].style.color = currentWord[i] === input[i] ? "#ffce3b" : "revert";
    }
}

function startGame() {
    wordsCopy = [...words];
    timeLeft = 10;
    pointCount = 0;

    timer.innerText = timeLeft;
    points.innerText = 0;

    updateWord();

    overlay.style.display = "none";
    wordInput.disabled = false;
    wordInput.focus();

    music.play();

    timerID = setInterval(function () {
        if (timeLeft == 0) {
            endGame("Time");
            return;
        }

        timeLeft--;
        timer.innerText = timeLeft;
    }, 1000);
}

function endGame(reason) {
    clearInterval(timerID);
    wordInput.disabled = true;

    if (reason == "Time") {
        display.innerText = "Time's Up!";
        overlayMessage.innerText = "You ran out of time!";
    } else {
        display.innerText = "You Won!";
        overlayMessage.innerText = "Nice, you got all the words!";
    }

    let audioFadeID = setInterval(function () {
        if (music.volume != 0)
            music.volume -= 0.1;

        if (music.volume < 0.003) {
            clearInterval(audioFadeID);

            music.pause();
            music.currentTime = 0;
            music.volume = 1;

            setTimeout(function() {
                const score = {
                    wordsEntered: pointCount,
                    percentage: pointCount / words.length * 100
                };

                overlayPointStat.innerText = `Words: ${score.wordsEntered} / ${words.length}`;
                overlayPercentStat.innerText = `Percentage: ${score.percentage.toFixed(2)}%`;
                overlayPlayButton.innerText = "Start Again";
                overlay.style.display = "flex";

                if (scores.length == 9) {
                    if (score.wordsEntered < scores[scores.length - 1].wordsEntered) {
                        return;
                    }
                    scores.pop();
                }

                scores.push(score);
                populateScores();

                localStorage.setItem("scores", JSON.stringify(scores));
                scoreAside.style.display = "block";
            }, 2000);
        }
    }, 200);
}

window.addEventListener("load", function() {
    if (localStorage.length > 0) {
        scores = JSON.parse(localStorage.getItem("scores"));
        populateScores();

        scoreAside.style.display = "block";
    }
});

wordInput.addEventListener("keyup", processInput);
overlayPlayButton.addEventListener("click", startGame);