let cursors;
let keyUP, keyC, keyENTER, keyR;

let config = {
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, //set to true for debugging while building and testing
        }
    },
    scene: [ Title, Plaza, Plaza_Cutscene, Carousel, Carousel_Cutscene, Barn, Barn_Cutscene, Gameover, Credits ] 
}
let game = new Phaser.Game(config);