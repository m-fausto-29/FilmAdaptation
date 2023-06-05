class Ending extends Phaser.Scene{
    constructor(){
        super("end");
    }
    preload(){
        this.load.image('gg3', './assets/temp_ending.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding gameover screen
        this.end = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'gg3').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.sound.play('beep1');
            this.scene.start('Title');
        }
    }
}