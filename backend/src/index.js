// backend/src/index.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const Note = require('./models/note');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
)
.then(() => console.log('Base de datos conectada'))
.catch(err => console.log('Error al conectar mongodb:', err));

// Routes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

app.post('/notes', async (req, res) => {
  try {
    const newNote = new Note({
      content: req.body.content
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
