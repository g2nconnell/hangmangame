import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhraseDataManager } from '../../../assets/js/modules/phrasedata.js';

describe('PhraseDataManager', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('initializes a non-empty array of phrase strings', () => {
        const phraseDataManager = new PhraseDataManager();

        expect(phraseDataManager.phrases.length).toBeGreaterThan(0);
        expect(phraseDataManager.phrases.every(
            phrase => typeof phrase === 'string' && phrase.length > 0
        )).toBe(true);
    });

    it.each([
        ['zero', 0],
        ['middle', 0.5],
        ['near one', 1 - Number.EPSILON],
    ])('returns the phrase at the %s random index', (_position, randomValue) => {
        const phraseDataManager = new PhraseDataManager();
        const expectedIndex = Math.floor(randomValue * phraseDataManager.phrases.length);
        vi.spyOn(Math, 'random').mockReturnValue(randomValue);

        expect(phraseDataManager.getPhrase()).toBe(phraseDataManager.phrases[expectedIndex]);
        expect(Math.random).toHaveBeenCalledOnce();
    });
});
