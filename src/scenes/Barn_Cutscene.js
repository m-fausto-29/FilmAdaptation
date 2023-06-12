class Barn_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_B");
    }
    preload(){
        this.load.image('cutscene2', './assets/barn_cutscene.png');
        this.load.audio('beep1', './assets/temp_beep1.wav');
    }

    create(){
        //adding fade in effect
        this.cameras.main.setBackgroundColor('#421278');
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // adding cutscene 3
        this.cutscene3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cutscene2').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){
            this.sound.play('beep1');
            //adding fade out effect
            this.cameras.main.fadeOut(1000, 0, 0, 0); 
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.time.delayedCall(1000, () => {
                    this.scene.start('Barn');
                })
            });
        }
    }
}