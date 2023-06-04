class Title extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }
    preload(){
        this.load.image('title', './assets/temp_title.png');
    }

    create(){
        // adding title screen
        this.title = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'title').setOrigin(0, 0);

        // defining keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){ 
            this.scene.start('tutorial');
        }
    }
}