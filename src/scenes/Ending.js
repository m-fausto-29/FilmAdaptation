class Ending extends Phaser.Scene{
    constructor(){
        super("end");
    }
    preload(){ //preloading relevant assets
        this.load.image('gg3', './assets/official_ending.png');
        this.load.audio('beep1', './assets/scene_transition.wav');
        this.load.audio('play_end', './assets/ending_music.wav');
    }

    create(){
        //adding fade in effect
        this.cameras.main.setBackgroundColor('#421278');
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // adding gameover screen
        this.end = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'gg3').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //startup sounds
        this.end_bgm = this.sound.add('play_end');
        this.end_bgm.setLoop(true);
        this.time.delayedCall(100, () => {
            this.end_bgm.play();})
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.end_bgm.stop();
            this.sound.play('beep1');
            //adding fade out effect
            this.cameras.main.fadeOut(1000, 0, 0, 0); 
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.time.delayedCall(1000, () => {
                    this.scene.start('Title');
                })
            });
        }
    }
}