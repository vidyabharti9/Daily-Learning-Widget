import React, { useState, useEffect } from 'react';
import './App.css';
import facts from './facts.json';

function App() {
  const subjects = ['physics', 'chemistry', 'biology', 'astronomy'];
  const initialSubject = localStorage.getItem('selectedSubject') || 'physics';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [factIndex, setFactIndex] = useState(0);
  const [learnedFacts, setLearnedFacts] = useState(() => {
    const savedFacts = localStorage.getItem('learnedFacts');
    return savedFacts ? JSON.parse(savedFacts) : {};
  });
  const [bookmarkedFacts, setBookmarkedFacts] = useState(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedFacts');
    return savedBookmarks ? JSON.parse(savedBookmarks) : {};
  });
  const [learned, setLearned] = useState(false);
  const [level, setLevel] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const factsPerLevel = 5;

  // Fetch a random fact based on the selected subject
  const getRandomFact = (subject) => {
    const factsForSubject = facts[subject];
    if (factsForSubject && factsForSubject.length > 0) {
      const randomIndex = Math.floor(Math.random() * factsForSubject.length);
      setFactIndex(randomIndex);
      setLearned(false);
    }
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    localStorage.setItem('selectedSubject', subject);
    getRandomFact(subject);
  };

  useEffect(() => {
    getRandomFact(selectedSubject);
  }, [selectedSubject]);

  const handleMarkAsLearned = () => {
    const fact = facts[selectedSubject][factIndex];
    if (!learnedFacts[selectedSubject]?.includes(fact)) {
      setLearnedFacts((prev) => {
        const updatedFacts = {
          ...prev,
          [selectedSubject]: [...(prev[selectedSubject] || []), fact],
        };
        localStorage.setItem('learnedFacts', JSON.stringify(updatedFacts));
        return updatedFacts;
      });
    }
    setLearned(true);
  };

  const handleDeleteBookmark = (factToDelete) => {
    setBookmarkedFacts((prev) => {
      const updatedBookmarks = { ...prev };
      if (Array.isArray(updatedBookmarks[selectedSubject])) {
        updatedBookmarks[selectedSubject] = updatedBookmarks[selectedSubject].filter(
          (fact) => fact.trim() !== factToDelete.trim()
        );
        if (updatedBookmarks[selectedSubject].length === 0) {
          delete updatedBookmarks[selectedSubject];
        }
        localStorage.setItem('bookmarkedFacts', JSON.stringify(updatedBookmarks));
      }
      return updatedBookmarks;
    });
  };

  const handleClearHistory = () => {
    setLearnedFacts({});
    localStorage.removeItem('learnedFacts');
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const currentFactsLearned = Object.values(learnedFacts).flat().length;
  const progress = (currentFactsLearned / (level * factsPerLevel)) * 100;

  useEffect(() => {
    if (currentFactsLearned >= level * factsPerLevel) {
      setLevelCompleted(true);
      const timer = setTimeout(() => {
        setLevel((prev) => prev + 1);
        setLearnedFacts({});
        setLevelCompleted(false);
        getRandomFact(selectedSubject);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentFactsLearned, level, selectedSubject]);

  const isBookmarked = bookmarkedFacts[selectedSubject]?.includes(facts[selectedSubject][factIndex]);

  const handleBookmark = () => {
    const fact = facts[selectedSubject][factIndex];
    if (!isBookmarked) {
      setBookmarkedFacts((prev) => {
        const updatedBookmarks = {
          ...prev,
          [selectedSubject]: [...(prev[selectedSubject] || []), fact],
        };
        localStorage.setItem('bookmarkedFacts', JSON.stringify(updatedBookmarks));
        return updatedBookmarks;
      });
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <h1>Daily Learning Widget</h1>
        <div className="chip-container">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`chip ${selectedSubject === subject ? 'active' : ''}`}
              onClick={() => handleSubjectChange(subject)}
            >
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </button>
          ))}
          <button onClick={() => setSettingsOpen(true)} className="icon-button">⚙️</button>
          <button onClick={handleToggleDarkMode} className="icon-button">
            {darkMode ? '🌞' : '🌜'}
          </button>
        </div>
      </div>

      <div className="fact-container">
        <h2>{selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Fact</h2>
        <p>{facts[selectedSubject][factIndex]}</p>
        <button className={`mark-learned-button ${learned ? 'learned' : ''}`} onClick={handleMarkAsLearned} disabled={learned}>
          {learned ? 'Learned' : 'Mark as Learned'}
        </button>
        <button onClick={handleBookmark} className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`} disabled={isBookmarked}>
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        {learned && <p className="snackbar">Fact marked as learned!</p>}
      </div>

      <div className="bookmarked-facts">
        <h3>Bookmarked Facts</h3>
        {Object.entries(bookmarkedFacts).length > 0 ? (
          Object.entries(bookmarkedFacts).map(([subject, facts]) => (
            subjects.includes(subject) && (
              <div key={subject}>
                <h4>{subject.charAt(0).toUpperCase() + subject.slice(1)}:</h4>
                <ul>
                  {facts.map((fact, index) => (
                    <li key={index}>
                      {fact}
                      <button onClick={() => handleDeleteBookmark(fact)} className="delete-button">🗑️</button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))
        ) : (
          <p>No bookmarks yet.</p>
        )}
      </div>

      {levelCompleted && (
        <div className="congratulations-message">
          <h2>Congrats! You have successfully learned Level {level}!</h2>
        </div>
      )}

      {settingsOpen && (
        <div className={`settings-dialog ${darkMode ? 'dark' : ''}`}>
          <h3>Settings</h3>
          <h4>Learned Facts:</h4>
          {subjects.map((subject) => (
            <div key={subject}>
              <h5>{subject.charAt(0).toUpperCase() + subject.slice(1)}:</h5>
              <ul>
                {learnedFacts[subject]?.map((fact, index) => (
                  <li key={index}>{fact}</li>
                )) || <li>No facts learned yet.</li>}
              </ul>
            </div>
          ))}
          <button onClick={handleClearHistory}>Clear History</button>
          <button onClick={() => setSettingsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
