import React, { useState } from "react";
import { ScrollToSection } from "./ScrollToSection";
import LangPanel from "./LangPanel";

export const InputScreen = ({ heroes, heroIdx }) => {
    const [greetText, setGreetText] = useState("");
    const [responseText, setResponseText] = useState("");
    const [language, setLanguage] = useState({ full: 'English', code: 'en' }); 

	function createVideoPlayer(videoUrl) {
        let video = document.createElement("video");
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.id = "heroVideo";
        videoPlayerDiv.innerHTML = ""; // Clear the video player div
        videoPlayerDiv.appendChild(video);
    }

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

    const handleGenerateButtonClick = (e) => {
        e.preventDefault();
        generateGreeting();
    };

    const handleGetVideoButtonClick = (e) => {
        e.preventDefault();
        const phrase = greetText; 
        const persona = heroes[heroIdx].name; 
        const lang = language.code;

        

        fetch('http://localhost:5052/w2l_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': "*/*"
            },
            body: JSON.stringify({
                "text": phrase,
                "persona": persona,
                "language": lang,
                "face_restorer": "None",
            })
        })
        .then(response => {
            if (!response.ok) {
               
                throw new Error('Network response was not ok');
            }
            return response.blob(); 
        })
        .then(blob => {
            
            const heroImg = document.getElementById("heroImage");
            if (heroImg) {
                heroImg.remove();
            }
            const videoUrl = URL.createObjectURL(blob);
            createVideoPlayer(videoUrl); 
        })
        .catch(error => {
          
            console.error('Error:', error);
        });
    };

    return (
        <div className="screen-2-container">
            <div className="img-hero">
                <img id="heroImage" src={heroes[heroIdx].image} alt={heroes[heroIdx].name} />
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
                    <LangPanel setLang={setLanguage} /> 
                    <button className="generate-button" type="button" onClick={handleGenerateButtonClick}>Generate Greeting</button>
                    <textarea 
                        className="response-text"
                        value={responseText} 
                        readOnly 
                    />
                    <button className="generate-button" type="button" onClick={handleGetVideoButtonClick}>Get Video</button> 
                </div>
                <div className="scroll-container">
                    <ScrollToSection idx={1} type={'UP'} />
                </div>
            </div>
        </div>
    );
};
