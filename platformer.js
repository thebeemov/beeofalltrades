let player1
let player2
let playersDead=0
let multiplier=130
let oldMult=0
let movingBees=[]
let platforms
let nextX=0
let maxFall=600
let limit=6
let bgCount=2

let obstacles=[
    [
        2,
        {x:100, y:450, scl:.5, type: 'platH'},
        {x:550, y:350, scl:.5, type: 'platH'},
        {x:1200, y:250, scl:.5, type: 'platV'},
        {x:1200, y:490, scl:.5, type: 'platV'},
        {x:1075, y:250, scl:.5, type: 'platH'},
        {x:1525, y:350, scl:.5, type: 'platH'},
        {x:1975, y:450, scl:.5, type: 'platH'}
    ],  
    [
        3,
        {x:100, y:450, scl:.5, type: 'platH'},
        {x:550, y:350, scl:.5, type: 'platH'},
        {x:1000, y:250, scl:.5, type: 'platH'},
        {x:1550, y:150, scl:.5, type: 'platV'},
        {x:1550, y:390, scl:.5, type: 'platV'},
        {x:1425, y:150, scl:.5, type: 'platH'},
        {x:1950, y:-70, scl:.5, type: 'platV'},
        {x:1950, y:170, scl:.5, type: 'platV'},
        {x:1825, y:410, scl:.5, type: 'platH'},
    ],
    [
        2,
        {x:50, y:450, scl:.5, type: 'platH'},
        {x:500, y:350, scl:.5, type: 'platH'},
        {x:1000, y:250, scl:.5, type:'platV'},
        {x:1000, y:490, scl:.5, type: 'platV'},
        {x:1200, y:-70, scl:.5, type: 'platV'},
        {x:1200, y:170, scl:.5, type: 'platV'}
    ],
    [
        2,
        {x:350, y:450, scl:1, type: 'platV'},
        {x:350, y:-300, scl:1, type: 'platV'},
        {x:950, y:450, scl:1, type: 'platV'},
        {x:950, y:-300, scl:1, type: 'platV'}
    ],
    [
        3,
        {x:100, y:430, scl:1, type: 'platH'},
        {x:980, y:300, scl:1, type: 'platV'},
        {x:740, y:300, scl:1, type: 'platH'},
        {x:1620, y:170, scl:1, type: 'platV'},
        {x:1380, y:170, scl:1, type: 'platH'},
    ]
]

var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 600,
    physics: {
        default: 'arcade',
    },
    fps: {forceSetTimeOut: true, fps: 60},
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y){
        super(scene,x,y,'bee')
        scene.add.existing(this)
        this.setScale(.4)
        scene.physics.add.existing(this)
        this.setGravityY(3000)
        this.score=0
        this.canMove=true
        this.setOrigin(0)
        this.grace=0
        this.jBuffer=0
    }

    killPlayer(){
        this.score=this.body.x
        this.canMove=false
        playersDead++
        console.log(playersDead)
    }

    upKeep(){
        if(this.grace>0){
            this.grace--
        }
        if(this.jBuffer>0){
            this.jBuffer--
        }
        if (this.body.touching.down){
            this.grace=5
            if (this.jBuffer>0){
                this.jBuffer=0
                this.grace=0
                this.setVelocityY(-1050)
            }
        }
    }

    playerJump(){
        this.jBuffer=5
        if (this.grace>0){
            this.grace=0
            this.jBuffer=0
            this.setVelocityY(-1050)
        }
    }
}

class WallBee extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'beevil')
        scene.add.existing(this)
        this.setScale(.6)
        this.setOrigin(0)
    }
}

var game=new Phaser.Game(config)

function preload(){
    this.load.image('background', 'images/scrollingPerhaps.png')
    this.load.image('bee', 'images/playerBee.png')
    this.load.image('platH', 'images/honeycombplatform.png')
    this.load.image('beevil', 'images/beevil.png')
    this.load.image('platV', 'images/honeycombPlatform2.png')
}

