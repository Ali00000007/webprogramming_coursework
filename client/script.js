const startTimerBtn = document.querySelector("#startTimer");
const timerDisplay = document.querySelector("#timerDisplay");
const resetTimerBtn = document.querySelector("#resetTimer");
const recordTimeBtn = document.querySelector("#recordTime");
const clearRaceBtn = document.querySelector("#clearRace");
const loadRacesBtn = document.querySelector("#loadRaces");
let recordedTimesList = document.querySelector("#recordedTimesList");
const saveRaceBtn = document.querySelector("#saveRace");
const idSendInput = document.querySelector("#idSend")
const clearScreenBtn = document.querySelector("#clearScreen");

let timerInterval;
let elapsedSeconds = 0;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startStopTimer() {
  const icon = startTimerBtn.querySelector("i");

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play"); // Switch to play icon
  } else {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause"); // Switch to pause icon
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }
}



function resetTimer(){
  elapsedSeconds = 0;
  timerDisplay.textContent = formatTime(elapsedSeconds);
}

let participant = 1

function recordTime() {
    const timeRecorded = document.createElement('p');
    timeRecorded.className = 'timeRecorded';
    timeRecorded.textContent = `Participant: ${participant} - ${formatTime(elapsedSeconds)}`;

    recordedTimesList.appendChild(timeRecorded);

    participant += 1;
}

function clearRace(){
  participant = 1
  document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
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

async function getSingleResult() {
  let idInput = document.querySelector("#idInput");
  let id = idInput.value.trim();
  const response = await fetch(`results/${id}`);
  if(response.ok){
    const result = await response.json();
    showResults([result]);
  }
  else{
    console.log("Race with that ID doesn not exist");
  }
}

let id = 3

async function postNewResults(){
  resetTimer();
  participant = 1;
  const participantTimes = Array.from(document.querySelectorAll('.timeRecorded')).map(el => el.textContent.split(' - ')[1]);

  const payload = { id: id.toString(), participantTimes };

  const response = await fetch('results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if(response.ok){
    const updatedResults = await response.json()
    document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
  }
  else{
    console.log("Failed to load messages");
  }
  id += 1
}

function clearScreen(){
  document.getElementById("resultsList").innerHTML = "";
  //document.getElementById("recordedTimesList").innerHTML = "";
}

startTimerBtn.addEventListener("click", startStopTimer);
resetTimerBtn.addEventListener("click", resetTimer);
recordTimeBtn.addEventListener("click", recordTime);
clearRaceBtn.addEventListener("click", clearRace);
loadRacesBtn.addEventListener("click", loadResults)
saveRaceBtn.addEventListener("click", postNewResults);
idSendInput.addEventListener("click", getSingleResult);
clearScreenBtn.addEventListener("click", clearScreen);
