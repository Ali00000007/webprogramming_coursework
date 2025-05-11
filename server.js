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

function getResults(req, res){
    res.json(results);
}

function getResult(req, res){
  for (const result of results) {
    if(result.name === req.params.name){
      res.json(result);
      return;
    }
  }
  res.status(404).send("No match for that ID");
}

function postResults(req, res) {
  const newResult = {
    id: req.body.id,
    name: req.body.name,
    participants: req.body.participants
  };
  for (const result of results) {
    if(result.name === req.body.name){
      return res.status(400).json({ error: 'Name already exists' }); 
    }
  } 
  console.log(newResult);
  results.push(newResult);
  res.json(results);
}



app.get('/results/name/:name', getResult)
app.get('/results', getResults);
app.post('/results', express.json(), postResults)
app.post('/results/db', express.json(), async (req, res) => {
  try {
    const { name, participants } = req.body;
    const db = await dbPromise;

    if (!name || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request body. Ensure 'name' and 'participants' are provided." });
    }

    const existingRace = await db.get('SELECT * FROM races WHERE name = ?', name);
    if (existingRace) {
      return res.status(400).json({ success: false, message: "Race name already exists." });
    }

    const result = await db.run('INSERT INTO races (name) VALUES (?)', name);
    const raceId = result.lastID;

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

app.get('/allresults', async (req, res) => {
  try {
    const db = await dbPromise;
    
    const races = await db.all('SELECT * FROM races');
    const raceResults = [];

    for (const race of races) {
      const participants = await db.all('SELECT * FROM results WHERE race_id = ?', race.id);
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

app.get('/results/db/name/:name', async (req, res) => {
  try {
    const db = await dbPromise;
    const raceName = req.params.name;

    const race = await db.get('SELECT * FROM races WHERE name = ?', raceName);
    if (!race) {
      return res.status(404).json({ success: false, message: "Race not found" });
    }

    const participants = await db.all('SELECT * FROM results WHERE race_id = ?', race.id);

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
