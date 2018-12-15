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

var present;
var presentImage;
var roundFromPresent;
var presentTimedEvent;

var firePower;
var enemyHorizontalVelocity;

function preload ()
{
    //ładowanie obrazków
    this.load.image('background', 'assety/NebulaBlue.png');
    this.load.image('stars', 'assety/Stars.png');
    //this.load.image('shipbasic','assety/ship-basic.png');
    this.load.spritesheet('shipbasic_anim', 'assety/ship-basic_multi.png', { frameWidth: 93, frameHeight: 110});
    this.load.image('bullet','assety/bullet288.png');
    this.load.spritesheet('enemys', 'assety/enemies.png', { frameWidth: 64, frameHeight: 64});
   //enemyImage = this.load.image('enemy','assety/enemies1.png');
   asteroidImage = this.load.image('asteroid1','assety/asteroidaType1.png');
   this.load.image('asteroid2','assety/asteroidaType2.png');
   this.load.image('asteroid3','assety/asteroidaType3.png');
   this.load.image('asteroid4','assety/asteroidaType4.png');
   this.load.spritesheet('boom', 'assety/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
   this.load.spritesheet('coin', 'assety/coin.png', { frameWidth: 32, frameHeight: 32});
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
    player = this.physics.add.sprite(550,700,'shipbasic_anim',0).setOrigin(0.5,0.5).setBounce(0.2);
    
    player.setCollideWorldBounds(true);
    
    this.anims.create({
        key: 'shipbasic',
        frames: this.anims.generateFrameNumbers('shipbasic_anim', { start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    player.anims.play('shipbasic');

    firePower = 1;
    enemyHorizontalVelocity = 150;
    
    //tworzenie pocisków gracza
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 40
    })

    //tworzenie przeciwników
    enemies = this.physics.add.group();
    timedEvent = this.time.addEvent({delay:2000, callback: createEnemies, callbackScope: this});
    timedEvent.paused = true;
    //tworzenie pocisków przeciwników

    //tworzenie asteroid
    asteroids = this.physics.add.group();
   // asteroidEvent = this.time.addEvent({delay:5000, callback: createAsteroid, callbackScope: this});

   present = this.physics.add.group();
   roundFromPresent = -1;
   presentTimedEvent = this.time.addEvent({delay:2000, callback: createPresent, callbackScope: this});
   presentTimedEvent.paused = true;

    //kolizje
    //this.physics.add.collider(player,asteroids);
    //this.physics.add.collider(player,enemies);
    //this.physics.add.collider(asteroids,asteroids);
    //this.physics.add.collider(enemies,enemies);
    //this.physics.add.collider(bullets,enemies);
    //this.physics.add.collider(bullets,asteroids);

    this.physics.add.overlap(player, present, playerPresentCollision, null, this);

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

    var config2 = {
        key: 'presentImage',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 6}),
        frameRate: 20,
        repeat: -1
    };
    this.anims.create(config2);

    //sterowanie
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.SPACE, 'down': Phaser.Input.Keyboard.KeyCodes.S });

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
            player.body.setVelocityX(-300);
        }
        else if(cursors.right.isDown)
        {
            player.body.setVelocityX(300);
        }
        
        if(cursors.up.isDown)
        {
            player.body.setVelocityY(-300);
            starsfield.tilePositionY -= 0.7;
        }

        if(cursors.down.isDown)
        {
            player.body.setVelocityY(300);
            starsfield.tilePositionY += 0.2;
        }
        if (fireButton.up.isDown)
        {
                fireBullet();
        }


    enemies.children.each(function(e){
        if (e.body.onWall()){
            console.log("NA ścianie!");
        }
        if (e.body.onFloor()){
            deleteEnemy(e.body);
        }
            
    })

    bullets.children.each(function (b){
        if (b.active) {
            if (b.body.y < -100) {
                b.destroy();
                b.setActive(false);
            }
        }
    }.bind(this));


    if(enemies.getLength()==0 && presentTimedEvent.paused == true)//jezeli nie mamy na ekranie juz przeciwnikow i nie tworzy sie prezent
    {
        if (timedEvent.paused && roundFromPresent == 1) // jezeli nie tworzą się jeszcze enemy a juz to druga runda byla
        {
            presentTimedEvent.paused = false; //wywolaj tworzenie prezentu
            roundFromPresent = 0; //runda -> 0 
        }
        else if (timedEvent.paused) //jezeli jest to jakas inna runda a a nie tworza sie jeszcze przeciwnicy 
        {
            roundFromPresent++; //zwieksz runde
            timedEvent.paused = false; //wznow tworzenie przeciwnikow
        }
        else 
        {
            timedEvent.paused = false; //wznow tworzenie przeciwnikow
        }
        
    }
    else 
    {
        timedEvent.paused = true;
    }

    
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
    
    timedEvent.reset({ delay: Phaser.Math.Between(3000,10000), callback: createEnemies, callbackScope: this, repeat: 1});
    var enemyPositionX = 100;
    var enemyAmount = Math.floor(Math.random()*10)+1;
    for(var i =0; i< enemyAmount; i++)
    {

        var enemy = enemies.create(enemyPositionX,10,'enemys',1);
        enemy.body.setVelocityY(20);
        enemy.body.setVelocityX(enemyHorizontalVelocity);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1,0);
        //enemy.body.onWorldBounds = true;
        enemy.hitpoints = 2;
        enemyPositionX = enemyPositionX + 150;
        
    }

   // enemy.on('worldbounds',deleteEnemy);
    console.log('fajno');
}

function createPresent()
{
    presentTimedEvent.reset({delay:2000, callback: createPresent, callbackScope: this, repeat: 1});
    var presentPositionX = Math.floor(Math.random()*1400)+1;
    var presentTMP = present.create(presentPositionX,10,presentImage);
    presentTMP.play('presentImage');
    presentTMP.body.setVelocityY(170);
    presentTMP.setCollideWorldBounds(true);
    presentTMP.body.onWorldBounds = true;
    roundFromPresent = -1;
    presentTimedEvent.paused = true;
    console.log("Stworzyl sie present");
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

  enemy.hitpoints = enemy.hitpoints-firePower;
  if(enemy.hitpoints <= 0)
  {
    var explode = this.add.sprite(enemy.body.x+15,enemy.body.y+15,'boom');
    explode.anims.play('explode');
    enemy.destroy();
  }
  bullet.destroy();
  //explode.destroy();
  console.log('celny strzał');
}


function playerPresentCollision(player, presentTMP)
{
    roundFromPresent = 0;

    //dostaje losową nową broń

    presentTMP.destroy();

    timedEvent.paused = false;
  console.log('zebrano bonus');
}

function asteroidPlayerBulletCollision(asteroid,bullet)
{
    bullet.destroy();
}
function enemyenemyCollision(enemy1,enemy2)
{
   // enemy1.destroy();
  //  enemy2.destroy();
}
function asteroidEnemyCollision(enemy,asteroid)
{
   // enemy.destroy();
}
function asteroidAsteroidCollision(asteroid1,asteroid2)
{
    asteroid1.destroy();
    asteroid2.destroy();
}