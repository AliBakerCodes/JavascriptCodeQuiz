//------------------------------->Variables<---------------------------------
var screen0Ele = document.querySelector("#screen0");
var screen0ButtonEle = screen0Ele.querySelector("button");
var screen1Ele = document.querySelector("#screen1");
var screen1ButtonEle = screen1Ele.querySelector("button");
var screen2Ele = document.querySelector("#screen2");
var screen2ButtonEle = screen2Ele.querySelector("button");
var highScoresButtonEle = document.querySelector("#highScores");
var timerEle = document.querySelector("#timer");
var timerTextEle = document.querySelector("#timerTxt");
var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#possibleAnswers");
var initialEl = document.querySelector("#inptInit");
var highScoresEl = document.querySelector("#highScoresUL");
var messageEl = document.querySelector("#message");
var finalScoreEl=document.querySelector("#finalScore")
var timeLeft;

var HIDE_CLASS = "hide";

var storedHighScores =[];

//   const quizGameObj ={
//     initials: "",
//     score: 0
// }

function quizGameObj(initials, score)  {
        this.initials = initials;
        this.score = score;
    }



var questions = [
  {
    question: "What house was Harry Potter in?",
    answers: ["Gryffindoor", "Ravenclaw", "Slytherin", "Hufflepuff"],
    answer: 0
  },
  {
    question: "What was Hermione's cat's name?",
    answers: ["Crookshanks", "Peter Pettigrew", "Scabbers", "Harry"],
    answer: 0
  }
];
var currentQuestion = 0;

var dynamicElements = [
  screen0Ele,
  screen1Ele,
  screen2Ele,
  timerTextEle,
  timerEle,
  highScoresButtonEle
];


//------------------------------->Functions<---------------------------------

function init() {

  setEventListeners();
}

function storeGame() {
    localStorage.setItem("storedHighScores", JSON.stringify(storedHighScores));
  }

function newGame(){
    currentGame = new quizGameObj("",0)
}

function checkAnswer(currentQuestion, answerID) {
    console.log(answerID);
   console.log(questions[currentQuestion]['answer']);
    if (answerID==questions[currentQuestion]['answer']) {
        right(true);
    } else {
        right(false)
    }
}

function right(right) {
    if (right) {
        currentGame["score"]++
        displayMessage("right");
    } else {
        currentGame["score"]--
        displayMessage("Wrong");
        timeLeft=timeLeft-5
    }
}
function displayMessage(message) {
    if (message=="right") {
      messageEl.textContent = "Correct Answer! Good Job";
    } else {
      messageEl.textContent = "Wrong Answer Sorry Fam";
    }
  }

function setState(state) {
  switch (state) {
    case 1:
        newGame();
        populateQuestion(currentQuestion)
      break;
    case 2:
        setInitials(currentGame.score)
        break;
    case 3:
        populateHighScores();
        break;
    default:
      break;
  }

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

function populateQuestion() {
  var questionObj = questions[currentQuestion];
  // Remove the current list items
  answersEl.innerHTML = "";
  questionEl.textContent = questionObj.question;
  for (i=0;i< questionObj.answers.length; i++) {
    var answer =  questionObj.answers[i];
    var li = document.createElement("li");
    li.setAttribute("data-index",i);
    li.textContent = answer;
    answersEl.appendChild(li);
  };
//   if (currentQuestion === questions.length - 1) {
//     currentQuestion = 0;
//   } else {
//     currentQuestion++;
//   }
}

function setInitials (finalScore) {
    currentGame["initials"]=initialEl.value;
    finalScore=currentGame["score"];
    finalScoreEl.textContent=finalScore;
    storedHighScores.push(currentGame);
    storeGame();

}

function populateHighScores () {
    storedHighScores=localStorage.getItem("storedHighScores");

}

function countdown() {
      timeLeft = 30;
      timeInterval = setInterval(function () {
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

function setEventListeners() {
  screen0ButtonEle.addEventListener("click", function () {
    setState(1);
  });
//   screen1ButtonEle.addEventListener("click", function () {
//     setState(2);
//   });
  screen2ButtonEle.addEventListener("click", function () {
    setState(3);
  });
  highScoresButtonEle.addEventListener("click", function () {
    setState(3);
  });
  // Notice we are placing the event listener on the UL element.
  // This is because the UL element is never destroyed whereas
  // the list elements are always destroyed and re-created. We would
  // need to add the event listeners to the list items
  // every time we created one.
  answersEl.addEventListener("click", function (evt) {
    var target = evt.target;
    if (target.matches("li")) {
        checkAnswer(currentQuestion,target.getAttribute("data-index"));
        console.log(currentQuestion)
    if (currentQuestion === questions.length-1) {
        console.log("Last Question");
        checkAnswer(currentQuestion,target.getAttribute("data-index"));
        setState(2);
    } else {
        currentQuestion++;
        populateQuestion(currentQuestion)
    }
    }
  });
}

init();