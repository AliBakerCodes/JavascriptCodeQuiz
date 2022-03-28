//------------------------------->Variables<---------------------------------
var screen0Ele = document.querySelector("#screen0");
var screen0ButtonEle = screen0Ele.querySelector("#startGamebtn");
var screen1Ele = document.querySelector("#screen1");
var screen1ButtonEle = screen1Ele.querySelector("button");
var screen2Ele = document.querySelector("#screen2");
var screen2ButtonEle = screen2Ele.querySelector("button");
var screen3Ele = document.querySelector("#screen3");
var screen3ButtonEle = screen3Ele.querySelector("button");
var highScoresButtonEle = document.querySelector("#highScoresBtn");
var timerEle = document.querySelector("#timer");
var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#possibleAnswers");
var initialEl = document.querySelector("#inptInit");
var highScoresEl = document.querySelector("#highScoresEl");
var messageEl = document.querySelector("#message");
var finalScoreEl=document.querySelector("#finalScore");
var highScoresMsg=document.querySelector("#highScoresMsg");
var timeLeft;
var timeInterval;

var HIDE_CLASS = "hide";

var storedHighScores =[];

function quizGameObj(initials, score)  {
        this.initials = initials;
        this.score = score;
    }

var questions = [
  {
    question: "Which Legend's passive ability is the ability to fly using jets?",
    answers: ["Octane", "Gibraltar", "Revenant", "Valkarie"],
    answer: 3
  },
  {
    question: "What map is not in the current rotation (Season 12)?",
    answers: ["Kings Canyon", "Storm Pointe", "World's Edge", "Olympus"],
    answer: 2
  },
  {
    question: "What is Octane's Ultimate Ability?",
    answers: ["Stim to run faster", "Jump Pad", "Steal Teamate's loot", "Smoke"],
    answer: 1
  },
  {
    question: "Which Legend over-explains every time she pings an item?",
    answers: ["Bangalore", "Loba", "Mad Maggie", "Horizon"],
    answer: 0
  },
  {
    question: "Which Legend is meme-famouse for 'Mozambique Here!'?",
    answers: ["Bloodhound", "Horizon", "Caustic", "Lifeline"],
    answer: 3
  },
  {
    question: "Which Legend was obviously inspired by 'Old Town Road' rapper 'Lil Nas X'?",
    answers: ["Seer", "Octane", "Mirage", "Fuse"],
    answer: 0
  },
  {
    question: "Which Lengend drops a minature 'Nessie' when emoting?",
    answers: ["Pathfinder", "Ash", "Watson", "Crypto"],
    answer: 2
  },
  {
    question: "Which weapon is NOT in the current Season (Season 12) Care Package?",
    answers: ["Spitfire", "Volt SMG", "Alternator", "G7 Scout"],
    answer: 2
  },
  {
      //Intentional trick question. Mirage deploys holographic clones to distract from the real
      //Mirage. You get "bamboozled" when you shoot a clone and it disappears
      //All the answers are right, but only one is the real one, to "Bamboozle" the player!
    question: "*Trick Question* Which Legend is famous for deploying clones to 'Bamboozle?'",
    answers: ["Mirage", "Mirage", "Mirage", "Mirage"],
    answer: 3
  },
  {
    question: "Which Legend is the goto choice for sweats and will hot drop, get knocked, and immediately disconnect?",
    answers: ["Loba", "Wraith", "Rampart", "Lifeline"],
    answer: 1
  },
];
var currentQuestion = 0;
//These are the elements that will change with state change.
var dynamicElements = [
  screen0Ele,
  screen1Ele,
  screen2Ele,
  screen3Ele,
//   timerEle,
  highScoresButtonEle
];


//------------------------------->Functions<---------------------------------
//Initial function, runs on page load, will set the listeners and fetch saved 
//High score data
function init() {
  setEventListeners();
  populateHighScores ();
}

//Stores the game in localStorage
function storeGame() {
    localStorage.setItem("storedHighScores", JSON.stringify(storedHighScores));
  }

 //New game function. Resets the current question, creates the new game object
 //Populates the question content on screen 1. Starts the timer 
function newGame(){
    currentQuestion=0;
    currentGame = new quizGameObj("",0);
    populateQuestion(currentQuestion);
    countdown();
}

//Checks if the answer is correct. Passes to right wrong function
function checkAnswer(currentQuestion, answerID) {
    console.log("answerID: " + answerID);
   console.log("answer object:")
    console.log(questions[currentQuestion]['answer']);
    if (answerID==questions[currentQuestion]['answer']) {
        right(true);
    } else {
        right(false);
    }
}

//If right advance the score. If wrong, decrement the score and take off 5 secs
//Display the right or wrong message
// Scoring change made to be more like the mock-up where score=timeleft
function right(right) {
    if (right) {
        console.log("Before score: " + currentGame["score"])
        console.log("After score: " + currentGame["score"])
        displayMessage("right");
    } else {
        displayMessage("wrong");
        timeLeft=timeLeft-5
    }
}

