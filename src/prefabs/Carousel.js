//helper functions to aid in randomly generating the keys
function randomInt(min, max) {
    return Math.floor(Phaser.Math.Linear(min, max, Math.random()));
}

function randomElem(array) {
    return array[randomInt(0, array.length)]
}
class Carousel extends Phaser.Scene {
    constructor() {
        super("Carousel");
    }

    preload(){
        //loading used assets
        this.load.image('bg1', './assets/temp_bg2.png');
        this.load.image("AKey", "./assets/AKey.png");
        this.load.image("DKey", "./assets/DKey.png");
        this.load.image("SKey", "./assets/SKey.png");
        this.load.image("QKey", "./assets/QKey.png");
        this.load.image("WKey", "./assets/WKey.png");
        this.load.image("target", "assets/target.png");
        //loading used sfx
        this.load.audio('beep2', './assets/temp_beep2.wav');
    }

    create() {

        // setting the background
        this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg1').setOrigin(0, 0);
        this.bg1.setDepth(-1);

        //initializing the keys
        this.keysVelocity = -200; //speed of the keys
        this.keys = ["A", "D", "S", "Q", "W"];
        this.keyGroups = {};
        this.keyButtons = {};
        let buttonX = 89; //position of the display buttons

        //initializing the target
        this.target = this.physics.add.sprite(game.config.width / 2, game.config.height / 2 + 4, "target");
        this.target.body.setSize(8, 30);

        //initializing the score and goal score
        this.score = 0;
        this.maxScore = 500;   

        // The score text
        this.scoreText = this.add.text(100, 100, "SCORE", { fontFamily: "arial", fontSize: "50px" });
        

        for (let key of this.keys) { //generating the keys and their buttons
            this.keyGroups[key] = this.physics.add.group({ velocityX: this.keysVelocity });
            this.keyButtons[key] = this.add.sprite(buttonX, game.config.height - 90, key + "Key");
            buttonX += 20; //spacing between the display buttons

            this.keyButtons[key].setInteractive();
            this.input.keyboard.on("keydown-" + key, () => {
                //collide = true;
                this.sound.play('beep2');
                this.processKey(key); //process the key to check overlap
            });

        }

        // randomized key deployment
        this.time.addEvent({
            delay: 1200,
            callback: this.deployKey,
            callbackScope: this,
            loop: true
        });
        this.deployKey()
        this.time.delayedCall(12000, () => { //decrease the timer
            if (this.score >= this.maxScore) {
                this.scene.start('Cutscene_B');
            }else if (this.score < this.maxScore) {
                this.scene.start('gameOver1');
            } //check if player has won or lost
        })

        //setting the time
        this.startTime = Date.now();
    }

    deployKey() { //function to deploy the keys with use of helper functions
        let key = randomElem(this.keys);
        this.keyGroups[key].add(this.add.sprite(game.config.width, game.config.height / 2, key + "Key"));
    }

    processKey(key) { //function to process the key and check for overlap
        if (this.physics.world.overlap(this.target, this.keyGroups[key])) {
            // increase the score and update the text
            this.score += 100;
            this.updateScoreText();
        }
        else{//if the key is not pressed on time, shake the camera and decrease the score
            this.cameras.main.shake(100, 0.01);
            this.score -= 200;
            this.updateScoreText();
        }
    }

    updateScoreText() { //function to update the score text
        this.scoreText.text = this.score;
    }
}
