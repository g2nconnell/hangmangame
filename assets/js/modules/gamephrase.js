import { LetterDisplay } from './letterdisplay.js';

export class GamePhrase {
    /**
     * Creates a new GamePhrase instance for the given phrase.
     * @param {string} phrase - A phrase containing letters, spaces, and !, -, ', or ?.
     * @param {string} wordDisplayContainerId - The ID of the container for the word display.
     * @throws {TypeError} If the phrase contains unsupported characters or no letters.
     * @example
     * const gamePhrase = new GamePhrase('hello world', 'phraseContainer');
     * gamePhrase.findLetter('h'); // Reveals the letter 'H' in the phrase
     */
    constructor(phrase, wordDisplayContainerId) {
        const phraseDisplay = document.getElementById(wordDisplayContainerId);
        this.wordDisplayContainerId = wordDisplayContainerId;
        this.setPhrase(phrase);
        this.renderPhrase(phraseDisplay);
    }

    /**
     * Sets the phrase for the game.
     * @param {string} phrase - A phrase containing letters, spaces, and !, -, ', or ?.
     * @throws {TypeError} If the phrase contains unsupported characters or no letters.
     */
    setPhrase(phrase) {
        console.log(`Phrase: ${phrase}`);
        if (typeof phrase !== 'string' || !/^[a-z]+(?:[ !?'-]*[a-z]+)*[!?'-]*$/i.test(phrase)) {
            throw new TypeError(`Bad phrase: ${phrase}. GamePhrase requires letters, spaces, and !, -, ', or ?.`);
        }
        this.phrase = phrase;

        this.letterDisplays = [...phrase].map(character => new LetterDisplay(character));
    }

    /*
        TODO:
        Call renderPhrase() after setPhrase() in the constructor and after resetting the phrase. 
        In reset, clear the old wrappers as well as their contents before rendering again.

        Generate docs
    */
    /**
     * Renders the phrase in the given container.
     * @param {HTMLElement} container - The container element for the phrase display.
     */
    renderPhrase(container) {
        let wordElement = null;

        for (const display of this.letterDisplays) {
            if (display.getLetter() === ' ') {
                wordElement = null;
                container.appendChild(display.element);
                continue;
            }

            if (!wordElement) {
                wordElement = document.createElement('div');
                wordElement.classList.add('phrase-word');
                container.appendChild(wordElement);
            }

            wordElement.appendChild(display.element);
        }
    }

    /**
     * Resets the phrase with an animated transition.
     * @param {string} phrase - A phrase containing letters, spaces, and !, -, ', or ?.
     * @throws {TypeError} If the phrase contains unsupported characters or no letters.
     */
    reset(phrase) {
        const phraseDisplay = document.getElementById(this.wordDisplayContainerId);

        phraseDisplay.addEventListener("animationend", (event) => {
            if (event.target !== phraseDisplay || event.animationName !== "leave") return;

            phraseDisplay.querySelectorAll('.phrase-word').forEach(word => word.remove());
            this.letterDisplays.forEach(display => display.element.remove());
            this.setPhrase(phrase);
            this.renderPhrase(phraseDisplay);
            
            setTimeout(() => {
            phraseDisplay.classList.remove("is-leaving");
            phraseDisplay.classList.add("is-entering");
            }, 1000);
        }, { once: true });

        phraseDisplay.classList.remove("is-entering");
        phraseDisplay.classList.add("is-leaving");
    }

    /**
     * Gets the current phrase.
     * @returns {string} The current phrase.
     */
    getPhrase() {
        return this.phrase;
    }

    /**
     * Reveals all matching letters in the phrase.
     * @param {string} letter - A single letter to find.
     * @returns {boolean} Whether a matching letter was found.
     * @throws {TypeError} If the letter is not a single letter.
     */
    findLetter(letter) {
        if (typeof letter !== 'string' || !/^[a-z]$/i.test(letter)) {
            throw new TypeError('findLetter requires a single letter.');
        }
        let found = false;

        const target = letter.toUpperCase();
        this.letterDisplays.forEach(display => {
            if (display.getLetter() !== ' ' && display.getLetter() === target) {
                display.showLetter();
                found = true;
            }
        });
        return found;
    }

    /**
     * Checks whether a guess matches the current phrase.
     * @param {string} guess - A guess containing letters, spaces, and !, -, ', or ?.
     * @returns {boolean} Whether the guess matches the phrase.
     * @throws {TypeError} If the guess contains unsupported characters.
     */
    guessPhrase(guess) {
        if (typeof guess !== 'string' || !/^[a-z]+(?:[ !?'-]*[a-z]+)*[!?'-]*$/i.test(guess)) {
            throw new TypeError("guessPhrase requires letters, spaces, and !, -, ', or ?.");
        }
        return guess.toLowerCase() === this.phrase.toLowerCase();
    }

    /**
     * Checks whether all letters in the phrase have been revealed.
     * @returns {boolean} Whether the phrase is complete.
     */
    isComplete() {
        const complete = this.letterDisplays.every(display => display.isRevealed());
        return complete;
    }
}
