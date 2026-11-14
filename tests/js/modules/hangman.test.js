import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Hangman } from '../../../assets/js/modules/hangman.js';

describe('Hangman', () => {
    let context;

    beforeEach(() => {
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

        const canvas = document.createElement('canvas');
        canvas.id = 'hangmanCanvas';
        document.body.appendChild(canvas);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('draws the gallows and starts with no body parts', () => {
        const hangman = new Hangman('hangmanCanvas');

        expect(context.clearRect).toHaveBeenCalledWith(0, 0, 300, 150);
        expect(context.moveTo).toHaveBeenCalledWith(75, 350);
        expect(context.lineTo).toHaveBeenCalledWith(100, 75);
        expect(hangman.bodyPartsDrawn).toBe(0);
        expect(hangman.isFullBodyDrawn()).toBe(false);
    });

    it('draws each body part in order and marks the body complete', () => {
        const hangman = new Hangman('hangmanCanvas');
        const drawMethods = [
            vi.spyOn(hangman, 'drawHead'),
            vi.spyOn(hangman, 'drawTorso'),
            vi.spyOn(hangman, 'drawLeftArm'),
            vi.spyOn(hangman, 'drawRightArm'),
            vi.spyOn(hangman, 'drawLeftLeg'),
            vi.spyOn(hangman, 'drawRightLeg'),
        ];

        for (let i = 0; i < drawMethods.length; i++) {
            hangman.drawNextPart();
            expect(drawMethods[i]).toHaveBeenCalledOnce();
        }

        expect(drawMethods[0]).toHaveBeenCalledWith(false);
        expect(hangman.bodyPartsDrawn).toBe(6);
        expect(hangman.isFullBodyDrawn()).toBe(true);
    });

    it('does not draw more parts after the body is complete', () => {
        const hangman = new Hangman('hangmanCanvas');
        for (let i = 0; i < 6; i++) {
            hangman.drawNextPart();
        }
        const strokesAfterCompletion = context.stroke.mock.calls.length;
        const bodyPartsAfterCompletion = hangman.bodyPartsDrawn;

        hangman.drawNextPart();

        expect(context.stroke).toHaveBeenCalledTimes(strokesAfterCompletion);
        expect(hangman.bodyPartsDrawn).toBe(bodyPartsAfterCompletion);
    });

    it('clears and redraws the gallows when reset', () => {
        const hangman = new Hangman('hangmanCanvas');
        hangman.drawNextPart();
        const clearCallsBeforeReset = context.clearRect.mock.calls.length;
        const pathStartsBeforeReset = context.moveTo.mock.calls.length;

        hangman.reset();

        expect(context.clearRect).toHaveBeenCalledTimes(clearCallsBeforeReset + 1);
        expect(context.moveTo).toHaveBeenCalledTimes(pathStartsBeforeReset + 2);
        expect(hangman.bodyPartsDrawn).toBe(0);
        expect(hangman.isFullBodyDrawn()).toBe(false);
    });
});
