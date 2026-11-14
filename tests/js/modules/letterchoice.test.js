import { describe, expect, it, vi } from 'vitest';
import { LetterChoice } from '../../../assets/js/modules/letterchoice.js';

describe('LetterChoice', () => {
    it('creates an uppercase button with its initial accessibility label', () => {
        const choice = new LetterChoice('a');

        expect(choice.letter).toBe('A');
        expect(choice.button.tagName).toBe('BUTTON');
        expect(choice.button.type).toBe('button');
        expect(choice.button.textContent).toBe('A');
        expect(choice.button.getAttribute('aria-label')).toBe('A');
        expect(choice.button.classList.contains('letter-choice')).toBe(true);
        expect(choice.button.disabled).toBe(false);
    });

    it.each(['', 'ab', '1', 'é', null, 2])('rejects invalid input: %s', letter => {
        expect(() => new LetterChoice(letter)).toThrow(TypeError);
    });

    it('dispatches a bubbling letterchoice event and marks the button used', () => {
        const choice = new LetterChoice('b');
        const parent = document.createElement('div');
        const listener = vi.fn();
        parent.addEventListener('letterchoice', listener);
        parent.appendChild(choice.button);

        choice.button.click();

        expect(choice.button.disabled).toBe(true);
        expect(choice.button.classList.contains('letter-choice--used')).toBe(true);
        expect(choice.button.getAttribute('aria-label')).toBe('B, already used');
        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0][0].detail).toBe('B');
        expect(listener.mock.calls[0][0].bubbles).toBe(true);
        expect(listener.mock.calls[0][0].target).toBe(choice.button);

        choice.button.click();
        expect(listener).toHaveBeenCalledOnce();
    });

    it('restores the initial button state on reset', () => {
        const choice = new LetterChoice('c');
        choice.button.click();

        choice.reset();

        expect(choice.button.disabled).toBe(false);
        expect(choice.button.classList.contains('letter-choice--used')).toBe(false);
        expect(choice.button.getAttribute('aria-label')).toBe('C');
    });
});
