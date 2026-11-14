import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../assets/js/modules/gamecontroller.js', () => ({
    GameController: vi.fn(),
}));

import { GameController } from '../../assets/js/modules/gamecontroller.js';
import { onDocumentReady } from '../../assets/js/main.js';

describe('onDocumentReady', () => {
    let resetGame;

    beforeEach(() => {
        document.body.innerHTML = '<button id="resetButton"></button>';
        resetGame = vi.fn();
        GameController.mockImplementation(function () {
            return { resetGame };
        });
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    it('initializes the game controller and connects the reset button', () => {
        onDocumentReady(new Event('DOMContentLoaded'));

        expect(GameController).toHaveBeenCalledWith('lettersUsed', 'phraseContainer', {
            gameStatus: 'gameStatusText',
            sessionWins: 'sessionWinsText',
            sessionLosses: 'sessionLossesText',
        });
        expect(resetGame).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Hangman game initialized.');

        document.getElementById('resetButton').click();

        expect(resetGame).toHaveBeenCalledOnce();
    });
});
