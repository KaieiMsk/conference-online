document.addEventListener('DOMContentLoaded', () => {
    const representingCountrySelect = document.getElementById('representing-country-select');
    const countrySelect = document.getElementById('country-select');
    const countryCrossoutSelect = document.getElementById('country-crossout-select');
    const addSpeakerButton = document.getElementById('add-speaker');
    const crossoutSpeakerButton = document.getElementById('crossout-speaker');
    const crossoutNextSpeakerButton = document.getElementById('crossout-next-speaker');
    const resetSpeakerListButton = document.getElementById('reset-speaker-list');
    const speakerList = document.getElementById('speaker-list');
    const sendNoteButton = document.getElementById('send-note');
    const noteInput = document.getElementById('note-input');
    const notesList = document.getElementById('notes-list');
    const clearNotesButton = document.getElementById('clear-notes');

    const API_URL = 'http://localhost:3000';

    // Load speaker list from server
    const loadSpeakers = async () => {
        const response = await fetch(`${API_URL}/speakers`);
        const speakers = await response.json();
        speakerList.innerHTML = '';
        speakers.forEach(speaker => {
            const listItem = document.createElement('li');
            listItem.textContent = speaker.country;
            listItem.setAttribute('data-country', speaker.country);
            if (speaker.crossedOut) {
                listItem.classList.add('crossed-out');
                listItem.style.textDecoration = 'line-through';
            }
            speakerList.appendChild(listItem);
        });
    };

    // Save speaker to server
    const saveSpeaker = async (country, crossedOut) => {
        await fetch(`${API_URL}/speakers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country, crossedOut })
        });
        loadSpeakers();
    };

    // Reset speaker list on server
    const resetSpeakers = async () => {
        await fetch(`${API_URL}/speakers`, {
            method: 'DELETE'
        });
        loadSpeakers();
    };

    // Load notes from server
    const loadNotes = async () => {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();
        notesList.innerHTML = '';
        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.textContent = `${note.country}: ${note.text}`;
            notesList.appendChild(listItem);
        });
    };

    // Save note to server
    const saveNote = async (country, text) => {
        await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ country, text })
        });
        loadNotes();
    };

    // Clear notes on server
    const clearNotes = async () => {
        await fetch(`${API_URL}/notes`, {
            method: 'DELETE'
        });
        loadNotes();
    };

    // Update country selects based on representing country selection
    if (representingCountrySelect) {
        representingCountrySelect.addEventListener('change', () => {
            const selectedCountry = representingCountrySelect.value;
            if (countrySelect) countrySelect.value = selectedCountry;
            if (countryCrossoutSelect) countryCrossoutSelect.value = selectedCountry;
        });
    }

    if (addSpeakerButton) {
        addSpeakerButton.addEventListener('click', () => {
            const selectedCountry = representingCountrySelect.value;
            const existingSpeakers = document.querySelectorAll(`#speaker-list li[data-country="${selectedCountry}"]`);
            const crossedOutSpeakers = Array.from(existingSpeakers).filter(speaker => speaker.classList.contains('crossed-out'));

            if (existingSpeakers.length === 0 || (crossedOutSpeakers.length > 0 && existingSpeakers.length === crossedOutSpeakers.length)) {
                saveSpeaker(selectedCountry, false);
            } else {
                alert('This country is already in the speaker list.');
            }
        });
    }

    if (crossoutSpeakerButton) {
        crossoutSpeakerButton.addEventListener('click', () => {
            const selectedCountry = countryCrossoutSelect.value;
            const existingSpeaker = document.querySelector(`#speaker-list li[data-country="${selectedCountry}"]`);

            if (existingSpeaker) {
                saveSpeaker(selectedCountry, true);
            } else {
                alert('This country is not in the speaker list.');
            }
        });
    }

    if (crossoutNextSpeakerButton) {
        crossoutNextSpeakerButton.addEventListener('click', () => {
            const nextSpeaker = speakerList.querySelector('li:not(.crossed-out)');
            if (nextSpeaker) {
                saveSpeaker(nextSpeaker.getAttribute('data-country'), true);
            } else {
                alert('All speakers are already crossed out.');
            }
        });
    }

    if (resetSpeakerListButton) {
        resetSpeakerListButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the speaker list?')) {
                resetSpeakers();
            }
        });
    }

    if (sendNoteButton) {
        sendNoteButton.addEventListener('click', () => {
            const noteText = noteInput.value.trim();
            const selectedCountry = representingCountrySelect.value;
            if (noteText) {
                saveNote(selectedCountry, noteText);
                noteInput.value = '';
            } else {
                alert('Please enter a note.');
            }
        });
    }

    if (clearNotesButton) {
        clearNotesButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all notes?')) {
                clearNotes();
            }
        });
    }

    // Load speakers and notes on page load
    loadSpeakers();
    loadNotes();
});