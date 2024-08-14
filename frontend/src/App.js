import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function fetchNotes(setNotes, showMessage) {
  return async () => {
    try {
      const response = await axios.get('http://localhost:5000/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      showMessage('Error en el servidor al obtener las notas', 'error');
    }
  };
}

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchData = fetchNotes(setNotes, showMessage);
    fetchData();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        await axios.post('http://localhost:5000/notes', { content: newNote });
        setNewNote('');
        const fetchData = fetchNotes(setNotes, showMessage);
        fetchData();
        showMessage('Nota agregada correctamente', 'success');
      } catch (error) {
        console.error('Error adding note:', error);
        showMessage('Error en el servidor al agregar la nota', 'error');
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      const fetchData = fetchNotes(setNotes, showMessage);
      fetchData();
      showMessage('Nota eliminada exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting note:', error);
      showMessage('Error en el servidor al eliminar la nota', 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000); // Clear message after 3 seconds
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bloc de Notas</h1>
        <div>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva nota..."
          />
          <button onClick={handleAddNote}>Añadir Nota</button>
        </div>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <span>{note.content}</span>
              <button onClick={() => handleDeleteNote(note._id)}>🗑</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
