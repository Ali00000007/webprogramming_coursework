const startTimerBtn = document.querySelector("#startTimer");
const timerDisplay = document.querySelector("#timerDisplay");
const resetTimerBtn = document.querySelector("#resetTimer");
const recordTimeBtn = document.querySelector("#recordTime");
const clearRaceBtn = document.querySelector("#clearRace");
const loadRacesBtn = document.querySelector("#loadRaces");
let recordedTimesList = document.querySelector("#recordedTimesList");
const saveRaceBtn = document.querySelector("#saveRace");
const idSendInput = document.querySelector("#idSend");
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
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startTimerBtn.textContent = "▶️ Start";
  } else {
    startTimerBtn.textContent = "⏸️ Stop";
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

let participantData = [];
let participant = 1;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function recordTime() {
  const nameInput = document.querySelector("#participantName");
  const customLabel = nameInput.value.trim();
  const label = customLabel !== "" ? customLabel : `Participant ${participant}`;
  const time = formatTime(elapsedSeconds);

  // Check if the participant ID already exists
  const existingIndex = participantData.findIndex(p => p.id === participant);

  const participantEntry = {
    id: participant,
    name: label,
    time: time
  };

  if (existingIndex !== -1) {
    // Update the existing entry
    participantData[existingIndex] = participantEntry;
  } else {
    // Push new entry
    participantData.push(participantEntry);
  }

  // Create a container for the recorded time and name
  const timeRecorded = document.createElement('div');
  timeRecorded.className = 'timeRecorded';
  timeRecorded.setAttribute('data-id', participant); // Assign an ID for editing later

  const timeText = document.createElement('span');
  timeText.className = 'timeText';
  timeText.textContent = `${label} - ${time}`;

  timeRecorded.setAttribute('data-time', time);

  const editButton = document.createElement('button');
  editButton.className = 'editButton';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editParticipantName(timeRecorded, label));

  timeRecorded.appendChild(timeText);
  timeRecorded.appendChild(editButton);

  recordedTimesList.appendChild(timeRecorded);

  participant += 1;
  nameInput.value = "";
}


function editParticipantName(timeRecorded, oldName) {
  const timeText = timeRecorded.querySelector('.timeText');
  
  // Replace the name text with an input field to edit
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = oldName;
  
  // Replace the time text with the input field
  timeRecorded.replaceChild(nameInput, timeText);

  // Change the "Edit" button to "Save"
  const saveButton = document.createElement('button');
  saveButton.className = 'saveButton';
  saveButton.textContent = 'Save';
  
  // Replace the "Edit" button with the "Save" button
  saveButton.addEventListener('click', () => saveParticipantName(timeRecorded, nameInput.value));
  timeRecorded.replaceChild(saveButton, timeRecorded.querySelector('.editButton'));
}

function saveParticipantName(timeRecorded, newName) {
  const nameInput = timeRecorded.querySelector('input');
  
  // Retrieve the original time stored in the 'data-time' attribute
  const originalTime = timeRecorded.getAttribute('data-time');
  
  // Create a new span for the time and name
  const timeText = document.createElement('span');
  timeText.className = 'timeText';
  timeText.textContent = `${newName} - ${originalTime}`;

  // Replace the input field with the new name and original time
  timeRecorded.replaceChild(timeText, nameInput);

  // Replace the "Save" button back to the "Edit" button
  const editButton = document.createElement('button');
  editButton.className = 'editButton';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editParticipantName(timeRecorded, newName));
  timeRecorded.replaceChild(editButton, timeRecorded.querySelector('.saveButton'));

  // Update the participant data in the `participantData` array
  const participantId = timeRecorded.getAttribute('data-id');
  const participantIndex = participantData.findIndex(p => p.id === parseInt(participantId));
  if (participantIndex !== -1) {
    participantData[participantIndex].name = newName;
  }
}



function clearRace(){
  participant = 1;
  document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
  resetTimer();
  startStopTimer();
}

function showResults(results) {
  const list = document.querySelector("#resultsList");
  list.innerHTML = "";

  for (const result of results) {
    if (!Array.isArray(result.participants) || result.participants.length === 0) {
      continue; // Skip results with no participant data
    }

    const li = document.createElement("li");
    const header = document.createElement("div");
    header.textContent = `ID: ${result.id}`;
    li.appendChild(header);

    const sublist = document.createElement("ul");
    for (const p of result.participants) {
      const subitem = document.createElement("li");
      subitem.textContent = `${p.name} (${p.time})`;
      sublist.appendChild(subitem);
    }
    li.appendChild(sublist);

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

let id = 1;

async function postNewResults() {
  console.log("Posting to local storage");
  resetTimer();
  participant = 1;

  const payload = {
    id: id.toString(),
    participants: participantData
  };

  const response = await fetch('results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const updatedResults = await response.json();
    document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
    participantData = [];
  } else {
    console.log("Failed to load messages");
  }

  id += 1;
}

async function postResultsToDatabase() {
  console.log("Posting to database");
  resetTimer();
  participant = 1;

  const payload = {
    id: id.toString(), 
    participants: participantData 
  };

  const response = await fetch('/results/db', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log("Results posted successfully.");
  } else {
    console.log("Failed to post results.");
  }
}

function checkOnlineStatus(){
  console.log("Online status:", navigator.onLine);

  if (navigator.onLine){
    postResultsToDatabase();
  }
  else{
    postNewResults();
  }
}

async function loadresultsdb() {
  const response = await fetch(`/allresults`);
  let results;
  if (response.ok){
    results = await response.json();
  } else {
    results = "Failed to load results";
  }
  showResults(results);
}

function checkOnlineStatusForLoadResults(){
  console.log("Online status:", navigator.onLine);

  if (navigator.onLine){
    loadresultsdb();
  }
  else{
    loadResults();
  }
}

function clearScreen(){
  document.getElementById("resultsList").innerHTML = "";
  //document.getElementById("recordedTimesList").innerHTML = "";
}

startTimerBtn.addEventListener("click", startStopTimer);
resetTimerBtn.addEventListener("click", resetTimer);
recordTimeBtn.addEventListener("click", recordTime);
clearRaceBtn.addEventListener("click", clearRace);
loadRacesBtn.addEventListener("click", checkOnlineStatusForLoadResults);
saveRaceBtn.addEventListener("click", checkOnlineStatus);
clearScreenBtn.addEventListener("click", clearScreen);