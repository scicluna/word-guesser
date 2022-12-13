//Declare our Doms
import {words} from "./wordbank.js"
const startButton = document.querySelector("#start-game")
const wordSpot = document.querySelector("#word")
let winCount = document.querySelector("#wins")
let loseCount = document.querySelector("#losses")
const resetButton = document.querySelector("#reset")
const timeCount = document.querySelector("#timer")
const logArea = document.querySelector("#log-area")

//Some useful variables
let timeTicking = false
let endFlag = false
let wins = localStorage.getItem("wins")
let losses = localStorage.getItem("losses")
let randomWord;
let timerInterval;
let goodEnuff;
let randomArray;
let logs = JSON.parse(localStorage.getItem("logs"))
displayLogs();
if (!wins){
    wins = 0
}
if (!losses){
    losses = 0
}

if (!logs){
    logs = []
}

//Displaying wins/losses from last time
winCount.innerText = wins
loseCount.innerText = losses

//Start the game when we press start
startButton.addEventListener("click", function(event) {
    startGame();
})

//Give us a random word
function wordRandomizer (){
    let randomNumber = Math.floor(Math.random()*words.length)
    return words[randomNumber]
}

//Determining which indexes must die
function numberOfSplices(arr, splices){
    let deathIndexes = []
    for (let i=0; i<splices; i++){
        let randomIndex = Math.floor(Math.random() * arr.length)
        if (!deathIndexes.includes(randomIndex)){
            deathIndexes.push(randomIndex)
        }
    }
    return deathIndexes
}

//Actually start the game
function startGame(){
    if(endFlag === false){
        losses++
        loseCount.innerText = losses
    }
    resetState()
    randomWord = wordRandomizer()
    randomArray = randomWord.split('')
    let splices = Math.ceil(Math.random()*(randomArray.length/4))
    let deadIndexes = numberOfSplices(randomArray, splices)

    //Make those dead indexes actually dead
    for (let i=0; i<deadIndexes.length;i++){
        for (let j=0; j<randomArray.length;j++){
            if (j === deadIndexes[i]){
                randomArray[j] = "_"
            }
        }
    }
    //actually amending the text at any given time
    wordSpot.innerText = randomArray.join('')
    if (timeTicking === false){
        timeTaker();
    }
}

//keep track of time and cause a loss if time hits 0
function timeTaker(){
    timeTicking = true
        timerInterval = setInterval(function(){
        timeCount.innerText--
        if(timeCount.innerText <= 0){
            loseGame()
            clearInterval(timerInterval)
            timeTicking = false
            return
        }
        if(endFlag === true){
            clearInterval(timerInterval)
            timeTicking = false
            return
        }
    }, 1000)
}

//Listen to keypresses -- only added after startgame is pressed
document.addEventListener("keydown", function(e){
    //records what key we pressed
    let key = e.key
    //logic over the array - basically replace first _ with key
    if (key !== "Enter"){
        console.log(key)
        for (let i=0;i<randomArray.length;i++){
            let current = randomArray[i]
            if(current === "_"){
                randomArray[i] = key
                wordSpot.innerText = randomArray.join('')
                //check for victory and losses or just continue the game
                if(randomArray.join('') === randomWord){
                    winGame()
                } else if (words.includes(randomArray.join(''))){
                    goodEnough()
                } else if (!randomArray.join('').includes("_")){
                    loseGame()
                } else return
            }
        }
    }
})

//if wins, tally a win and pause the game
function winGame(){ 
    endFlag = true
    wins++
    winCount.innerText = wins
    wordSpot.setAttribute("style", "letter-spacing: 0px; color: green")
    wordSpot.innerText = `You win! The answer was ${randomWord}`
    logs.unshift(wordSpot.innerText)
    saveResults()
}

//if loses, tally a loss and pause the game
function loseGame(){
    endFlag = true
    losses++
    loseCount.innerText = losses
    wordSpot.setAttribute("style", "letter-spacing: 0px; color: red")
    wordSpot.innerText = `You lose! The answer was ${randomWord}`
    logs.unshift(wordSpot.innerText)
    saveResults()
}

function goodEnough(){
    goodEnuff = randomArray.join('')
    endFlag = true
    wins++
    winCount.innerText = wins
    wordSpot.setAttribute("style", "letter-spacing: 0px; color: green")
    wordSpot.innerText = `The word was ${randomWord}, but ${goodEnuff} was close enough!`
    logs.unshift(wordSpot.innerText)
    saveResults()
}

//after a game ends, reset the state to a playable one
function resetState(){
    wordSpot.innerText = ""
    timeCount.innerText = 10
    timeTicking=false
    clearInterval(timerInterval)
    endFlag = false
    wordSpot.setAttribute("style", "letter-spacing: 15px")
    logArea.textContent = ''
    displayLogs();
}

//after a game ends, save the results to local storage
function saveResults(){
    localStorage.setItem("wins", wins)
    localStorage.setItem("losses", losses)
    localStorage.setItem("logs", JSON.stringify(logs))
}

function displayLogs(){
    if (logs.length > 20){
        logs.pop()
    }
    for (let i=0 ; i<logs.length ; i++){
        let current = logs[i]
        let newLi = document.createElement('LI');
        if(current.includes("win")){
            newLi.style.color = "green"
        }
        if(current.includes("lose")){
            newLi.style.color = "red"
        }
        if(current.includes("close")){
            newLi.style.color = "yellow"
        }
        let liContent = document.createTextNode(current)
        newLi.appendChild(liContent);
        logArea.appendChild(newLi)
    }
}





resetButton.addEventListener("click",(e)=>{
    resetState()
    logs = []
    wins = []
    losses = []
    winCount.innerText = wins
    loseCount.innerText = losses
})


//Make a log of past results
