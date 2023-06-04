class Title extends Phaser.Scene {
    constructor(){
        super("Title");
    }
    preload(){
        this.load.image('title', './assets/temp_title.png');
    }

    create(){
        // adding title screen
        this.title = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'title').setOrigin(0, 0);

        // defining keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyENTER)){ 
            this.scene.start('Cutscene_P');
        }
    }
}