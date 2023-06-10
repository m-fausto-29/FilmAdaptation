class Plaza_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_P");
    }
    preload(){
        this.load.image('cutscene', './assets/official_cutscene_layout.png');
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
            this.scene.start('Plaza');
        }
    }
}