import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();
app.use(express.static('client'));
app.listen(8080);

let db;


const dbPromise = open({
  filename: path.resolve('data', 'database.sqlite'),
  driver: sqlite3.Database,
});

let results = [
];

// returns all the results from local storage
function getResults(req, res){
    res.json(results);
}

// returns the result of a single race from local storage

function getResult(req, res){
  for (const result of results) {
    if(result.name === req.params.name){
      res.json(result);
      return;
    }
  }
  // if the race name doesnt exist, an error message is sent back
  res.status(404).send("No match for that ID");
}

// posts the results of a race to local storge

function postResults(req, res) {
  const newResult = {
    id: req.body.id,
    name: req.body.name,
    participants: req.body.participants
  };
  // checks if the race name already exists
  for (const result of results) {
    if(result.name === req.body.name){
      return res.status(400).json({ error: 'Name already exists' }); 
    }
  } 
  console.log(newResult);
  results.push(newResult);
  res.json(results);
}


// route for getting a single result by name from local storage
app.get('/results/name/:name', getResult)

// route for getting all results from local storage
app.get('/results', getResults);

// route for posting a race to local storage
app.post('/results', express.json(), postResults)

// route for posting a race to the database
app.post('/results/db', express.json(), async (req, res) => {
  try {
    const { name, participants } = req.body;
    const db = await dbPromise;
    // ensures at least 1 participant is provided along with a race name
    if (!name || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request body. Ensure 'name' and 'participants' are provided." });
    }
    
    // uses a select query to check if a race already exists with the name the user has typed in
    const existingRace = await db.get('SELECT * FROM races WHERE name = ?', name);
    if (existingRace) {
      return res.status(400).json({ success: false, message: "Race name already exists." });
    }

    // uses insert query to insert the race name into the database
    const result = await db.run('INSERT INTO races (name) VALUES (?)', name);
    const raceId = result.lastID;

    // loops through each participant sent to the server and saves each participant to the database
    const stmt = await db.prepare('INSERT INTO results (race_id, race_name, name, time) VALUES (?, ?, ?, ?)');
    for (const p of participants) {
      await stmt.run(raceId, name, p.name, p.time);
    }

    await stmt.finalize();

    res.status(201).json({ success: true, message: "Race results saved to database" });
  } catch (error) {
    console.error("Error posting to DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// retrieves all the results from the database
app.get('/allresults', async (req, res) => {
  try {
    const db = await dbPromise;
    
    // selects all the races and saves them into a races variable
    const races = await db.all('SELECT * FROM races');
    const raceResults = [];

    // selects all the races
    for (const race of races) {
      const participants = await db.all('SELECT * FROM results WHERE race_id = ?', race.id);
      // formats the results
      raceResults.push({
        name: race.name,
        participants: participants.map(p => ({
          name: p.name,
          time: p.time
        }))
      });
    }

    res.json(raceResults);
  } catch (error) {
    console.error("Error fetching races from DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// gets a race from the database using an inputted name 
app.get('/results/db/name/:name', async (req, res) => {
  try {
    const db = await dbPromise;
    const raceName = req.params.name;

    // selects from the races table where the name matches the inputted name
    const race = await db.get('SELECT * FROM races WHERE name = ?', raceName);
    if (!race) {
      // returns an error message if no such race exists
      return res.status(404).json({ success: false, message: "Race not found" });
    }

    // selects the participants from the race with the selected name
    const participants = await db.all('SELECT * FROM results WHERE race_id = ?', race.id);

    // formats the results
    res.json({
      name: race.name,
      participants: participants.map(p => ({
        name: p.name,
        time: p.time
      }))
    });
  } catch (error) {
    console.error("Error fetching race from DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
