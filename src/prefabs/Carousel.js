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
        this.load.image('bg1', './assets/official_gameplay.png');
        this.load.image('anim', './assets/carousel_bg.png');
        this.load.image("AKey", "./assets/AKey.png");
        this.load.image("DKey", "./assets/DKey.png");
        this.load.image("SKey", "./assets/SKey.png");
        this.load.image("QKey", "./assets/QKey.png");
        this.load.image("WKey", "./assets/WKey.png");
        this.load.image("target", "assets/target.png");
        this.load.atlas('play_push', 'assets/carousel_spritesheet.png', 'assets/push.json');
        //loading used sfx
        this.load.audio('beep2', './assets/temp_beep2.wav');
        this.load.audio('beep3', './assets/explosion38.wav');
    }

    create() {

        playerStatus = {//init player status with default timer value
            timer: 100
        }

        // timer bar
        this.timerBorder = this.add.rectangle(game.config.width - 215, 95, 102, 25, 0x000000);
        this.timerBorder.setOrigin(0, 0).setScrollFactor(0);
        this.timerMeter = this.add.rectangle(game.config.width - 213, 96, 100, 23, 0x0000ff).setOrigin(0, 0);
        this.timerMeter.setScrollFactor(0);

        this.playTimer = this.time.addEvent({ //init timer bar event
            delay: 120,
            callback: this.decrTimer,
            callbackScope: this,
            loop: true
        });

        // setting the background
        this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg1').setOrigin(0, 0);
        this.bg1.setDepth(10);

        this.anim_bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'anim').setOrigin(0, 0);
        this.anim_bg.setDepth(-1);

        this.anims.create({ //creating push animation
            key: 'push',
            frames: this.anims.generateFrameNames('play_push', {
                prefix: 'push(',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 3,
            repeat: -1      // loop animation
        });

        // add boy
        this.boy = this.add.sprite(game.config.width/2, game.config.height/2, 'play_push', 'push(1)').setScale(2);

        //initializing the keys
        this.keysVelocity = -200; //speed of the keys
        this.keys = ["A", "D", "S", "Q", "W"];
        this.keyGroups = {};
        this.keyButtons = {};
        let buttonX = 296; //position of the display buttons

        //initializing the target
        this.target = this.physics.add.sprite(game.config.width / 5, game.config.height / 2 + 140, "target");
        this.target.body.setSize(8, 30);

        //initializing the score and goal score
        this.score = 0;
        this.maxScore = 800;   

        // The score text
        this.scoreText = this.add.text(95, 88, "SCORE", { fontFamily: "papyrus", fontSize: "50px", color: '#000000', });
        

        for (let key of this.keys) { //generating the keys and their buttons
            this.keyGroups[key] = this.physics.add.group({ velocityX: this.keysVelocity });
            this.keyButtons[key] = this.add.sprite(buttonX, game.config.height - 90, key + "Key");
            this.keyButtons[key].setScale(.3);
            buttonX += 28; //spacing between the display buttons

            this.keyButtons[key].setInteractive();
            this.input.keyboard.on("keydown-" + key, () => {
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
                this.scene.start('victory2');
            }else if (this.score < this.maxScore) {
                this.scene.start('gameOver1');
            } //check if player has won or lost
        })

    }

    deployKey() { //function to deploy the keys with use of helper functions
        let key = randomElem(this.keys);
        this.keyGroups[key].add(this.add.sprite(game.config.width, game.config.height / 2 + 136, key + "Key"));
    }

    processKey(key) { //function to process the key and check for overlap
        this.timeLeft -= 1;
        if (this.physics.world.overlap(this.target, this.keyGroups[key])) {
            this.sound.play('beep2');
            // increase the score and update the text
            this.score += 100;
            this.updateScoreText();
        }
        else{//if the key is not pressed on time, shake the camera and decrease the score
            this.cameras.main.shake(100, 0.01);
            this.sound.play('beep3');
            this.score -= 200;
            this.updateScoreText();
        }
    }

    decrTimer() { //function to decrease the timer bar
        this.boy.play('push', true); //play the push animation
        this.anim_bg.tilePositionX -= 4; //move the background
        let newTimer = Math.max(0, playerStatus.timer - 1);
        playerStatus.timer = newTimer;
        this.timerMeter.displayWidth = newTimer;
        if (newTimer === 0){
            this.timerBorder.setFillStyle(0xff0000, 1);
        }
    }

    updateScoreText() { //function to update the score text
        this.scoreText.text = this.score;
    }
}
