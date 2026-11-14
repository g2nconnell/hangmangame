import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GamePhrase } from '../../../assets/js/modules/gamephrase.js';

describe('GamePhrase', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'phraseDisplay';
        document.body.appendChild(container);
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('creates a display for each character and preserves the phrase', () => {
        const gamePhrase = new GamePhrase('Hi!', 'phraseDisplay');

        expect(gamePhrase.getPhrase()).toBe('Hi!');
        expect(gamePhrase.letterDisplays.map(display => display.getLetter()))
            .toEqual(['H', 'I', '!']);
        expect(container.children).toHaveLength(3);
        expect(gamePhrase.letterDisplays[0].isRevealed()).toBe(false);
        expect(gamePhrase.letterDisplays[2].isRevealed()).toBe(true);
    });

    it.each(['', 'hello, world', '123'])('rejects an invalid phrase: %s', phrase => {
        expect(() => new GamePhrase(phrase, 'phraseDisplay')).toThrow(TypeError);
    });

    it('reveals every matching letter and reports completion', () => {
        const gamePhrase = new GamePhrase('aa!', 'phraseDisplay');

        expect(gamePhrase.findLetter('z')).toBe(false);
        expect(gamePhrase.isComplete()).toBe(false);
        expect(gamePhrase.findLetter('A')).toBe(true);
        expect(gamePhrase.letterDisplays.slice(0, 2).every(display => display.isRevealed()))
            .toBe(true);
        expect(gamePhrase.isComplete()).toBe(true);
    });

    it('rejects guesses that are not a single letter', () => {
        const gamePhrase = new GamePhrase('hello', 'phraseDisplay');

        expect(() => gamePhrase.findLetter('ab')).toThrow(TypeError);
        expect(() => gamePhrase.findLetter('1')).toThrow(TypeError);
    });

    it('compares valid full-phrase guesses without regard to case', () => {
        const gamePhrase = new GamePhrase('Hello world!', 'phraseDisplay');

        expect(gamePhrase.guessPhrase('hELLo WORLD!')).toBe(true);
        expect(gamePhrase.guessPhrase('hello there!')).toBe(false);
        expect(() => gamePhrase.guessPhrase('hello, world!')).toThrow(TypeError);
    });

    it('replaces the phrase after its leave animation and enters after the delay', () => {
        vi.useFakeTimers();
        const gamePhrase = new GamePhrase('old phrase', 'phraseDisplay');
        const oldElements = [...container.children];

        gamePhrase.reset('new phrase');

        expect(container.classList.contains('is-leaving')).toBe(true);
        const animationEnd = new Event('animationend');
        Object.defineProperty(animationEnd, 'animationName', { value: 'leave' });
        container.dispatchEvent(animationEnd);

        expect(oldElements.every(element => !element.isConnected)).toBe(true);
        expect(gamePhrase.getPhrase()).toBe('new phrase');
        expect(container.children).toHaveLength('new phrase'.length);
        expect(container.classList.contains('is-entering')).toBe(false);

        vi.advanceTimersByTime(1000);

        expect(container.classList.contains('is-leaving')).toBe(false);
        expect(container.classList.contains('is-entering')).toBe(true);
    });
});