//Handles all messaging to the user. Right, wrong, no saved data, saved data found
function displayMessage(message) {
    switch (message) {
    case "right": 
        messageEl.textContent = "Correct Answer! Good Job";
        break;
    case "wrong":
      messageEl.textContent = "Wrong Answer Sorry Fam";
        break;
    case "noHigh":
        highScoresMsg.textContent = "Be the first to Score!";
        highScoresMsg.classList.remove(HIDE_CLASS);
        break;
    case "high":
        highScoresMsg.classList.add(HIDE_CLASS);
        break;
  }
}

//Switches between set states by hiding or unhiding screens based on
//where we are in the game. Runs functions on a per state basis
function setState(state) {
    console.log("State: " + state)
    switch (state) {
    case 1:
        newGame();
      break;
    case 2:
        setFinalScore()
        break;
    case 3:
        populateHighScores();
        break;
    default:
      break;
  }

  //Here is where we use the data-states attribute to show or hide 
  //based on state
  dynamicElements.forEach(function (ele) {
    var possibleStatesAttr = ele.getAttribute("data-states");
    var possibleStates = JSON.parse(possibleStatesAttr);
    if (possibleStates.includes(state)) {
      ele.classList.remove(HIDE_CLASS);
    } else {
      ele.classList.add(HIDE_CLASS);
    }
  });
}

//Populates the question and possible answers as a list
function populateQuestion() {
  var questionObj = questions[currentQuestion];
  answersEl.innerHTML = "";
  questionEl.textContent = questionObj.question;
  for (i=0;i< questionObj.answers.length; i++) {
    var answer =  questionObj.answers[i];
    var li = document.createElement("li");
    li.setAttribute("data-index",i);
    li.textContent = answer;
    answersEl.appendChild(li);
  };
}

//Display the final score
function setFinalScore() {
    finalScoreEl.textContent=currentGame.score;
}

//Get initials and pair with score and write to storage
function setInitials (finalScore) {
    currentGame["initials"]=initialEl.value;
    storedHighScores.push(currentGame);
    storeGame();

}

//Populates the High score page with stored game data
//or show a message if first visit and no data found
function populateHighScores () {
    console.log("Getting High Scores")
    console.log("storedHighScores before:")
    console.log(storedHighScores);
    storedHighScores=JSON.parse(localStorage.getItem("storedHighScores"));
    console.log("storedHighScores after:")
    console.log(storedHighScores); 
    highScoresEl.innerHTML=""
    var tbl = document.createElement("table");
    var tblh=document.createElement("thead")
    var tblBody = document.createElement("tbody");
    var c, r
    r = tbl.insertRow(0);
    c=r.insertCell(0);
    c.innerHTML="<h2>Initials</h2>";
    c=r.insertCell(1);
    c.innerHTML="<h2>Score</h2>"
    if (storedHighScores !== null){
        storedHighScores=storedHighScores.sort((a, b) => (a.score - b.score) ? -1 : 1);
        console.log("High Scores Present")
        displayMessage("high");
    storedHighScores.forEach(function (gameobj, index) {
        console.log("[" + index + "]: " + gameobj.initials);
        var c, r
        r = tbl.insertRow(index+1);
        c=r.insertCell(0);
        c.innerHTML=gameobj.initials
        c=r.insertCell(1);
        c.innerHTML=gameobj.score
        highScoresEl.appendChild(tbl);
        });
    } else {
        console.log("No High Scores Present")
        displayMessage("noHigh");
        storedHighScores=[];
    }
}

//The timer. If the timer reaches 0, Game Over!
function countdown() {
      timeLeft = 30;
      timeInterval = setInterval(function () {
        currentGame["score"]=timeLeft;
      if (timeLeft > 1) {
        timerEle.textContent = timeLeft + " seconds remaining";
        timeLeft--;
      } else if (timeLeft === 1) {
        timerEle.textContent = timeLeft + " second remaining";
        timeLeft--;
      } else {
        timerEle.textContent = "";
        clearInterval(timeInterval);
        setState(2);
      }
    }, 1000);
  }
  
//------------------------------->Events<---------------------------------
//All of the listeners in one function. The button clicks all advance the state
//Sets a listener on the UL element since the LI element is dynamically created
//and destroyed. Clicking on the LI elements is how you choose the possible answer

function setEventListeners() {
  screen0ButtonEle.addEventListener("click", function () {
    setState(1);
  });
  screen2ButtonEle.addEventListener("click", function () {
    setInitials(currentGame.score);
    setState(3);
  });
  highScoresButtonEle.addEventListener("click", function () {
    setState(3);
  });
  screen3ButtonEle.addEventListener("click", function () {
    setState(0);
  });
  answersEl.addEventListener("click", function (evt) {
    var target = evt.target;
    if (target.matches("li")) {
        checkAnswer(currentQuestion,target.getAttribute("data-index"));
    if (currentQuestion === questions.length-1) {
        console.log("Game Ended:All questions answered");
 clearInterval(timeInterval);
        setState(2);
    } else {
        currentQuestion++;
        populateQuestion(currentQuestion)
    }
    }
  });
//Adding a Listener here to still go to state 3 if the user
//hits the enter key instead of clicking submit
document.addEventListener("submit", function(event) {
        event.preventDefault
        console.log("Enter Pressed")
        setInitials(currentGame.score);
        setState(3);
  });
}

//Call init function and set the stage for first page load
init();