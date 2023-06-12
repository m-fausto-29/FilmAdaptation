/*
    Name: Monserrat Fausto
    Film: Los Olvidados (1950)
    Major Components (Aside from Scenes): Physics, Cameras, Text Objects, Animation Manager(Texture Atlas), Timer
    Gameplay Justification: The boys in the film always had to be on their toes and so does the player in the game. 
    This game represents this by having players keep track of the time and score. The player has to be precise in their timing 
    in order to win the game.
*/
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
    scene: [ Title, Plaza, Plaza_Cutscene, Carousel, Carousel_Cutscene, Barn, Barn_Cutscene, Gameover, Gameover1, Gameover2, Victory1, Victory2, Last_Cutscene, Ending ] //add scenes here
}
let playerStatus;
let game = new Phaser.Game(config);