class Barn_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_B");
    }
    preload(){
        this.load.image('cutscene2', './assets/official_cutscene_layout.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding cutscene 3
        this.cutscene3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cutscene2').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){
            this.sound.play('beep1');
            this.scene.start('Barn');
        }
    }
}