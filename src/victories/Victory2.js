class Victory2 extends Phaser.Scene{
    constructor(){
        super("victory2");
    }
    preload(){
        this.load.image('ez1', './assets/official_victory.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        // adding gameover screen
        this.victory2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ez1').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.sound.play('beep1');
            this.scene.start('Cutscene_B');
        }
    }
}