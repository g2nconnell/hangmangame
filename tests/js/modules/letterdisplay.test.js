import { describe, expect, it } from 'vitest';
import { LetterDisplay } from '../../../assets/js/modules/letterdisplay.js';

describe('LetterDisplay', () => {
    it('creates an unrevealed card containing the uppercase letter', () => {
        const display = new LetterDisplay('a');

        expect(display.getLetter()).toBe('A');
        expect(display.isRevealed()).toBe(false);
        expect(display.element.classList.contains('letter-display')).toBe(true);
        expect(display.flipCardFront.textContent).toBe('?');
        expect(display.flipCardBack.textContent).toBe('A');
        expect(display.element.classList.contains('flip-card-flip')).toBe(false);
    });

    it.each([
        [' ', 'letter-display--space'],
        ['!', 'letter-display--punctuation'],
        ['-', 'letter-display--punctuation'],
        ["'", 'letter-display--punctuation'],
        ['?', 'letter-display--punctuation'],
    ])('starts the character %s revealed as non-letter content', (character, className) => {
        const display = new LetterDisplay(character);

        expect(display.isRevealed()).toBe(true);
        expect(display.element.classList.contains(className)).toBe(true);
        expect(display.element.classList.contains('flip-card-flip')).toBe(true);
    });

    it.each(['', 'ab', '1', 'é', null, 2])('rejects invalid input: %s', letter => {
        expect(() => new LetterDisplay(letter)).toThrow(TypeError);
    });

    it('reveals the letter when shown', () => {
        const display = new LetterDisplay('b');

        display.showLetter();

        expect(display.isRevealed()).toBe(true);
        expect(display.element.classList.contains('flip-card-flip')).toBe(true);
    });

    it('resets letters to hidden and keeps non-letter content revealed', () => {
        const letter = new LetterDisplay('c');
        const punctuation = new LetterDisplay('!');
        letter.showLetter();

        letter.reset();
        punctuation.reset();

        expect(letter.isRevealed()).toBe(false);
        expect(letter.element.classList.contains('flip-card-flip')).toBe(false);
        expect(punctuation.isRevealed()).toBe(true);
        expect(punctuation.element.classList.contains('flip-card-flip')).toBe(true);
    });
});
