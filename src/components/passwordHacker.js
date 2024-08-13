import React, { useState, useEffect } from 'react';
import '../App.css';
import {Container, Image, Table, Button, ButtonGroup, ButtonToolbar, FormControl  } from 'react-bootstrap';

const PasswordHacker = () => {
    const [words, setWords] = useState([]);
    const [possiblePasswords, setPossiblePasswords] = useState([]);
    const [likelinessOptions, setLikelinessOptions] = useState({});
    const [optimalWord, setOptimalWord] = useState('')

    const handleWordsInput = (e) => {
        
    //     const value = e.target.value.toUpperCase();
    //     const inputWords = value.split(/\s+/).filter(word => word.length > 0);

    //     const lastChar = value[value.length - 1];

    //     if (lastChar === ' ' || lastChar === '\n') {
    //     const wordLength = inputWords[0]?.length || 0;
    //     const allSameLength = inputWords.every(word => word.length === wordLength);

    //     if (!allSameLength) {
    //         alert("All words must be the same length!");
    //     } else {
    //         setWords(inputWords);
    //         setPossiblePasswords(inputWords);
    //     }
    // }
    const inputWords = e.target.value
    .toUpperCase() // Convert to uppercase
    .split(/[\s\n]+/) // Split by any whitespace or new line
    .filter(word => word.trim().length > 0); // Remove empty strings

// Check if all words have the same length
const wordLength = inputWords[0]?.length || 0;
const allSameLength = inputWords.every(word => word.length === wordLength);

if (!allSameLength) {
    alert("All words must be the same length!");
}

setWords(inputWords);
setPossiblePasswords(inputWords);
    };
    
    useEffect(() => {
        if (words.length > 0) {
            // generateLikelinessButtons(words);
            setOptimalWord(findOptimalWord(words));
        }
    }, [words]);
    const [showWords, setShowWords] = useState(false)
    const [inputValue, setInputValue] = useState('');

    const handleHack = () => {
        if(inputValue.length === 0 ){
            alert("No words in word list");
            return
        }
        // if (words.length > 0) {
        //     generateLikelinessButtons(words);
        //     setOptimalWord(findOptimalWord(words));
        //     setShowWords(true);
        // }
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
    return; // Exit the function if the words are not the same length
}

// Proceed with the rest of the logic if the words are valid
setWords(inputWords);
setPossiblePasswords(inputWords);
generateLikelinessButtons(inputWords); // Assuming this function exists and works as needed
setOptimalWord(findOptimalWord(inputWords)); // Assuming this function exists and works as needed
setShowWords(true); 
// if (inputWords.length > 0) {
//     generateLikelinessButtons(inputWords);
//     setOptimalWord(findOptimalWord(inputWords));
//     setShowWords(true);
// }
    }

    const handleEdit = () => {
        setShowWords(false); // Show the FormControl container for editing
    };


    const handleReset = () => {
            setInputValue('');    
            setWords([]);
            setShowWords(false)
            // document.getElementById("words").value = "";
            // generateLikelinessButtons();
            // setOptimalWord(findOptimalWord());
            // setShowWords(false);
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
            options[word] = [...possibleLikeliness].sort((a, b) => a - b); // Sort in ascending order
        });
        setLikelinessOptions(options);
    };

    const checkPassword = (word, likeliness) => {
        if (word && !isNaN(likeliness)) {
            const filteredWords = words.filter(w => compareWords(word, w) === likeliness);
            setWords(filteredWords);
            setPossiblePasswords(filteredWords);
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
        // let bestWord = '';
        // let fewestRemainingWords = Infinity;
    
        // words.forEach(word => {
        //     let worstCaseRemainingWords = 0;
    
        //     // Collect all possible likeliness scores
        //     const likelinessScores = new Set();
        //     words.forEach(otherWord => {
        //         if (word !== otherWord) {
        //             likelinessScores.add(compareWords(word, otherWord));
        //         }
        //     });
    
        //     // Calculate the worst-case number of remaining words for each likeliness score
        //     likelinessScores.forEach(likeliness => {
        //         if (word && !isNaN(likeliness)) {
        //             const filteredWords = words.filter(w => compareWords(word, w) === likeliness);
        //             worstCaseRemainingWords = Math.max(worstCaseRemainingWords, filteredWords.length);
        //         }
        //     });
    
        //     // Update the best word if this one results in fewer remaining words in the worst-case scenario
        //     if (worstCaseRemainingWords < fewestRemainingWords) {
        //         fewestRemainingWords = worstCaseRemainingWords;
        //         bestWord = word;
        //     }
        // });
    
        // return bestWord;
        let bestWord = '';
    let fewestRemainingWords = Infinity;
    let minWorstCase = Infinity;

    words.forEach(word => {
        let worstCaseRemainingWords = Infinity;
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
<div>
            <span className="title">FALLOUT 4 - HACK PASSWORD</span>
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
                    // COMPUTERS ACADEMIST DECEPTION CIVILIZED CLIPBOARD COMMUNITY
                    // onChange={handleWordsInput}
                    className="textarea"
                />
                    <div className="control-buttons">
                        <button onClick={() => handleHack()}>Hack</button>
                        {/* <button onClick={() => handleReset()}>Reset</button> */}
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
                        {/* <button onClick={() => handleReset()}>Reset</button> */}
                    </div>
            </Container>
            
)}
<Container className="reset-button">
<button onClick={() => handleReset()}>Reset</button>
</Container>
</Container>
</div>
);
};

export default PasswordHacker;
