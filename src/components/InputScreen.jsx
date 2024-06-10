import React, { useState } from "react";
import { ScrollToSection } from "./ScrollToSection";
import LangPanel from "./LangPanel";

export const InputScreen = ({ heroes, heroIdx }) => {
    const [greetText, setGreetText] = useState("");
    const [responseText, setResponseText] = useState("");
    const [language, setLanguage] = useState({ full: 'English', code: 'en' }); // Состояние для языка

    const generateGreeting = () => {
        const requestData2 = {
            "model": "llama3_local",
            "messages": [
                {
                    "role": "system",
                    "content": `You are ${heroes[heroIdx].name}, use ${language.full} language for answer, use less than 50 words for answer, do not use emojies or hashtags.`
                },
                {
                    "role": "user",
                    "content": greetText
                }
            ],
            "max_tokens": 100,
            "temperature": 0.3,
            "stop": ["#"],
            "num_predict": 99,
            "top_p": 0.5,
            "top_k": 25,
            "presence_penalty": 0.5
        };

        fetch('/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData2)
        })
        .then(response => response.json())
        .then(responseJson => {
            const text = responseJson.choices[0].message.content.trim();
            const words = text.split(' ');

            let displayText = "";
            words.forEach((word, index) => {
                setTimeout(() => {
                    displayText += (index > 0 ? ' ' : '') + word;
                    setResponseText(displayText);
                }, index * 15);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            setResponseText("Error fetching or parsing data from server. Please try again.");
        });
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        generateGreeting();
    };

    return (
        <div className="screen-2-container">
            <div className="img-hero">
                <img src={heroes[heroIdx].image} alt={heroes[heroIdx].name} />
                <div className="hero-details">
                    <div className="titel-container">
                        <h1 className="hero-name">{heroes[heroIdx].name}</h1>
                    </div>
                </div>
            </div>
            <div className="input-screen">
                <div className="communication-with-user">
                    <textarea 
					className="prompt"
                        placeholder="prompt" 
                        value={greetText} 
                        onChange={(e) => setGreetText(e.target.value)} 
                    />
                    <LangPanel setLang={setLanguage} /> {/* Передача функции setLanguage */}
                    <button className="generate-button" type="button" onClick={handleButtonClick}>Generate Greeting</button>
                    <textarea 
                        className="response-text"
                        value={responseText} 
                        readOnly 
                    />
                    <button className="generate-button" type="button">Get Video</button> {/* Добавлен тип кнопки */}
                </div>
                <div className="scroll-container">
                    <ScrollToSection idx={1} type={'UP'} />
                </div>
            </div>
        </div>
    );
};
