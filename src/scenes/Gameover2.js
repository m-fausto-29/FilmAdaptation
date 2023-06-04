class Gameover1 extends Phaser.Scene{
    constructor(){
        super("gameOver1");
    }
    preload(){
        this.load.image('gg', './assets/temp_gameover.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding gameover screen
        this.gameover = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'gg').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.sound.play('beep1');
            this.scene.start('Carousel');
        }
    }
}