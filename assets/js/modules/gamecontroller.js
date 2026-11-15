import { Hangman } from './hangman.js';
import { LetterChoice } from './letterchoice.js';
import { GamePhrase } from './gamephrase.js';
import { PhraseDataManager } from './phrasedata.js';

export class GameController {
    /**
     * Creates a new GameController instance.
     * @param {string} lettersUsedContainerId - The ID of the container for letter choices.
     * @param {string} wordDisplayContainerId - The ID of the container for the word display.
     * @param {Object} statusIds - The IDs of the session status elements.
     * @param {string} statusIds.gameStatus - The ID of the game status element.
     * @param {string} statusIds.sessionWins - The ID of the session wins element.
     * @param {string} statusIds.sessionLosses - The ID of the session losses element.
     * @throws {Error} If the provided container IDs are invalid.
     * @example
     * const gameController = new GameController('lettersUsed', 'wordDisplay', {
     *     gameStatus: 'gameStatusText',
     *     sessionWins: 'sessionWinsText',
     *     sessionLosses: 'sessionLossesText'
     * });
     */
    constructor(lettersUsedContainerId, wordDisplayContainerId, statusIds) {
        const lettersUsedContainer = document.getElementById(lettersUsedContainerId);
        const wordDisplayContainer = document.getElementById(wordDisplayContainerId);

        if (!lettersUsedContainer || !wordDisplayContainer) {
            throw new Error('GameController requires valid letter and word display container IDs.');
        }

        this.sessionStatus = this.getSessionStatus();
        this.statusIds = statusIds;
        const gameStatusText = document.getElementById(statusIds.gameStatus);
        const sessionWinsText = document.getElementById(statusIds.sessionWins);
        const sessionLossesText = document.getElementById(statusIds.sessionLosses);

        if (!gameStatusText || !sessionWinsText || !sessionLossesText) {
            throw new Error('GameController requires valid session status element IDs.');
        }

        sessionWinsText.textContent = this.sessionStatus.wins;
        sessionLossesText.textContent = this.sessionStatus.losses;

        this.gameCompleted = false;
        this.hangman = new Hangman('hangmanCanvas');
        this.phraseDataManager = new PhraseDataManager();
        this.letterChoices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            .split('')
            .map(letter => new LetterChoice(letter));
        this.gamePhrase = new GamePhrase(this.getPhrase(), wordDisplayContainerId);

        this.letterChoices.forEach(choice => {
            lettersUsedContainer.appendChild(choice.button);
        });

        lettersUsedContainer.addEventListener('letterchoice', event => {
            const letter = event.detail;
            this.matchLetters(letter);
        });
    }

    
    /**
     * Gets the current session status.
     * @returns {{wins: number, losses: number}} The current session status.
     */
    getSessionStatus() {
        const data = sessionStorage.getItem('hangmanSessionStatus');
        return data ? JSON.parse(data) : { wins: 0, losses: 0 };
    }

    /**
     * Sets the current session status.
     * @param {{wins: number, losses: number}} status - The session status to save.
     */
    setSessionStatus(status) {
        sessionStorage.setItem('hangmanSessionStatus', JSON.stringify(status));
    }

    /**
     * Updates the session status display.
     */
    updateSessionStatusDisplay() {
        const sessionWinsText = document.getElementById(this.statusIds.sessionWins);
        const sessionLossesText = document.getElementById(this.statusIds.sessionLosses);
        sessionWinsText.textContent = this.sessionStatus.wins;
        sessionLossesText.textContent = this.sessionStatus.losses;
    }

    /**
     * Gets the current phrase.
     * @returns {string} The current phrase.
     */
    getPhrase() {
        const phrase = this.phraseDataManager.getPhrase();
        return phrase;
    }

    /**
     * Resets the game to its initial state.
     */
    resetGame() {
        this.gameCompleted = false;
        this.hangman.reset();
        this.gamePhrase.reset(this.getPhrase());
        this.letterChoices.forEach(choice => choice.reset());
        const gameStatusText = document.getElementById(this.statusIds.gameStatus);
        
        gameStatusText.classList.remove('winner');
        gameStatusText.classList.remove('loser');
        gameStatusText.textContent = "In Progress";
        this.letterChoices.forEach(choice => choice.button.disabled = false);
    }

    /**
     * Matches a letter against the current phrase.
     * @param {string} letter - A single letter to match.
     */
    matchLetters(letter) {
        const found = this.gamePhrase.findLetter(letter);
        if (!found) {
            this.hangman.drawNextPart();
            if (this.hangman.isFullBodyDrawn()) {
                this.gameLost();
            }
        } else if (this.gamePhrase.isComplete()) {
            this.gameWon();
        }
    }

    /**
     * Handles the game loss.
     */
    gameLost() {
        this.hangman.drawHead(true);
        const gameStatusText = document.getElementById(this.statusIds.gameStatus);
        gameStatusText.textContent = "Game Lost!";
        gameStatusText.classList.add('loser');
        this.gameCompleted = true;
        this.sessionStatus.losses++;
        this.setSessionStatus(this.sessionStatus);
        this.updateSessionStatusDisplay();
        this.letterChoices.forEach(choice => choice.button.disabled = true);
    }

    /**
     * Handles the game win.
     */
    gameWon() {
        const gameStatusText = document.getElementById(this.statusIds.gameStatus);
        gameStatusText.textContent = "Game Won!";
        gameStatusText.classList.add('winner');
        this.gameCompleted = true;
        this.letterChoices.forEach(choice => choice.button.disabled = true);
        this.sessionStatus.wins++;
        this.setSessionStatus(this.sessionStatus);  
        this.updateSessionStatusDisplay();      
    }
}
