class Carousel extends Phaser.Scene{
    constructor(){
        super('Carousel');
    }
    preload(){
        //load images/tile sprites
        this.load.image('plain_road', 'assets/plain_road.png');
        this.load.spritesheet('witch', 'assets/witch.png',{
            frameWidth: 49,
            frameHeight: 77,
        });
        this.load.image('pitchfork', 'assets/pitchfork.png');
        this.load.image('tree', 'assets/tree.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('display', 'assets/scoreDisplay.png');
    }

    create() {
        this.scrollingField = this.add.tileSprite(0, 0, 0, 0, 'plain_road').setOrigin(0, 0);
        this.display = this.add.tileSprite(0,0,0,0, 'display').setOrigin(0,0)
            .setDepth(1);
        this.playerVelocity = game.config.height / 2
        this.scrollSpeed = game.config.height / 2;

        // create simple cursor input
        cursors = this.input.keyboard.createCursorKeys();
        // init 'R' for reset
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // physics sprite
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height - 100, 'witch')
            .setOrigin(0.5, 1)
            .setScale(game.config.width / 800, game.config.height / 800)
            .setDepth(0.5);
        // scale sprite such that it is always the same relative to screen size
        this.player.body.setSize(20, 30); //adjusting the bounding box size for player
        this.player.setDepth(0.6)
        this.player.displayWidth = game.config.width / 10;
        this.player.displayHeight = game.config.height / 5;
        this.player.setCollideWorldBounds(true);

        // running animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('witch', {start: 0, end: 1, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        this.centerDistance = 0;
        this.obstacles = this.physics.add.group({
            runChildUpdate: true
        });
        this.physics.add.overlap(this.player, this.obstacles, this.setGameOver, null, this);

        //set game over initially to false
        this.gameOver = false;

        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Spectral',
            fontSize: '56px',
            strokeThickness: 2,
            stroke: '013220',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.p1Score = 0;
        this.scoreLeft = this.add.text(0, 0, 'Current Score: ' + this.p1Score, scoreConfig);
        this.scoreLeft.setDepth(1.5)


        // scale difficulty through multiple waves based on distance traveled
        this.obstacleSpeed = 300;    // pitchforks start at 300 speed
        this.obstacleSpeedMultiplier = 1;
        this.startNextWave = 50; // starting at 50
        this.obstacleSpawnDelay = 2000; // initial time between obstacles appearing in ms
        this.obstacleSpawnTimer = this.obstacleSpawnDelay;

        //startup sounds
        this.bgm = this.sound.add('play_bgm');
        this.bgm.setLoop(true);

        this.player.anims.play('run');
        this.time.delayedCall(1000, () => {
            this.bgm.play();})
    }

