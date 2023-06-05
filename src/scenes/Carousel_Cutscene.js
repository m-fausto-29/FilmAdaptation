class Carousel_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_C");
    }
    preload(){
        this.load.image('cutscene', './assets/temp_cutscene2.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding cutscene 1
        this.cutscene1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cutscene').setOrigin(0, 0);

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