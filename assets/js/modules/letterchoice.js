export class LetterChoice {
    
    /**
     * The LetterChoice class handles creating and managing a letter choice button.
     * @param {string} letter
     * @returns {LetterChoice}
     * @example
     * const letterChoice = new LetterChoice('a');
     * document.body.appendChild(letterChoice.button);
     */
    constructor(letter) {
        if (typeof letter !== 'string' || !/^[a-z]$/i.test(letter)) {
            throw new TypeError('LetterChoice requires a single letter.');
        }

        this.letter = letter.toUpperCase();
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.classList.add('letter-choice');
        this.button.textContent = this.letter;
        this.button.setAttribute('aria-label', this.letter);
        this.button.addEventListener('click', () => {
            this.button.disabled = true;
            this.button.classList.add('letter-choice--used');
            this.button.setAttribute('aria-label', `${this.letter}, already used`);
            this.button.dispatchEvent(new CustomEvent('letterchoice', {
                bubbles: true,
                detail: this.letter
            }));
        });
    }

    reset() {
        this.button.disabled = false;
        this.button.classList.remove('letter-choice--used');
        this.button.setAttribute('aria-label', this.letter);
    }
}
