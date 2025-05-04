import express from 'express';
import uuid from 'uuid-random';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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
    if(result.id === req.params.id){
      res.json(result);
      return;
    }
  }
  res.status(404).send("No match for that ID");
}

function postResults(req, res) {
  const newResult = {
    id: req.body.id,
    participants: req.body.participants
  };

  results.push(newResult);
  res.json(results);
}


app.get('/results/:id', getResult)
app.get('/results', getResults);
app.post('/results', express.json(), postResults)
app.post('/results/db', express.json(), async (req, res) => {
  try {
    const participants = req.body.participants;
    const db = await dbPromise;

    const result = await db.run('INSERT INTO races DEFAULT VALUES');
    const raceId = result.lastID; 

    const stmt = await db.prepare('INSERT INTO results (race_id, name, time) VALUES (?, ?, ?)');

    for (const p of participants) {
      await stmt.run(raceId, p.name, p.time); 
    }

    await stmt.finalize();

    res.status(201).json({ success: true, message: "Race results saved to database" });
  } catch (error) {
    console.error("Error posting to DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


