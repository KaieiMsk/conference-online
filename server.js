const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let speakers = [];
let notes = [];

// Get speakers
app.get('/speakers', (req, res) => {
  res.json(speakers);
});

// Add or update speaker
app.post('/speakers', (req, res) => {
  const { country, crossedOut } = req.body;
  const existingSpeaker = speakers.find(speaker => speaker.country === country);
  if (existingSpeaker) {
    existingSpeaker.crossedOut = crossedOut;
  } else {
    speakers.push({ country, crossedOut });
  }
  res.json(speakers);
});

// Reset speakers
app.delete('/speakers', (req, res) => {
  speakers = [];
  res.json(speakers);
});

// Get notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// Add note
app.post('/notes', (req, res) => {
  const { country, text } = req.body;
  notes.push({ country, text });
  res.json(notes);
});

// Clear notes
app.delete('/notes', (req, res) => {
  notes = [];
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});