    update(time, delta){

        if (!this.gameOver){
            this.player.setVelocity(0);

            // starting speed 
            this.scrollingField.tilePositionY -= this.scrollSpeed * (delta / 1000); // normalize scroll speed to pixels per second
            this.centerDistance += (this.scrollSpeed * (delta / 1000) / (game.config.height / 10)); // total distance the screen has scrolled so far

            // increasing challenge
            if (this.centerDistance > this.startNextWave) {
                // obstacles appear a little more frequently and move a little faster
                this.startNextWave += 50;
                this.obstacleSpawnDelay *= 0.975;
                // increase speed up to 600, at first, then start increasing obstacle spawning rate
                if(this.scrollSpeed < 600){
                    this.obstacleSpeedMultiplier += 0.05
                    this.scrollSpeed += 50
                }
            }

            //obstacle spawning
            this.obstacleSpawnTimer -= delta;
            if (this.obstacleSpawnTimer <= 0) {
                this.obstacleSpawnTimer = this.obstacleSpawnDelay;
                switch(Math.floor(Math.random() * 2)){
                    case 0:
                        this.spawnPitchfork(this.obstacleSpeedMultiplier);
                        break;
                    case 1:
                        this.spawnTree();
                        break;
                    default:
                        break;
                }
            }

            //score display
            this.p1Score = Math.floor(this.centerDistance);
            this.scoreLeft.text = 'Current Score: ' + this.p1Score;

            // cursor controls
            let playerMoveX = 0;
            let playerMoveY = 0;
            if (cursors.left.isDown) {
                playerMoveX -= 1;
            }
            if (cursors.right.isDown) {
                playerMoveX += 1;
            }
            if (cursors.up.isDown) {
                playerMoveY -= 1;
            } 
            if (cursors.down.isDown) {
                playerMoveY += 1;
            }

            this.player.setVelocityX(playerMoveX * this.playerVelocity);
            this.player.setVelocityY(playerMoveY * this.playerVelocity);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('magic');
            this.scene.restart();
        }
    }
    // put a pitchfork on the screen with given horizontal speed coming from a random side of the screen
    spawnPitchfork(multiplier) {
        let x = 0;
        let d = 0;
        if (Math.random() >= 0.5) {
            x = -10;
            d = 1;
        } else {
            x = game.config.width + 10;
            d = -1;
        }
        let [startingX, direction] = [x, d];
        let range = (game.config.height / 5) - (-(game.config.height / 5));
        let val = Math.random() * range;
        let startingY = val + (-(game.config.height / 5));
        this.obstacles.add(new Pitchfork(this, startingX, startingY, 'pitchfork', 0, this.obstacleSpeed * direction, multiplier), true)
            .setDepth(0.5); 
    }
    spawnTree() {
        // tree will spawn at the top near the player's x position
        let range = (this.player.x + (game.config.width / 5)) - (this.player.x - (game.config.width / 5));
        let val = Math.random() * range;
        let startingX = val + (this.player.x - (game.config.width / 5));
        // limit x position to within game bounds
        startingX = Math.min(Math.max(startingX, game.config.width * (1 / 15)), game.config.width - game.config.width * (1 / 15));
        this.obstacles.add(new Tree(this, startingX, 75, 'tree', 0), true)
            .setDepth(0.5);
    }

    setGameOver() {
        this.bgm.stop();
        this.sound.play('grunt');
        this.player.stop();
        this.gameOver = true;
        this.player.disableBody();
        tries += 1;
        let highScoreColor = '#FFFFFF'
            
            if (this.p1Score > highScore) {
                highScore = this.p1Score;
                highScoreColor = '#FEE12B';
            }

        // delay this part just a bit to make it look like the sprites actually collide
        this.time.delayedCall(50, () => {
            this.physics.world.disable(this.obstacles);   
        })
        
        
        // show game over stuff after a couple seconds
        this.time.delayedCall(2000, () => {
            //game over display
            let gameoverConfig = {
                fontFamily: 'Spectral',
                fontSize: '100px',
                color: '#FFFFFF',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
            }

            this.gameoverScreen = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'gameover')
                .setOrigin(0, 0)
                .setDepth(1.5);
            gameoverConfig.fontSize = '70px';
            this.add.text(game.config.width / 2, game.config.height / 2 - 75, 'Score: ' + this.p1Score, gameoverConfig)
                .setOrigin(0.5)
                .setDepth(1.5);

            gameoverConfig.fontSize = '50px';
            gameoverConfig.color = highScoreColor;
            this.add.text(game.config.width / 2, game.config.height / 1.9, 'High Score: ' + highScore, gameoverConfig)
                .setOrigin(0.5)
                .setDepth(1.5);
            
            gameoverConfig.color = '#FFFFFF'
            this.add.text(game.config.width / 2, game.config.height / 2 + 100, 'Total Runs: ' + tries, gameoverConfig)   
                .setOrigin(0.5)
                .setDepth(1.5);
            gameoverConfig.fontSize = '45px';

            this.sound.play('end');

        });
    }
}