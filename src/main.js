let cursors;
let keyUP, keyC, keyENTER, keyR;

let config = {
    type: Phaser.AUTO,
    height: 640,
    width: 700,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, //set to true for debugging while building and testing
        }
    },
    scene: [ Title, Plaza, Plaza_Cutscene ] 
}
let game = new Phaser.Game(config);