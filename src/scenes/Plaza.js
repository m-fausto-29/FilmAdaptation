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
        this.load.image('bg', './assets/temp_bg.png');
        this.load.image("AKey", "./assets/AKey.png");
        this.load.image("DKey", "./assets/DKey.png");
        this.load.image("SKey", "./assets/SKey.png");
        this.load.image("QKey", "./assets/QKey.png");
        this.load.image("WKey", "./assets/WKey.png");
        this.load.image("target", "assets/target.png");
    }

    create() {

        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'bg').setOrigin(0, 0);
        this.bg.setDepth(-1);
        this.keysVelocity = -80;
        
        this.keys = ["A", "D", "S", "Q", "W"];
        this.keyGroups = {};
        this.keyButtons = {};
        let buttonX = 89;
        this.target = this.physics.add.sprite(game.config.width / 2, game.config.height / 2 + 4, "target");
        this.target.body.setSize(8, 30);
        let collide = false;
        this.score = 0;       

        this.input.keyboard.on('keydown', collide =>
        {

            collide = true;

        });

        // The score text
        this.scoreText = this.add.text(100, 100, "SCORE", { fontFamily: "arial", fontSize: "50px" });
        

        for (let key of this.keys) {
            this.keyGroups[key] = this.physics.add.group({ velocityX: this.keysVelocity });
            this.keyButtons[key] = this.add.sprite(buttonX, game.config.height - 90, key + "Key");
            buttonX += 20;

            this.keyButtons[key].setInteractive();
            this.keyButtons[key].on('keydown', () => {
                collide = true;
                this.processKey(key);
            });
        }

        this.time.addEvent({
            delay: 1500,
            callback: this.deployKey,
            callbackScope: this,
            loop: true
        });
        
        this.deployKey()
        this.time.delayedCall(9000, () => {
            this.scene.start('Title');
        })
        this.startTime = Date.now();
    }
    deployKey() {
        let key = randomElem(this.keys);
        this.keyGroups[key].add(this.add.sprite(game.config.width, game.config.height / 2, key + "Key"));
    }

    processKey(key) {
        if (this.physics.world.overlap(this.target, this.keyGroups[key] && isKeyPressed(key + "Key"))) {
            collide = true;
            let group = this.keyGroups[key].getChildren();
            group.shift().destroy();
            // increase the score and update the text
            this.score += 100;
            this.updateScoreText();
        }
        else{
            collide = false;
            this.cameras.main.shake(100, 0.01);
            this.score -= 200;
            this.updateScoreText();
        }
    }
    updateScoreText() {
        this.scoreText.text = this.score;
    }
}
