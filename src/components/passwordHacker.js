import React, { useState, useEffect } from 'react';
import '../styles/PasswordHacker.css'
import {Container, FormControl  } from 'react-bootstrap';

const PasswordHacker = () => {
    const [inputValue, setInputValue] = useState(() => {
        const storedInputValue = sessionStorage.getItem('inputValue');
        return storedInputValue ? storedInputValue : ('');
    });
    const [words, setWords] = useState([]);
    const [likelinessOptions, setLikelinessOptions] = useState({});
    const [optimalWord, setOptimalWord] = useState('')
    const [showWords, setShowWords] = useState(false)

useEffect(() => {
    if (words.length > 0) {
        setOptimalWord(findOptimalWord(words));
    }
}, [words]);

useEffect(() => {
    sessionStorage.setItem("inputValue", inputValue)
}, [inputValue]);

const handleHack = () => {
    if(inputValue.length === 0 ){
        alert("No words in password list");
        return
    }
    
    // Capture the input value
    const inputWords = inputValue
    .toUpperCase()
    .split(/[\s\n]+/) // Split by any whitespace or new line
    .filter(word => word.trim().length > 0); // Remove empty strings

    // Check if all words have the same length
    const wordLength = inputWords[0]?.length || 0;
    const allSameLength = inputWords.every(word => word.length === wordLength);

    if (!allSameLength) {
        alert("All words must be the same length!");
        return;
    }

    // Proceed with the rest of the logic if the words are valid
    setWords(inputWords);
    generateLikelinessButtons(inputWords);
    setOptimalWord(findOptimalWord(inputWords));
    setShowWords(true);
}

const handleEdit = () => {
    setShowWords(false);
};

const handleReset = () => {
    if(window.confirm("Clear all words and start again?")) {
        setInputValue('');
        setWords([]);
        setShowWords(false)
    }
    sessionStorage.removeItem("inputValue")
}

const generateLikelinessButtons = (wordList) => {
    let options = {};
    wordList.forEach(word => {
        let possibleLikeliness = new Set();
        wordList.forEach(otherWord => {
            if (word !== otherWord) {
                possibleLikeliness.add(compareWords(word, otherWord));
            }
        });
        options[word] = [...possibleLikeliness].sort((a, b) => a - b);
    });
    setLikelinessOptions(options);
};

const checkPassword = (word, likeliness) => {
    if (word && !isNaN(likeliness)) {
        const filteredWords = words.filter(w => compareWords(word, w) === likeliness);
        setWords(filteredWords);
        generateLikelinessButtons(filteredWords);
    }
};

const compareWords = (word1, word2) => {
    let score = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] === word2[i]) {
            score++;
        }
    }
    return score;
};

const findOptimalWord = (words) => {
    let bestWord = '';
    let fewestRemainingWords = Infinity;
    let minWorstCase = Infinity;

    words.forEach(word => {
        let likelinessMap = new Map();

        words.forEach(otherWord => {
            if (word !== otherWord) {
                const likeliness = compareWords(word, otherWord);
                if (likelinessMap.has(likeliness)) {
                    likelinessMap.set(likeliness, likelinessMap.get(likeliness) + 1);
                } else {
                    likelinessMap.set(likeliness, 1);
                }
            }
        });

        // Sort scenarios by the number of remaining words (ascending)
        const remainingWordsScenarios = Array.from(likelinessMap.values()).sort((a, b) => a - b);

        // Find the worst-case scenario for this word
        let currentWorstCase = Math.max(...remainingWordsScenarios);

        if (currentWorstCase < fewestRemainingWords) {
            fewestRemainingWords = currentWorstCase;
            minWorstCase = remainingWordsScenarios;
            bestWord = word;
        } else if (currentWorstCase === fewestRemainingWords) {
            // Tie-breaking: compare worst cases and then subsequent cases
            for (let i = 0; i < remainingWordsScenarios.length; i++) {
                if (remainingWordsScenarios[i] < minWorstCase[i]) {
                    minWorstCase = remainingWordsScenarios;
                    bestWord = word;
                    break;
                } else if (remainingWordsScenarios[i] > minWorstCase[i]) {
                    break;
                }
            }
        }
    });

    return bestWord;
};

return (
<div className="passwordHacker-main">

    <span className="title passwordHacker">HACK PASSWORD</span>
    
    <Container>
    {!showWords ? (
        <Container className="input-section">
            <span className="input-title">Enter words</span>
            <FormControl
                id="words"
                as="textarea"
                rows={4}
                cols={50}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter words separated by spaces or returns"
                className="textarea"
            />
                <div className="control-buttons">
                    <button onClick={() => handleHack()}>Hack</button>
                    <button onClick={() => handleReset()}>Reset</button>
                </div>
        </Container>
    ):(
        <Container className="word-map">
            {words.map((word, index) => (
                <div key={index} className={`word-item`}>
                    <span className={`word ${word === optimalWord ? "optimal" : ""}`}>{word}</span>
                    <div className="likeliness-buttons">
                        {(likelinessOptions[word] || []).map((likeliness, idx) => (
                            <button key={`${word}-${likeliness}-${idx}`} onClick={() => checkPassword(word, likeliness)}>
                                {likeliness}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
                <div className="control-buttons">
                    <button onClick={() => handleEdit()}>Edit</button>
                    <button onClick={() => handleReset()}>Reset</button>
                </div>
        </Container>
    )}
    </Container>

</div>
);
};

export default PasswordHacker;
