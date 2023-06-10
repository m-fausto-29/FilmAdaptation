class Gameover extends Phaser.Scene{
    constructor(){
        super("gameOver");
    }
    preload(){
        this.load.image('gg', './assets/official_gameover.png');
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
            this.scene.start('Plaza');
        }
    }
}