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
var enemies;
var enemySpawnTime=0;
var timedEvent;
var enemyImage;
var asteroids;
var asteroidImage;
var asteroidEvent;
var enemyBullets;
var explosions;
var explodeAnimation;

function preload ()
{
    //ładowanie obrazków
    this.load.image('background', 'assety/NebulaBlue.png');
    this.load.image('stars', 'assety/Stars.png');
    this.load.image('shipbasic','assety/ship-basic.png');
    this.load.image('bullet','assety/bullet288.png');
   enemyImage = this.load.image('enemy','assety/enemies1.png');
   asteroidImage = this.load.image('asteroid1','assety/asteroidaType1.png');
   this.load.image('asteroid2','assety/asteroidaType2.png');
   this.load.image('asteroid3','assety/asteroidaType3.png');
   this.load.image('asteroid4','assety/asteroidaType4.png');
   this.load.spritesheet('boom', 'assety/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
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
    //this.physics.world.bounds.width = 1400;
    //this.physics.world.bounds.height = 800;
    this.physics.world.setBounds(0, 0, 1400, 800, true, true, false, true);

    //tworzenie statku gracza
    player = this.physics.add.sprite(550,700,'shipbasic').setOrigin(0.5,0.5).setBounce(0.2);
    player.setCollideWorldBounds(true);

    //tworzenie pocisków gracza
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 40
    })

    //tworzenie przeciwników
    enemies = this.physics.add.group();
    timedEvent = this.time.addEvent({delay:3000, callback: createEnemies, callbackScope: this});
    //tworzenie pocisków przeciwników

    //tworzenie asteroid
    asteroids = this.physics.add.group();
    asteroidEvent = this.time.addEvent({delay:5000, callback: createAsteroid, callbackScope: this});

    //kolizje
    //this.physics.add.collider(player,asteroids);
    //this.physics.add.collider(player,enemies);
    //this.physics.add.collider(asteroids,asteroids);
    //this.physics.add.collider(enemies,enemies);
    //this.physics.add.collider(bullets,enemies);
    //this.physics.add.collider(bullets,asteroids);
    this.physics.add.overlap(player,asteroids,playerAsteroidCollision,null,this);

    this.physics.add.overlap(player,enemies,playerEnemyCollision,null,this);
    this.physics.add.overlap(enemies,bullets,enemyPlayerBulletCollision,null,this);

    this.physics.add.overlap(asteroids,bullets,asteroidPlayerBulletCollision,null,this);
    this.physics.add.overlap(enemies,enemies,enemyenemyCollision,null,this);

    this.physics.add.overlap(enemies,asteroids,asteroidEnemyCollision,null,this);
    this.physics.add.overlap(asteroids,asteroids,asteroidAsteroidCollision,null,this);

    //wybuchy
    var config = {
        key: 'explode',
        frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 23, first: 23 }),
        frameRate: 20
    };
    this.anims.create(config);
    //sterowanie
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S });

    //worldbounds
    this.physics.world.on('worldbounds', deleteEnemy);
    
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

function createEnemies()
{
    timedEvent.reset({ delay: Phaser.Math.Between(100,5000), callback: createEnemies, callbackScope: this, repeat: 1});
    var enemyPositionX = Math.floor(Math.random()*1400)+1;
    var enemy = enemies.create(enemyPositionX,10,'enemy');
    enemy.body.setVelocityY(200);
    enemy.setCollideWorldBounds(true);
    enemy.body.onWorldBounds = true;
   // enemy.on('worldbounds',deleteEnemy);
    console.log('fajno');
}
function createAsteroid()
{
    asteroidEvent.reset({ delay: Phaser.Math.Between(100,5000), callback: createAsteroid, callbackScope: this, repeat: 1});
    var asteroidPositionX = Math.floor(Math.random()*1400)+1;
    var table = ['asteroid1','asteroid2','asteroid3','asteroid4'];
    var asteroid = asteroids.create(asteroidPositionX,10,table[Math.floor(Math.random()*3)+0]);
    var asteroidVelocity = Math.floor(Math.random*400)+100;
    asteroid.body.setVelocityY(170);
    asteroid.setCollideWorldBounds(true);
    asteroid.body.onWorldBounds = true;
    console.log('asteroid spawn');
  //  asteroid.on('worldbounds',deleteEnemy);
}

function deleteEnemy(body)
{
    var object = body.gameObject;
    object.destroy();
    console.log('white +1');
}

function asteroidCollide(bodyA, bodyB)
{
    console.log('kolizja z asteroidą');
}

function playerAsteroidCollision(player,asteroid)
{
    //Dla Testu:
    asteroid.destroy();

    console.log('kolizja asteroidy i gracza');
}

function playerEnemyCollision(player,enemy)
{
    enemy.destroy();
    console.log('zderzenie przeciwnika z graczem');
}

function playerEnemyBulletCollision(player,bullet)
{
    console.log('trafiony przez przeciwnika');
}

function enemyPlayerBulletCollision(enemy,bullet)
{
  var explode = this.add.sprite(enemy.body.x+15,enemy.body.y+15,'boom');
  explode.anims.play('explode');
  enemy.destroy();
  bullet.destroy();
  //explode.destroy();
  console.log('celny strzał');
}

function asteroidPlayerBulletCollision(asteroid,bullet)
{
    bullet.destroy();
}
function enemyenemyCollision(enemy1,enemy2)
{
    enemy1.destroy();
    enemy2.destroy();
}
function asteroidEnemyCollision(enemy,asteroid)
{
    enemy.destroy();
}
function asteroidAsteroidCollision(asteroid1,asteroid2)
{
    asteroid1.destroy();
    asteroid2.destroy();
}