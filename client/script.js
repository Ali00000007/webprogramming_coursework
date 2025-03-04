const startTimerBtn = document.querySelector("#startTimer");
const timerDisplay = document.querySelector("#timerDisplay");
const resetTimerBtn = document.querySelector("#resetTimer");
const recordTimeBtn = document.querySelector("#recordTime");
const clearRaceBtn = document.querySelector("#clearRace");
const loadRacesBtn = document.querySelector("#loadRaces");
let recordedTimesList = document.querySelector("#recordedTimesList");
const saveRaceBtn = document.querySelector("#saveRace");

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

async function getSingleResult(id){
  const response = await fetch('results/', + id.stringify());
  let result;
  if(response.ok){
    results = await response.json()
    for (const element of results) {
      if(element.id === id){
        result = element
      }
    }
  }
  return result;
}

let id = 3

async function postNewResults(){
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
    console.log(payload);
    loadResults();
  }
  else{
    console.log("Failed to load messages");
  }

  id += 1
}


startTimerBtn.addEventListener("click", startStopTimer);
resetTimerBtn.addEventListener("click", resetTimer);
recordTimeBtn.addEventListener("click", recordTime);
clearRaceBtn.addEventListener("click", clearRace);
loadRacesBtn.addEventListener("click", loadResults)
saveRaceBtn.addEventListener("click", postNewResults);
