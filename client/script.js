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

// Updates the connectionStatus paragraph to show the current online status

async function updateOnlineStatus() {
      const statusElement = document.getElementById("connectionStatus");

      if (navigator.onLine) {
        statusElement.textContent = "online";
        statusElement.style.color = "green";
      } else {
        statusElement.textContent = "offline";
        statusElement.style.color = "red";
      }
    }

window.addEventListener('load', updateOnlineStatus);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// formats the time into hh:mm:ss

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// starts and stops the timer
// the start/stop button updates with each click

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


// resets the timer back to 0 

function resetTimer(){
  elapsedSeconds = 0;
  timerDisplay.textContent = formatTime(elapsedSeconds);
}


// used for sending data to the server for offline functionality 
let participantData = [];

// participant id which is incremented for each participant recorded
let participant = 1;

// Record the time of a participant when the record time button is pressed

function recordTime() {
  const nameInput = document.querySelector("#participantName");
  const customLabel = nameInput.value.trim(); // gets the participant name from the input box and trims the value to remove spaces at the end
  const label = customLabel !== "" ? customLabel : `Participant ${participant}`; 
  const time = formatTime(elapsedSeconds); // gets the current time from the format time function to save next to the participant 

  const existingIndex = participantData.findIndex(p => p.id === participant); 

  const participantEntry = {
    id: participant,
    name: label,
    time: time
  };

  // checks if a participant with that id already exists in the list

  if (existingIndex !== -1) {
    participantData[existingIndex] = participantEntry;
  } else {
    participantData.push(participantEntry);
  }

  const timeRecorded = document.createElement('div');
  timeRecorded.className = 'timeRecorded';
  timeRecorded.setAttribute('data-id', participant);

  const timeText = document.createElement('span');
  timeText.className = 'timeText';
  timeText.textContent = `${label} - ${time}`;

  timeRecorded.setAttribute('data-time', time);

  // creates an edit button for every participant as it's created every time a new time is recorded

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

// allows admin to edit the participants name after recording it

function editParticipantName(timeRecorded, oldName) {
  const timeText = timeRecorded.querySelector('.timeText');
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = oldName;
  
  timeRecorded.replaceChild(nameInput, timeText);

  const saveButton = document.createElement('button');
  saveButton.className = 'saveButton';
  saveButton.textContent = 'Save';
  
  saveButton.addEventListener('click', () => saveParticipantName(timeRecorded, nameInput.value));
  timeRecorded.replaceChild(saveButton, timeRecorded.querySelector('.editButton'));
}

// saves the new name from the input box

function saveParticipantName(timeRecorded, newName) {
  const nameInput = timeRecorded.querySelector('input');
  
  const originalTime = timeRecorded.getAttribute('data-time');
  
  const timeText = document.createElement('span');
  timeText.className = 'timeText';
  timeText.textContent = `${newName} - ${originalTime}`;

  timeRecorded.replaceChild(timeText, nameInput);

  const editButton = document.createElement('button');
  editButton.className = 'editButton';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editParticipantName(timeRecorded, newName));
  timeRecorded.replaceChild(editButton, timeRecorded.querySelector('.saveButton'));

  const participantId = timeRecorded.getAttribute('data-id');
  const participantIndex = participantData.findIndex(p => p.id === parseInt(participantId));
  if (participantIndex !== -1) {
    participantData[participantIndex].name = newName;
  }
}

// removes all the recorded times to clear the race

function clearRace(){
  participant = 1;
  document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
  resetTimer();
  startStopTimer();
}

// loops through the results (if the results list is bigger than 0) and displays the results

function showResults(results) {
  const list = document.querySelector("#resultsList");
  list.innerHTML = "";

  for (const result of results) {
    if (result.participants.length === 0) {
      continue;
    }
    
    const li = document.createElement("li");
    const header = document.createElement("div");
    header.textContent = `Race Name: ${result.name}`;
    li.appendChild(header);

    const exportButton = document.createElement("button");
    exportButton.textContent = "Export to CSV";
    exportButton.addEventListener("click", () => exportToCSV(result));
    li.appendChild(exportButton);

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

// exports a set of results to csv

function exportToCSV(result) {
  const headers = ["Participant Name", "Time"];
  const rows = result.participants.map(p => [p.name, p.time]);

  rows.unshift(headers);

  const csvContent = rows.map(row => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, `${result.name}.csv`);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = `${result.name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// loads the results from the server and calls the showResults() function to display it

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

// posts the race to the server (offline)

async function postNewResults() {
  console.log("Posting to local storage");
  resetTimer();
  participant = 1;

  const raceName = document.querySelector("#raceName").value.trim(); 

  if (!raceName) {
    alert("Please provide a race name.");
    return;
  }

  const payload = {
    id: id.toString(),
    name: raceName,
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
    document.querySelector("#raceName").value = ""; 
  } else {
    const errorData = await response.json();
    document.getElementById('error-message').innerText = errorData.error;
    document.getElementById('error-message').style.display = 'block';
    console.log("Failed to post to local storage");
  }

  id += 1;
}


// posts results to the server (online)

async function postResultsToDatabase() {
  console.log("Posting to database");
  resetTimer();
  participant = 1;

  const raceName = document.querySelector("#raceName").value.trim();

  if (!raceName) {
    alert("Please provide a race name.");
    return;
  }

  const payload = {
    name: raceName,
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
  document.querySelector("#raceName").value = ""; 
  document.querySelectorAll(".timeRecorded").forEach(element => element.remove());
  }else {
    const errorData = await response.json();
    document.getElementById('error-message').innerText = errorData.message;
    document.getElementById('error-message').style.display = 'block';
    console.log("Failed to post results.");
  }
}

// checks the online status to see whether the race should be saved to the database or local storage

function checkOnlineStatus(){
  console.log("Online status:", navigator.onLine);

  if (navigator.onLine){
    postResultsToDatabase();
  }
  else{
    postNewResults();
  }
}

// loads the results from the database and calls showResults() to display the results

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

// checks the online status to determine whether to load the results from the database or local storage

function checkOnlineStatusForLoadResults(){
  console.log("Online status:", navigator.onLine);

  if (navigator.onLine){
    loadresultsdb();
  }
  else{
    loadResults();
  }
}

// clears the screen

function clearScreen(){
  document.getElementById("resultsList").innerHTML = "";
}

startTimerBtn.addEventListener("click", startStopTimer);
resetTimerBtn.addEventListener("click", resetTimer);
recordTimeBtn.addEventListener("click", recordTime);
clearRaceBtn.addEventListener("click", clearRace);
loadRacesBtn.addEventListener("click", checkOnlineStatusForLoadResults);
saveRaceBtn.addEventListener("click", checkOnlineStatus);
clearScreenBtn.addEventListener("click", clearScreen);