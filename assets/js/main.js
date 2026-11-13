
import { GameController } from './modules/gamecontroller.js';

export function onDocumentReady(event) {
    init();
}

function init() {
    const resetButton = document.getElementById('resetButton');
    const statusIds = {
        gameStatus: 'gameStatusText',
        sessionWins: 'sessionWinsText',
        sessionLosses: 'sessionLossesText'
    };
    const gameController = new GameController('lettersUsed', 'phraseContainer', statusIds);
    resetButton.addEventListener('click', () => gameController.resetGame());
    console.log("Hangman game initialized.");
}
