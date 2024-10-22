import React, { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import './App.css';
import { FaCog, FaSun, FaMoon } from 'react-icons/fa'; 

const App = () => {
  const [facts, setFacts] = useState([]);
  const [currentFact, setCurrentFact] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Biology');
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [darkTheme, setDarkTheme] = useState(false); 
  const [showSettings, setShowSettings] = useState(false); 

  // Load facts from JSON file
  useEffect(() => {
    fetch('/facts.json') // Ensure the path is correct
      .then(res => res.json())
      .then(data => {
        setFacts(data);
        if (data.length > 0) {
          setCurrentFact(data[0]); // Set the first fact initially
        }
      });
  }, []);

  // Select a new fact when the subject changes
  useEffect(() => {
    const filteredFacts = facts.filter(fact => fact.subject === selectedSubject);
    setCurrentFact(filteredFacts[0]);
  }, [selectedSubject, facts]);

  const markAsLearned = () => {
    if (currentFact && !history.includes(currentFact.fact)) {
      const newProgress = progress + (100 / 10); // Increment by 10% for each learned fact (assuming max level is 10)
      
      setProgress(newProgress >= 100 ? 0 : newProgress); // Reset progress at 100%
      
      if (newProgress >= 100) {
        setLevel(level + 1); // Increase level if progress reaches 100%
      }
      
      setHistory([...history, currentFact.fact]);
    }
  };
  
  const addBookmark = () => {
    if (currentFact && !bookmarks.includes(currentFact.fact)) {
      setBookmarks([...bookmarks, currentFact.fact]);
    }
  };

  const removeBookmark = (factToRemove) => {
    setBookmarks(bookmarks.filter(fact => fact !== factToRemove));
  };

  const toggleTheme = () => {
    setDarkTheme(prevTheme => !prevTheme); // Toggle dark/light theme
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings); // Toggle settings modal
  };

  return (
    <div className={`App ${darkTheme ? 'dark' : 'light'}`}>
      <div className="container">
        <div className="top-bar">
          <h1>Daily Learning Widget</h1>
          <div className="icons">
            <FaCog className="icon" onClick={toggleSettings} />
            {darkTheme ? <FaSun className="icon" onClick={toggleTheme} /> : <FaMoon className="icon" onClick={toggleTheme} />}
          </div>
        </div>
  
        {showSettings && (
          <div className="settings-modal">
            <h2>Settings</h2>
            <label>
              Choose Subject:
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Psychology">Psychology</option> {/* Added Psychology */}
                <option value="Geology">Geology</option> {/* Added Geology */}
                <option value="Astrobiology">Astrobiology</option> {/* Added Astrobiology */}
              </select>
            </label>
            <h3>History</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
  
        {currentFact && (
          <div className="fact-section">
            <h2>{currentFact.subject}</h2>
            <p>{currentFact.fact}</p>
            <button onClick={markAsLearned}>Mark as Learned</button>
            <button onClick={addBookmark}>Bookmark</button>
          </div>
        )}
  
        <ProgressBar progress={progress} />
        <h2>Level: {level}</h2>
  
        <div className="level-section">
          <h2>Your Level: {level}</h2>
        </div>
  
        <div className="bookmarks">
          <h2>Bookmarked Facts</h2>
          <ul>
            {bookmarks.map((bookmark, index) => (
              <li key={index}>
                {bookmark}
                <button className="delete-btn" onClick={() => removeBookmark(bookmark)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
