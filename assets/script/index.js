"use strict";

import Score from "./Score.js";

const timer = document.getElementById("timer");
const points = document.getElementById("points");
const letters = document.getElementById("letters");
const wordInput = document.getElementById("word-input");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const pointStat = document.getElementById("point-stat");
const percentStat = document.getElementById("percent-stat");
const playButton = document.getElementById("play-btn");

const music = new Audio("assets/audio/nightrun.mp3");

const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
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

let wordsCopy;
let currentWord;
let letterElements = [];
let timeLeft = 99;
let interval;
let pointCount = 0;

function updateWord() {
    wordInput.value = "";
    letters.innerHTML = "";

    letterElements = [];

    let index = Math.floor(Math.random() * wordsCopy.length);
    currentWord = wordsCopy[index];
    wordsCopy.splice(index, 1);

    for (let i = 0; i < currentWord.length; i++) {
        let letter = document.createElement("span");
        letter.innerText = currentWord[i];

        letters.appendChild(letter);
        letterElements.push(letter);
    }
}

function processInput() {
    let input = wordInput.value.trim().toLowerCase();

    for (let i = 0; i < currentWord.length; i++)
        letterElements[i].style.color = currentWord[i] === input[i] ? "#ffce3b" : "revert";

    if (currentWord === input) {
        pointCount++;
        points.innerText = pointCount;

        if (wordsCopy.length == 0) {
            endGame("Won");
            return;
        }
        updateWord();
    }
}

function startGame() {
    wordsCopy = [...words];
    updateWord();

    timer.innerText = timeLeft;

    overlay.style.display = "none";
    wordInput.disabled = false;
    wordInput.focus();

    music.play();

    interval = setInterval(function () {
        timeLeft--;

        if (timeLeft == 0) {
            endGame("Time");
            return;
        }

        timer.innerText = timeLeft;
    }, 1000);
}

function endGame(reason) {
    clearInterval(interval);
    wordInput.disabled = true;

    if (reason == "Time") {
        timer.innerText = "Time's Up!";
        message.innerText = "You ran out of time!";
    } else {
        timer.innerText = "You Won!";
        message.innerText = "Nice, you got all the words!";
    }

    let audioFade = setInterval(function () {
        if (music.volume != 0)
            music.volume -= 0.1;

        if (music.volume < 0.003) {
            clearInterval(audioFade);
            music.pause();

            setTimeout(resetGame, 2000);
        }
    }, 200);
}

function resetGame() {
    const score = new Score(new Date().toDateString(), pointCount, (pointCount / words.length) * 100);

    pointStat.innerText = `Words: ${score.hits} / ${words.length}`;
    percentStat.innerText = `Percentage: ${score.percentage.toFixed(2)}%`;

    playButton.innerText = "Start Again";
    overlay.style.display = "flex";

    music.currentTime = 0;
    music.volume = 1;

    timeLeft = 99;
    pointCount = 0;
    points.innerText = 0;
}

wordInput.addEventListener("keyup", processInput);
playButton.addEventListener("click", startGame);