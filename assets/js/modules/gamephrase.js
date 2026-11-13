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
        this.letterDisplays.forEach(display => phraseDisplay.appendChild(display.element));
    }

    setPhrase(phrase) {
        console.log(`Phrase: ${phrase}`);
        if (typeof phrase !== 'string' || !/^[a-z]+(?:[ !?'-]*[a-z]+)*[!?'-]*$/i.test(phrase)) {
            throw new TypeError(`Bad phrase: ${phrase}. GamePhrase requires letters, spaces, and !, -, ', or ?.`);
        }
        this.phrase = phrase;

        this.letterDisplays = [...phrase].map(character => new LetterDisplay(character));
    }

    reset(phrase) {
        const phraseDisplay = document.getElementById(this.wordDisplayContainerId);

        phraseDisplay.addEventListener("animationend", (event) => {
            if (event.target !== phraseDisplay || event.animationName !== "leave") return;

            this.letterDisplays.forEach(display => display.element.remove());
            this.setPhrase(phrase);
            this.letterDisplays.forEach(display => phraseDisplay.appendChild(display.element));
            
            setTimeout(() => {
            phraseDisplay.classList.remove("is-leaving");
            phraseDisplay.classList.add("is-entering");
            }, 1000);
        }, { once: true });

        phraseDisplay.classList.remove("is-entering");
        phraseDisplay.classList.add("is-leaving");
    }

    getPhrase() {
        return this.phrase;
    }

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

    guessPhrase(guess) {
        if (typeof guess !== 'string' || !/^[a-z]+(?:[ !?'-]*[a-z]+)*[!?'-]*$/i.test(guess)) {
            throw new TypeError("guessPhrase requires letters, spaces, and !, -, ', or ?.");
        }
        return guess.toLowerCase() === this.phrase.toLowerCase();
    }

    isComplete() {
        const complete = this.letterDisplays.every(display => display.isRevealed());
        return complete;
    }
}
