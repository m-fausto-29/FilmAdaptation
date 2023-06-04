class Barn_Cutscene extends Phaser.Scene {
    constructor(){
        super("Cutscene_P");
    }
    preload(){
        this.load.image('cutscene', './assets/temp_cutscene.png');
    }

    create(){
        // adding cutscene 3
        this.cutscene3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cutscene').setOrigin(0, 0);

        // defining keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start('Barn');
        }
    }
}