function create(){
    for (let i=0; i<2; i++){
        this.add.image(-500+1146*i, -500, 'background').setOrigin(0).scrollFactorX=.33
    }

    platforms = this.physics.add.staticGroup()
    createPlatforms([1])
    
    player1=new Player(this, 600, 400).setTint(0xaa3030)
    player2=new Player(this, 600, 400).setTint(0x5050ff)

    this.physics.add.collider(player1, platforms)
    this.physics.add.collider(player2, platforms)

    camera=this.cameras.main.setBounds(0,0, Number.MAX_SAFE_INTEGER, 600)

    cursors = this.input.keyboard.createCursorKeys()
    keys = this.input.keyboard.addKeys('W, A, D')
    keys.W.on('down', p2jump)
    cursors.up.on('down', p1jump)

    //make bees
    for (let i=0; i<15; i++){
        movingBees.push(new WallBee(this, 90*Math.random()-100, game.scale.height*Math.random()-100).setScrollFactor(0).setDepth(2))
        movingBees.push(new WallBee(this, 70*Math.random()-80, game.scale.height-i*game.scale.height/10-90).setScrollFactor(0).setDepth(1))
    }
}

function update(){
    player1.upKeep()
    player2.upKeep()
    
    if (multiplier>700+oldMult){
        let temp=multiplier
        multiplier=700+oldMult
        oldMult=temp
        limit+=.8
    }

    let maxSpd=900
    let accel=160
    let decel=250

    camera.scrollX+=1.02**multiplier*Math.log(1.02)<limit ? 1.02**multiplier*Math.log(1.02) : limit
    multiplier++

    if (camera.scrollX>(bgCount-2)*1146){
        this.add.image(-500+1146*bgCount, -500, 'background').setOrigin(0).setDepth(-1).scrollFactorX=.33
        bgCount++
    }

    if (player1.body.x-camera.scrollX<10 && player1.canMove) player1.killPlayer()
    if (player2.body.x-camera.scrollX<10 && player2.canMove) player2.killPlayer()

    if (camera.scrollX>640*(nextX-4)){
        createPlatforms(obstacles[Math.floor(obstacles.length*Math.random())])
    }

    if (player1.canMove && player1.x<camera.scrollX+1440){
        if (cursors.left.isDown){
            player1.setVelocityX(appr(accel, -1*maxSpd, player1.body.velocity.x))
        } else if (cursors.right.isDown){
            player1.setVelocityX(appr(accel, maxSpd, player1.body.velocity.x))
        } else {
            player1.setVelocityX(appr(decel, 0, player1.body.velocity.x))
        }

        if (player1.body.velocity.y>=maxFall){
            player1.body.velocity.y=maxFall
        }
    }

    if (player2.canMove && player2.x<camera.scrollX+1440){
        if (keys.A.isDown){
            player2.setVelocityX(appr(accel, -1*maxSpd, player2.body.velocity.x))
        } else if (keys.D.isDown){
            player2.setVelocityX(appr(accel, maxSpd, player2.body.velocity.x))
        } else {
            player2.setVelocityX(appr(decel, 0, player2.body.velocity.x))
        }

        if (player2.body.velocity.y>=maxFall){
            player2.body.velocity.y=maxFall
        }
    }

    for(let i=0; i<movingBees.length; i++){
        movingBees[i].x+=(3*Math.sin((i+multiplier)%60*Math.PI/30))
    }

    if(playersDead==2){
        winner = player1.score>player2.score ? 'Player 1' : 'Player 2'
        this.add.text(game.scale.width/2, game.scale.height/2, winner+" Wins", {fill: '#000', font: "bold 56px Arial"}).setOrigin(.5).scrollFactorX=0
        playersDead++
    }
}

function p1jump(){
    player1.playerJump()
}

function p2jump(){
    player2.playerJump()
}

function createPlatforms(platformArray){
    for (let i=1; i<platformArray.length; i++){
        platforms.create(nextX*1280+platformArray[i]['x'], platformArray[i]['y'], platformArray[i]['type']).setOrigin(0).setScale(platformArray[i]['scl'], platformArray[i]['scl']).refreshBody();
    }
    for (let i=0; i<platformArray[0]; i++){
        platforms.create((nextX+i)*640, game.scale.height-45, 'platH').setOrigin(0).setScale(1, 1).refreshBody();
    }
    nextX+=platformArray[0]
}

function appr(inc, val, num){
    if (num>val){
        return num-inc<val ? val : num-inc
    } else {
        return num+inc>=val ? val : num+inc
    }
}