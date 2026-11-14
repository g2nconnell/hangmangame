/*
 * Hangman module
 * Handles drawing the hangman figure on a canvas.
 * Provides methods to draw the gallows, head, torso, arms, legs, and facial expressions.
 * Can be used to create interactive hangman games.
 * 
 * Example usage:
 * const hangman = new Hangman('hangmanCanvas');
 * do {
 *     hangman.drawNextPart(); // Draw the next part of the hangman figure
 * } while (hangman.bodyPartsDrawn < 7);
 */
export class Hangman {
    /**
     * The Hangman class handles drawing the hangman figure on a canvas.
     * @param {string} canvasId
     * @returns {Hangman}
     * @example
     * const hangman = new Hangman('hangmanCanvas');
     * do {
     *     hangman.drawNextPart(); // Draw the next part of the hangman figure
     * } while (hangman.bodyPartsDrawn < 7);
     */
    constructor(canvasId) {
        this.fullBodyDrawn = false;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGallows();
        this.bodyPartsDrawn = 0;
        this.fullBodyDrawn = false;
    }

    drawGallows() {
        this.ctx.beginPath();
        this.ctx.moveTo(75, 350); // base
        this.ctx.lineTo(250, 350); // base
        this.ctx.moveTo(200, 350); // vertical pole
        this.ctx.lineTo(200, 50); // vertical pole
        this.ctx.lineTo(100, 50); // horizontal pole
        this.ctx.lineTo(100, 75); // noose
        this.ctx.stroke();
    }

    clearHead() {
        this.ctx.clearRect(80, 80, 40, 40);
    }

    drawHead(isDead = false) {
        this.clearHead();
        this.ctx.beginPath();
        this.ctx.arc(100, 100, 20, 0, Math.PI * 2, true); // head
        this.ctx.stroke();
        if (isDead) {
            this.drawSadFace();
        } else {
            this.drawHappyFace();
        }
        this.bodyPartsDrawn++;
    }

    drawTorso() {
        this.ctx.beginPath();
        this.ctx.moveTo(100, 120);
        this.ctx.lineTo(100, 220); // torso
        this.ctx.stroke();
        this.bodyPartsDrawn++;
    }

    drawLeftArm() {
        this.ctx.beginPath();
        this.ctx.moveTo(100, 140);
        this.ctx.lineTo(60, 180); // left arm
        this.ctx.stroke();
        this.bodyPartsDrawn++;
    }

    drawRightArm() {
        this.ctx.beginPath();
        this.ctx.moveTo(100, 140);
        this.ctx.lineTo(140, 180); // right arm
        this.ctx.stroke();
        this.bodyPartsDrawn++;
    }

    drawLeftLeg() {
        this.ctx.beginPath();
        this.ctx.moveTo(100, 220);
        this.ctx.lineTo(60, 260); // left leg
        this.ctx.stroke();
        this.bodyPartsDrawn++;
    }

    drawRightLeg() {
        this.ctx.beginPath();
        this.ctx.moveTo(100, 220);
        this.ctx.lineTo(140, 260); // right leg
        this.ctx.stroke();
        this.bodyPartsDrawn++;
    }

    drawHappyFace() {
        this.ctx.beginPath();
        this.ctx.arc(92, 95, 2, 0, Math.PI * 2, true); // left eye
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(108, 95, 2, 0, Math.PI * 2, true); // right eye
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(90, 105);
        this.ctx.quadraticCurveTo(100, 115, 110, 105); // mouth
        this.ctx.stroke();
    }

    drawTongue() {
        this.ctx.beginPath();
        this.ctx.moveTo(96, 107);
        this.ctx.lineTo(96, 113);
        this.ctx.arc(100, 113, 4, Math.PI, 0, true);
        this.ctx.lineTo(104, 107);
        this.ctx.stroke();
    }

    isFullBodyDrawn() {
        return this.fullBodyDrawn;
    }

    drawSadFace() {
        this.ctx.beginPath();
        this.ctx.moveTo(90, 93);
        this.ctx.lineTo(94, 97);
        this.ctx.moveTo(94, 93);
        this.ctx.lineTo(90, 97); // left eye
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(106, 93);
        this.ctx.lineTo(110, 97);
        this.ctx.moveTo(110, 93);
        this.ctx.lineTo(106, 97); // right eye
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(90, 110);
        this.ctx.quadraticCurveTo(100, 100, 110, 110); // mouth
        this.ctx.stroke();
        this.drawTongue();
        this.bodyPartsDrawn++;
    }

    drawNextPart() {
        if (this.fullBodyDrawn) {
            return;
        }
        switch (this.bodyPartsDrawn) {
            case 0:
                this.drawHead(false);
                break;
            case 1:
                this.drawTorso();
                break;
            case 2:
                this.drawLeftArm();
                break;
            case 3:
                this.drawRightArm();
                break;
            case 4:
                this.drawLeftLeg();
                break;
            case 5:
                this.drawRightLeg();
                this.fullBodyDrawn = true;
                break;
            case 6:
                this.drawHead(true);
                break;
        }
    }
}