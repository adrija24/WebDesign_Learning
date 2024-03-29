const typing_ground = document.querySelector("#textInput");
const btn = document.querySelector("#myButton");
const score = document.querySelector("#score");
const showTime = document.querySelector("#showTime");
const timeDetails = document.querySelector("#timeDetails");
const textDisplay = document.getElementById("textDisplay");
const accuracyText = document.querySelector("#accuracy");
const showTimeContainer = document.querySelector("#showTimeContainer");

let startTime, endTime, totalTimeTaken, button, textDisplayLength;
let accuracyCount = 0;

//Speed Test & Show Timer function
let intervalID,
  elpasedTime = 0;
const showTimer = () => {
  showTimeContainer.style.display = "block";
  if (btn.innerHTML === "Done") {
    intervalID = setInterval(() => {
      elpasedTime++;
      showTime.innerHTML = elpasedTime;
    }, 1000);
  } else if (btn.innerHTML === "Start") {
    clearInterval(intervalID);
    document.getElementById("showTime").style.display = "none";
    let timeInMin = Math.round(elpasedTime / 60);
    let timeInSec = elpasedTime % 60;

    if (elpasedTime <= 59) {
      timeDetails.innerHTML = `Total time is ${elpasedTime} sec`;
    } else {
      timeDetails.innerHTML = `Total time is ${timeInMin} min ${timeInSec} sec`;
    }
  }
};

//calculateTypingSpeed function
const calculateTypingSpeed = (time_taken) => {
  let totalWords = typing_ground.value.trim();
  let actualWords = totalWords === "" ? 0 : totalWords.split(" ").length;
  if (actualWords !== 0) {
    let typing_speed = (actualWords / time_taken) * 60;
    typing_speed = Math.round(typing_speed);
    score.innerHTML = `Speed(WPM): ${typing_speed}`;
    let lengthCount = textDisplay.innerText.length;
    let accuracyResult = Math.round((accuracyCount / lengthCount) * 100);
    accuracyText.innerHTML = `Accuracy: ${accuracyResult} %`;
  } else {
    score.innerHTML = `0`;
  }
};

//startTyping function
const startTyping = () => {
  let date = new Date();
  startTime = date.getTime();
  btn.innerHTML = "Done";
  showTimer();
  console.log(startTime)

  //checking correct & incorrect with the input characters
  typing_ground.addEventListener("input", () => {
    const arrayQuote = textDisplay.querySelectorAll("span");
    const arrayValue = typing_ground.value.split("");
    accuracyCount = 0;
    arrayQuote.forEach((characterSpan, index) => {
      const character = arrayValue[index];
      if (character == null) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.remove("incorrect");
      } else if (character === characterSpan.innerText) {
        characterSpan.classList.add("correct");
        characterSpan.classList.remove("incorrect");
        accuracyCount++;
      } else {
        characterSpan.classList.remove("correct");
        characterSpan.classList.add("incorrect");
      }
    });
    //checking the length of the typing_ground & textDisplay to disable the typing ground
    if (arrayValue.length === textDisplay.innerText.length) {
      typing_ground.setAttribute("disabled", "true");
      btn.setAttribute("disabled", "true");
      btn.classList.remove("hover:text-white", "hover:py-1.5", "hover:px-3.5");
      btn.style.cssText = `
      background: #BDDAFF; 
    `;
      endTypingTest();
    }
  });
};

//endTypingTeset
const endTypingTest = () => {
  btn.innerHTML = "Start";
  showTimer();
  if (typing_ground.length == textDisplay.length) {
    typing_ground.setAttribute("disabled", "true");
  }

  let date = new Date();
  endTime = date.getTime();
  totalTimeTaken = (endTime - startTime) / 1000;
  calculateTypingSpeed(totalTimeTaken);
  typing_ground.value = "";
};

//cheking the innerText of button
btn.addEventListener("click", () => {
  switch (btn.innerText.toLowerCase()) {
    case "start":
      typing_ground.removeAttribute("disabled");
      startTyping();
      break;
    case "done":
      typing_ground.setAttribute("disabled", "true");
      endTypingTest();
      break;
  }
});

// enabling start typing using 'Spacebar'
var hasExecuted = false;
document.body.onkeyup = function (e) {
  if ((e.key === " " || e.code === "Space" || e.keyCode === 32) && !hasExecuted) {
    typing_ground.removeAttribute("disabled");
    typing_ground.focus();
    startTyping();
    hasExecuted = true;
  }
};


//Paragraph fetch
function paragraph() {
  const numberOfSentences = 3; // Specify the number of sentences you want

  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://metaphorpsum.com/sentences/${numberOfSentences}`,
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = xhr.responseText;
      textDisplay.innerHTML = "";
      // Taking character from the actual quote To check correct & incorrect words
      response.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        characterSpan.style.cssText = `
        margin: 1px;
        `;
        textDisplay.appendChild(characterSpan);
      });
    }
  };
  xhr.send();
}
