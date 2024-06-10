
import React, { useState } from 'react';
import './LangPanel.css';

const LangPanel = ({ setLang }) => {
  const [activeLang, setActiveLang] = useState('English'); // State to store the active language
  const langMap = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Russian': 'ru'
  };

  const handleLangChange = (lang) => {
    setActiveLang(lang); // Update the active language state
    setLang({ full: lang, code: langMap[lang] }); // Update the language in the parent component
  };

  return (
    <div className='lang-panel-container'>
      <h2>Choose your language:</h2>
      <div className='button-container'>
        {Object.keys(langMap).map((lang) => (
          <button
            key={lang}
            className={`lang-button ${activeLang === lang ? 'active' : ''}`}
            onClick={() => handleLangChange(lang)}
          >
            {langMap[lang].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LangPanel;