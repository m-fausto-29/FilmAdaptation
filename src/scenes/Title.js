class Title extends Phaser.Scene {
    constructor(){
        super("Title");
    }
    preload(){
        this.load.image('title', './assets/official_title.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding title screen
        this.title = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'title').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.sound.play('beep1');
            this.scene.start('Cutscene_P');
        }
    }
}