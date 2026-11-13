export class LetterDisplay {
    /**
     * Creates a new LetterDisplay instance for the given letter.
     * @param {string} letter - A letter, space, or supported punctuation character.
     * @throws {TypeError} If the provided value is not a supported single character.
     * @example
     * const display = new LetterDisplay('a');
     * display.showLetter(); // Displays 'A'
     * display.reset(); // Resets the display to '?'
     * display.getLetter(); // Returns 'A'
     */
    constructor(letter) {
        if (typeof letter !== 'string' || !/^(?:[a-z]|[ !?'-])$/i.test(letter)) {
            throw new TypeError("LetterDisplay requires a letter, space, or !, -, ', or ?.");
        }

        this.letter = letter.toUpperCase();
        this.revealed = false;
        // this.element = document.createElement('span');

        const flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');
        const flipCardInner = document.createElement('div');
        flipCardInner.classList.add('flip-card-inner');
        flipCard.appendChild(flipCardInner);
        const flipCardFront = document.createElement('div');
        flipCardFront.classList.add('flip-card-front');
        flipCardFront.textContent = '?';
        
        flipCardInner.appendChild(flipCardFront);
        const flipCardBack = document.createElement('div');
        flipCardBack.classList.add('flip-card-back');
        flipCardBack.textContent = this.letter;
        flipCardInner.appendChild(flipCardBack);

        this.element = flipCard;
        this.flipCardFront = flipCardFront;
        this.flipCardBack = flipCardBack;

        this.element.classList.add('letter-display');
        if (this.letter === ' ') {
            this.element.classList.add('letter-display--space');
        }
        if (/^[!?'-]$/i.test(this.letter)) {
            this.element.classList.add('letter-display--punctuation');
        }
        this.reset();
    }

    getLetter() {
        return this.letter;
    }

    isRevealed() {
        return this.revealed;
    }
    

    showLetter() {
        this.revealed = true;
        this.element.classList.add('flip-card-flip');
        
    }

    reset() {
        this.revealed = !/^[a-z]$/i.test(this.letter);
        this.element.classList.toggle('flip-card-flip', this.revealed);
    }
}
