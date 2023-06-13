
//helper functions to aid in randomly generating the keys
function randomInt(min, max) {
    return Math.floor(Phaser.Math.Linear(min, max, Math.random()));
}

function randomElem(array) {
    return array[randomInt(0, array.length)]
}

class Plaza extends Phaser.Scene {
    
    constructor() {
        super("Plaza");
    }

    preload(){
        //loading used assets
        this.load.image('bg', './assets/official_gameplay.png');
        this.load.image('back', './assets/plaza_bg.png');
        this.load.image("AKey", "./assets/AKey1.png");
        this.load.image("DKey", "./assets/DKey1.png");
        this.load.image("SKey", "./assets/SKey1.png");
        this.load.image("QKey", "./assets/QKey1.png");
        this.load.image("WKey", "./assets/WKey1.png");
        this.load.image("target", "assets/target2.png");
        this.load.atlas('play_cut', 'assets/plaza_spritesheet.png', 'assets/cut.json');
        //loading used sfx
        this.load.audio('beep2', './assets/correct_beep.wav');
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
        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg').setOrigin(0, 0);
        this.bg.setDepth(10);

        this.back_bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'back').setOrigin(0, 0);
        this.back_bg.setDepth(-1);

        this.anims.create({ //creating the animation
            key: 'cut',
            frames: this.anims.generateFrameNames('play_cut', {
                prefix: 'cut(',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 3,
            repeat: -1      // loop animation
        });

        // add animation
        this.boy = this.add.sprite(game.config.width/2, game.config.height/2, 'play_cut', 'cut(1)');

        //initializing the keys
        this.keysVelocity = -95;
        this.keys = ["A", "D", "S", "Q", "W"];
        this.keyGroups = {};
        this.keyButtons = {};
        let buttonX = 296;

        //initializing the target
        this.target = this.physics.add.sprite(game.config.width / 5, game.config.height / 2 + 140, "target");
        this.target.body.setSize(8, 30);

        //initializing the score and goal score
        this.score = 0;
        this.maxScore = 500;   

        // The score text
        this.scoreText = this.add.text(95, 88, "SCORE", { fontFamily: "papyrus", fontSize: "50px", color: '#000000', }); //changing the font
        

        for (let key of this.keys) { //generating the keys and their buttons
            this.keyGroups[key] = this.physics.add.group({ velocityX: this.keysVelocity });
            this.keyButtons[key] = this.add.sprite(buttonX, game.config.height - 93, key + "Key");
            this.keyButtons[key].setScale(.3);
            buttonX += 28;

            this.keyButtons[key].setInteractive();
            this.input.keyboard.on("keydown-" + key, () => {
                //this.sound.play('beep2');
                this.processKey(key); //process the key to check overlap
            });

        }

        // randomized key deployment
        this.time.addEvent({
            delay: 1500,
            callback: this.deployKey,
            callbackScope: this,
            loop: true
        });
        this.deployKey()
        this.time.delayedCall(12000, () => {
            if (this.score >= this.maxScore) {
                this.scene.start('victory1');
            }else if (this.score < this.maxScore) {
                this.scene.start('gameOver');
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
        this.boy.play('cut', true); //play the animation
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
