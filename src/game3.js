var Game3={
    preload: function() {
        game.load.image("background", "assets/background.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("turnBall","assets/turnBall.png");
        game.load.image("turnBar","assets/turnBar.png");
        game.load.image("box","assets/box.png");
    },

    back: function () {
        game.state.start("Start");
    },

    addBackButton: function (stage1) {
        backButton = game.add.text(stage1.x + 5, stage1.y+7, "<", { font: "40px Arial", fill: " #00BFFF", align: "center" });
        backButton2 = game.add.text(stage1.x + 30, stage1.y+14, "Back", { font: "25px Arial", fill: " #00BFFF", align: "center" });
        backButton.inputEnabled = true;
        backButton2.inputEnabled = true;
        backButton.events.onInputUp.add(Game1.back);
        backButton2.events.onInputUp.add(Game1.back);
    },

    addTurnBar: function(turn,ball){

        turnBar = game.add.image(game.world.width/2,50,"turnBar");
        turnBar.anchor.set(0.5);

        for(i=0; i<turn; i++){
            newBall = game.add.sprite(turnBar.x - turnBar.width/2 + 15 + i*23,turnBar.y,"turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            ball.push(newBall);
        }
        for(i=0; i<3-turn; i++){
            newBall = game.add.sprite(turnBar.x + turnBar.width/2 - 15 - i*23,turnBar.y,"turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            ball.push(newBall);
        }
    },

    addBox: function(state){
        for(i=0;i<3;i++){
            if(i>0) {
                newBox = game.add.sprite(state.stage1.x + 10+ i*(10+state.box[i-1].width), state.stage1.y + 75, "box");
            }
            else{
                newBox = game.add.sprite(state.stage1.x + 10, state.stage1.y + 75, "box");
            }
            game.physics.arcade.enable(newBox);
            newBox.inputEnabled = true;
            newBox.input.enableDrag();
            state.box.push(newBox);
        }
    },

    addBlank:function(state){
        for(i=0;i<3;i++){
            if(i>0) {
                newBlank = game.add.sprite(state.blank[0].x + i*(15+state.blank[i-1].width), state.blank[i-1].y, "box");
            }
            else{
                newBlank = game.add.sprite(state.stage1.x + 150, state.stage1.y + 250, "box");
            }
            game.physics.arcade.enable(newBlank);
            state.blank.push(newBlank);
        }
    },

    moveBack: function (state,i,x,y) {
        if(game.input.mousePointer.isDown){
            state.box[i].body.velocity.setTo(0, 0);
        }
        else{
            if(state.box[i].x !== x || state.box[i].y !== y) {
                if (state.isEmpty[1]) {
                    if(state.box[i].x > state.blank[1].x - state.blank[1].width
                    && state.box[i].x < state.blank[1].x + state.blank[1].width
                    && state.box[i].y > state.blank[1].y - state.blank[1].height
                    && state.box[i].x < state.blank[1].x + state.blank[1].height){
                        game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y,100,200);
                    }
                    else game.physics.arcade.moveToXY(state.box[i], x,y,100,200);
                }
            }
        }
    }
};

Game3.StateA = function (){
    this.stage1;
    this.ball;
    this.turn = 6;
    this.box;
    this.blank;
    this.isEmpty;
};

Game3.StateA.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width/2 - 475,25, "stage1" );
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, 608, 580);

        Game3.addBackButton(this.stage1);
        this.ball = [];
        Game3.addTurnBar(this.turn,this.ball);

        this.blank=[];
        Game3.addBlank(this);

        this.box=[];
        Game3.addBox(this);

        this.isEmpty=[true,true,true];

    },

    update: function (){
        for(i=0;i<3;i++){
            Game3.moveBack(this,i,this.stage1.x + 10+ i*150, this.stage1.y + 75);
        }
    }
};
