"use strict";

import Score from "./Score.js";

const timer = document.getElementById("timer");
const points = document.getElementById("points");
const display = document.getElementById("display");
const wordInput = document.getElementById("word-input");
const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("message");
const overlayPointStat = document.getElementById("point-stat");
const overlayPercentStat = document.getElementById("percent-stat");
const overlayPlayButton = document.getElementById("play-btn");

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

let wordsCopy;
let currentWord;
let letterElements = [];
let timeLeft;
let timerID;
let pointCount;

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
    timeLeft = 99;
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

            setTimeout(function() {
                const score = new Score(new Date().toDateString(), pointCount, (pointCount / words.length) * 100);

                overlayPointStat.innerText = `Words: ${score.hits} / ${words.length}`;
                overlayPercentStat.innerText = `Percentage: ${score.percentage.toFixed(2)}%`;
                overlayPlayButton.innerText = "Start Again";
                overlay.style.display = "flex";

                music.currentTime = 0;
                music.volume = 1;
            }, 2000);
        }
    }, 200);
}

wordInput.addEventListener("keyup", processInput);
overlayPlayButton.addEventListener("click", startGame);