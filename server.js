import express from 'express';
import uuid from 'uuid-random';

const app = express();
app.use(express.static('client'));
app.listen(8080);

// message board app
// stage 4: An API route for every message

let results = [
  {
    id: '1',
    participantTimes: ['00:00:34', '00:00:56', '00:01:23'],
  },
  {
    id: '2',
    participantTimes: ['01:30:14', '01:35:18', '01:49:47'],
  },
];

function getResults(req, res){
    res.json(results);
}

function postResults(req, res){
    res.json(results);
}

app.get('/results', getResults);
app.post('/results', express.json(), postResults)
