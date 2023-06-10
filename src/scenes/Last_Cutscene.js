class Last_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_L");
    }
    preload(){
        this.load.image('cutscene3', './assets/official_last_scene.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding cutscene 4
        this.cutscene4 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cutscene3').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){
            this.sound.play('beep1');
            this.scene.start('end');
        }
    }
}