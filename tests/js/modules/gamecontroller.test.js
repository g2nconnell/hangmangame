import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameController } from '../../../assets/js/modules/gamecontroller.js';
import { PhraseDataManager } from '../../../assets/js/modules/phrasedata.js';

const statusIds = {
    gameStatus: 'gameStatus',
    sessionWins: 'sessionWins',
    sessionLosses: 'sessionLosses',
};

function createController() {
    return new GameController('lettersUsed', 'wordDisplay', statusIds);
}

function clickLetter(controller, letter) {
    const choice = controller.letterChoices.find(item => item.letter === letter);
    choice.button.click();
}

describe('GameController', () => {
    let context;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="lettersUsed"></div>
            <div id="wordDisplay"></div>
            <div id="gameStatus"></div>
            <div id="sessionWins"></div>
            <div id="sessionLosses"></div>
            <canvas id="hangmanCanvas" width="300" height="480"></canvas>
        `;
        sessionStorage.clear();
        context = {
            arc: vi.fn(),
            beginPath: vi.fn(),
            clearRect: vi.fn(),
            lineTo: vi.fn(),
            moveTo: vi.fn(),
            quadraticCurveTo: vi.fn(),
            stroke: vi.fn(),
        };
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
        vi.spyOn(PhraseDataManager.prototype, 'getPhrase').mockReturnValue('A List');
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        sessionStorage.clear();
        document.body.innerHTML = '';
    });

    it('initializes the game and displays saved session totals', () => {
        sessionStorage.setItem('hangmanSessionStatus', JSON.stringify({ wins: 2, losses: 3 }));

        const controller = createController();

        expect(controller.gamePhrase.getPhrase()).toBe('A List');
        expect(controller.letterChoices).toHaveLength(26);
        expect(document.querySelectorAll('#lettersUsed button')).toHaveLength(26);
        expect(document.getElementById('sessionWins').textContent).toBe('2');
        expect(document.getElementById('sessionLosses').textContent).toBe('3');
        expect(controller.gameCompleted).toBe(false);
    });

    it('rejects invalid game and session status element IDs', () => {
        expect(() => new GameController('missing', 'wordDisplay', statusIds))
            .toThrow('GameController requires valid letter and word display container IDs.');
        expect(() => new GameController('lettersUsed', 'wordDisplay', {
            ...statusIds,
            sessionWins: 'missing',
        })).toThrow('GameController requires valid session status element IDs.');
    });

    it('records a win, updates the status, and disables the letter choices', () => {
        const controller = createController();

        for (const letter of ['A', 'L', 'I', 'S', 'T']) {
            clickLetter(controller, letter);
        }

        expect(controller.gameCompleted).toBe(true);
        expect(document.getElementById('gameStatus').textContent).toBe('Game Won!');
        expect(document.getElementById('gameStatus').classList.contains('winner')).toBe(true);
        expect(controller.sessionStatus.wins).toBe(1);
        expect(document.getElementById('sessionWins').textContent).toBe('1');
        expect(JSON.parse(sessionStorage.getItem('hangmanSessionStatus'))).toEqual({
            wins: 1,
            losses: 0,
        });
        expect(controller.letterChoices.every(choice => choice.button.disabled)).toBe(true);
    });

    it('records a loss after the hangman is completed', () => {
        const controller = createController();

        for (const letter of ['Z', 'X', 'Q', 'J', 'V', 'W']) {
            clickLetter(controller, letter);
        }

        expect(controller.gameCompleted).toBe(true);
        expect(controller.hangman.isFullBodyDrawn()).toBe(true);
        expect(document.getElementById('gameStatus').textContent).toBe('Game Lost!');
        expect(document.getElementById('gameStatus').classList.contains('loser')).toBe(true);
        expect(controller.sessionStatus.losses).toBe(1);
        expect(document.getElementById('sessionLosses').textContent).toBe('1');
        expect(JSON.parse(sessionStorage.getItem('hangmanSessionStatus'))).toEqual({
            wins: 0,
            losses: 1,
        });
        expect(controller.letterChoices.every(choice => choice.button.disabled)).toBe(true);
    });

    it('resets the game status, hangman, and letter choices', () => {
        const controller = createController();
        clickLetter(controller, 'Z');
        const gameStatus = document.getElementById('gameStatus');
        gameStatus.classList.add('winner', 'loser');
        gameStatus.textContent = 'Game Lost!';

        controller.resetGame();

        expect(controller.gameCompleted).toBe(false);
        expect(controller.hangman.bodyPartsDrawn).toBe(0);
        expect(gameStatus.textContent).toBe('In Progress');
        expect(gameStatus.classList.contains('winner')).toBe(false);
        expect(gameStatus.classList.contains('loser')).toBe(false);
        expect(controller.letterChoices.every(choice => !choice.button.disabled)).toBe(true);
        expect(controller.letterChoices.find(choice => choice.letter === 'Z')
            .button.classList.contains('letter-choice--used')).toBe(false);
        expect(document.getElementById('wordDisplay').classList.contains('is-leaving')).toBe(true);
    });
});
