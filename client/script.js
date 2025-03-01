const startTimerBtn = document.querySelector("#startTimer");
const timerDisplay = document.querySelector("#timerDisplay");
const resetTimerBtn = document.querySelector("#resetTimer");
const recordTimeBtn = document.querySelector("#recordTime");
const clearRaceBtn = document.querySelector("#clearRace");
const loadRacesBtn = document.querySelector("#loadRaces");

let timerInterval;
let elapsedSeconds = 0;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startStopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startTimerBtn.textContent = "Start Timer";
  } else {
    startTimerBtn.textContent = "Stop Timer";
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }
}

function resetTimer(){
    elapsedSeconds = 0
    timerDisplay.textContent = formatTime(elapsedSeconds);
}

let participant = 1

function recordTime(){
    const timeRecorded = document.createElement("p");
    timeRecorded.className = "bananas";
    timeRecorded.id = "time"
    let time = document.createTextNode(formatTime(elapsedSeconds));
    timeRecorded.append(time);
    const participantNumber = document.createElement("p") 
    participantNumber.className = "participant"
    participantNumber.textContent = `Participant: ${participant}: ` + formatTime(elapsedSeconds);
    document.body.appendChild(participantNumber)
    participant += 1
}

function clearRace(){
    participant = 1
    let timeRecorded = document.querySelectorAll(".bananas").forEach(element => element.remove());
    let participants = document.querySelectorAll(".participant").forEach(element => element.remove())
}

function recordTime() {
    const timeRecorded = document.createElement('p');
    timeRecorded.className = 'timeRecorded';
    timeRecorded.textContent = `Participant: ${participant} - ${formatTime(elapsedSeconds)}`;

    document.body.appendChild(timeRecorded);

    participant += 1;
}


function clearRace(){
  participant = 1
  let timeRecorded = document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
  resetTimer();
  startStopTimer();
}

function showResults(results) {
  const list = document.querySelector("#resultsList");
  list.innerHTML = "";

  for (const result of results) {
    const li = document.createElement("li");
    
    const times = result.participantTimes.join(", ");
    li.textContent = `ID: ${result.id}, Participant Times: ${times}`;

    list.appendChild(li);
  }
}



async function loadResults(){
  const response = await fetch('results');
  let results;
  if(response.ok){
    results = await response.json();
  }
  else{
    results = "Failed to load results"
  }
  showResults(results);
}

async function postResults(){

}


startTimerBtn.addEventListener("click", startStopTimer);
resetTimerBtn.addEventListener("click", resetTimer);
recordTimeBtn.addEventListener("click", recordTime);
clearRaceBtn.addEventListener("click", clearRace);
loadRacesBtn.addEventListener("click", loadResults)
