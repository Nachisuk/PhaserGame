var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 800,
    parent: 'gamediv',
    physics:{
        default: 'arcade',
        arcade:{

        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//tworzenie gry?
var game = new Phaser.Game(config);

//zmienne gry
var background;
var starsfield;
var player;
var cursors;

function preload ()
{
    //ładowanie obrazków
    this.load.image('background', 'assety/NebulaBlue.png');
    this.load.image('stars', 'assety/Stars.png');
    this.load.image('shipbasic','assety/ship-basic.png');

}

function create ()
{
    //środkowanie?
    //this.cameras.main.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);

    //tworzenie tła
    background = this.add.image(1400, 800, 'background');
    starsfield =  this.add.tileSprite(0, 0, 2400, 1800, 'stars');

    //tworzenie granic gry
    this.physics.world.bounds.width = 1400;
    this.physics.world.bounds.height = 800;

    //tworzenie statku gracza
    player = this.physics.add.sprite(550,700,'shipbasic').setOrigin(0.5,0.5).setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.onWorldBounds = true;


    //sterowanie
    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    //'animacja' tła
    starsfield.tilePositionY -= 0.5;
    //reset
    player.body.setVelocityX(0);
    player.body.setVelocityY(0);
    //sterowanie
        if(cursors.left.isDown)
        {
            player.body.setVelocityX(-200);
        }
        else if(cursors.right.isDown)
        {
            player.body.setVelocityX(200);
        }
        
        if(cursors.up.isDown)
        {
            player.body.setVelocityY(-200);
        }

        if(cursors.down.isDown)
        {
            player.body.setVelocityY(200);
        }
}