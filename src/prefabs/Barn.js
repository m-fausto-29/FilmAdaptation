//helper functions to aid in randomly generating the keys
function randomInt(min, max) {
    return Math.floor(Phaser.Math.Linear(min, max, Math.random()));
}

function randomElem(array) {
    return array[randomInt(0, array.length)]
}
class Barn extends Phaser.Scene {
    constructor() {
        super("Barn");
    }

    preload(){
        //loading used assets
        this.load.image('bg2', './assets/official_gameplay.png');
        this.load.image('back1', './assets/barn_bg.png');
        this.load.image("AKey", "./assets/AKey.png");
        this.load.image("DKey", "./assets/DKey.png");
        this.load.image("SKey", "./assets/SKey.png");
        this.load.image("QKey", "./assets/QKey.png");
        this.load.image("WKey", "./assets/WKey.png");
        this.load.image("target", "assets/target.png");
        this.load.atlas('play_punch', 'assets/barn_spritesheet.png', 'assets/punch.json');
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
        this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg2').setOrigin(0, 0);
        this.bg2.setDepth(10);

        this.back_bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'back1').setOrigin(0, 0);
        this.back_bg1.setDepth(-1);

        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNames('play_punch', {
                prefix: 'punch(',
                start: 1,
                end: 2,
                suffix: ')'
            }),
            frameRate: 3,
            repeat: -1      // loop animation
        });

        // add boy
        this.boy = this.add.sprite(game.config.width/2, game.config.height/2, 'play_punch', 'punch(1)').setScale(2);

        //initializing the keys
        this.keysVelocity = -250;
        this.keys = ["A", "D", "S", "Q", "W"];
        this.keyGroups = {};
        this.keyButtons = {};
        let buttonX = 296;

        //initializing the target
        this.target = this.physics.add.sprite(game.config.width / 5, game.config.height / 2 + 140, "target");
        this.target.body.setSize(8, 30);

        //initializing the score and goal score
        this.score = 0;
        this.maxScore = 1000;   

        // The score text
        this.scoreText = this.add.text(95, 88, "SCORE", { fontFamily: "papyrus", fontSize: "50px", color: '#ffffff', });
        

        for (let key of this.keys) { //generating the keys and their buttons
            this.keyGroups[key] = this.physics.add.group({ velocityX: this.keysVelocity });
            this.keyButtons[key] = this.add.sprite(buttonX, game.config.height - 90, key + "Key");
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
            delay: 1000,
            callback: this.deployKey,
            callbackScope: this,
            loop: true
        });
        this.deployKey()
        this.time.delayedCall(12000, () => {
            if (this.score >= this.maxScore) {
                this.scene.start('Cutscene_L');
            }else if (this.score < this.maxScore) {
                this.scene.start('gameOver2');
            } //check if player has won or lost
        })

        //setting the time
        this.startTime = Date.now();
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
        else{
            this.cameras.main.shake(100, 0.01);
            this.sound.play('beep3');
            this.score -= 200;
            this.updateScoreText();
        }
    }

    decrTimer() { //function to decrease the timer bar
        this.boy.play('punch', true);
        //this.anim_bg.tilePositionX += 4;
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
