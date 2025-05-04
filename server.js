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
