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
            debug: true, //set to true for debugging while building and testing
        }
    },
    scene: [ Title, Plaza, Plaza_Cutscene, Carousel, Carousel_Cutscene, Barn, Barn_Cutscene, Gameover, Gameover1, Gameover2, Victory1, Victory2, Ending ] 
    // Notes: Add input delay when pressing the keys, increase the size of the sprites, add animations
}
let playerStatus;
let game = new Phaser.Game(config);