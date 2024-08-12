import React, { useState, useEffect } from 'react';
import '../App.css';
import {Container, Image, Table, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

const PasswordHacker = () => {
    const [words, setWords] = useState([]);
    const [possiblePasswords, setPossiblePasswords] = useState([]);
    const [likelinessOptions, setLikelinessOptions] = useState({});
    const [inputError, setInputError] = useState('');

    const handleWordsInput = (e) => {
        const inputWords = e.target.value.toUpperCase().split(' ').map(word => word.trim()).filter(word => word);
        setInputError('');

        if (inputWords.length > 0) {
            const wordLength = inputWords[0].length;
            const allSameLength = inputWords.every(word => word.length === wordLength);

            if (allSameLength) {
                setWords(inputWords);
                setPossiblePasswords(inputWords);
            } else {
                setInputError('All words must be of the same length.');
                setWords([]);
                setPossiblePasswords([]);
            }
        } else {
            setWords([]);
            setPossiblePasswords([]);
        }
    };

    useEffect(() => {
        if (words.length > 0) {
            generateLikelinessButtons(words);
        }
    }, [words]);

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

    // const findOptimalWord = () => {
    //     let bestWord = '';
    //     let bestScore = -Infinity;
    
    //     words.forEach(word => {
    //         let worstCaseEliminations = 0;
    //         const likelinessCount = {};
    
    //         // Simulate the elimination process
    //         words.forEach(otherWord => {
    //             if (word !== otherWord) {
    //                 const likeliness = compareWords(word, otherWord);
    //                 if (!likelinessCount[likeliness]) {
    //                     likelinessCount[likeliness] = 0;
    //                 }
    //                 likelinessCount[likeliness]++;
    //             }
    //         });
    
    //         // Find the worst-case number of eliminations
    //         for (const likeliness in likelinessCount) {
    //             worstCaseEliminations = Math.max(worstCaseEliminations, likelinessCount[likeliness]);
    //         }
    
    //         // Choose the word that has the highest worst-case eliminations
    //         if (worstCaseEliminations > bestScore) {
    //             bestScore = worstCaseEliminations;
    //             bestWord = word;
    //         }
    //     });
    
    //     return bestWord;
    // };
    const findOptimalWord = () => {
        let bestWord = '';
        let fewestRemainingWords = Infinity;
    
        words.forEach(word => {
            let worstCaseRemainingWords = 0;
    
            // Collect all possible likeliness scores
            const likelinessScores = new Set();
            words.forEach(otherWord => {
                if (word !== otherWord) {
                    likelinessScores.add(compareWords(word, otherWord));
                }
            });
    
            // Calculate the worst-case number of remaining words for each likeliness score
            likelinessScores.forEach(likeliness => {
                if (word && !isNaN(likeliness)) {
                    const filteredWords = words.filter(w => compareWords(word, w) === likeliness);
                    worstCaseRemainingWords = Math.max(worstCaseRemainingWords, filteredWords.length);
                }
            });
    
            // Update the best word if this one results in fewer remaining words in the worst-case scenario
            if (worstCaseRemainingWords < fewestRemainingWords) {
                fewestRemainingWords = worstCaseRemainingWords;
                bestWord = word;
            }
        });
    
        return bestWord;
    };


    const optimalWord = findOptimalWord();

    return (
        <div className="password-guesser">
            <h1>Password Guesser</h1>
            <div className="input-section">
                <label htmlFor="words">Enter words (space-separated):</label><br />
                <textarea
                    id="words"
                    // placeholder="COMPUTERS ACADEMIST DECEPTION CIVILIZED CLIPBOARD COMMUNITY"
                    // COMPUTERS ACADEMIST DECEPTION CIVILIZED CLIPBOARD COMMUNITY
                    onChange={handleWordsInput}
                    rows="4"
                    cols="50"
                />
                {inputError && <p className="error">{inputError}</p>}
            </div>

            {/* <h2>Optimal Starting Word: <span>{optimalWord}</span></h2> */}

            {/* <h2>Possible Correct Passwords:</h2> */}
            <Container className="word-map">
                {words.map((word, index) => (
                    <div key={index} className={`word-item ${word === optimalWord ? "optimal" : ""}`}>
                        <span className={`word`}>{word}</span>
                        <div className="likeliness-buttons">
                            {(likelinessOptions[word] || []).map((likeliness, idx) => (
                                <button key={`${word}-${likeliness}-${idx}`} onClick={() => checkPassword(word, likeliness)}>
                                    {likeliness}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </Container>
        </div>
    );
};

export default PasswordHacker;
