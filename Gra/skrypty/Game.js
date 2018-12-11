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
var fireButton;
var player;
var speed;
var bullets;
var cursors;
var firerate=0;
var clock;

function preload ()
{
    //ładowanie obrazków
    this.load.image('background', 'assety/NebulaBlue.png');
    this.load.image('stars', 'assety/Stars.png');
    this.load.image('shipbasic','assety/ship-basic.png');
    this.load.image('bullet','assety/bullet288.png');

}

function create ()
{
    //środkowanie?
    //this.cameras.main.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);

    clock = Phaser.Time.Clock;
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

    //tworzenie pocisków gracza
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 40
    })
    //sterowanie
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S });
}

function update (time,delta)
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
        if (fireButton.up.isDown)
        {
                fireBullet();
        }

    bullets.children.each(function (b){
        if (b.active) {
            if (b.body.y < -100) {
                b.destroy();
                b.setActive(false);
            }
        }
    }.bind(this));
}

function fireBullet () {

        if(Date.now() > firerate)
        {
            bullet = bullets.get(player.body.x+50,player.body.y)

            if (bullet)
            {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.body.setVelocityY(-300);
                firerate = Date.now() +300;
            }
        }
    

}