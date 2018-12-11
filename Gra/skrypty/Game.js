var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var starsfield;

function preload ()
{
    this.load.image('background', 'assety/NebulaBlue.png');
    this.load.image('stars', 'assety/Stars.png');

}

function create ()
{
    this.add.image(400, 300, 'background');
    starsfield =  this.add.tileSprite(0, 0, 2400, 1800, 'stars');
}

function update ()
{
    starsfield.tilePositionY -= 0.5;
}