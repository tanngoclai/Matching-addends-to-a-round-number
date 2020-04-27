var Game3={
    preload: function() {
        game.load.image("background", "assets/background.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("turnBall","assets/turnBall.png");
        game.load.image("turnBar","assets/turnBar.png");
        game.load.image("box","assets/box.png");
        game.load.image("bracket","assets/bracket.png");
        game.load.image("ballRes","assets/ballRes.png");
        game.load.image("textBox","assets/textBox3.png");
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

    addTextDefault:function(state,textDefault){
        style = { font: "48px Arial", fill: "#000"};
        for(i=0;i<3;i++){
            if(i > 0){
                newText=game.add.text(state.stage1.x + 20 + i*150, state.stage1.y + 88,"+ "+state.value[i].toString(),style);
            }
            else {
                newText=game.add.text(state.stage1.x + 20, state.stage1.y + 88,state.value[i].toString(),style);
            }
            textDefault.push(newText);
        }
        equal = game.add.text(state.stage1.x + 470, state.stage1.y + 88,'=',style);
        questionMark = game.add.text(state.stage1.x + 520, state.stage1.y + 88,'?',style);
        textDefault.push(equal);
        textDefault.push(questionMark);
    },

    addTextBox:function(state,textBox){
        style = { font: "48px Arial", fill: "#000"};
        for(i=0;i<3;i++){
            if(i > 0){
                newText=game.add.text(100, 100,'+ ' + state.value[i].toString(),style);
            }
            else {
                newText=game.add.text(100, 100,state.value[i].toString(),style);
            }
            newText.anchor.set(0.5);
            textBox.push(newText);
        }
    },

    updateTextBox: function(state,textBox){
        for(i=0; i<3; i++){
            textBox[i].x = Math.floor(state.box[i].x + state.box[i].width/2);
            textBox[i].y = Math.floor(state.box[i].y + state.box[i].height/2+8);
        }
    },

    updateTextRes: function(ballRes,textRes){
        textRes.x = Math.floor(ballRes.x);
        textRes.y = Math.floor(ballRes.y+5);
    },

    moveToBlank: function (state,i,x,y) {
        if(game.input.mousePointer.isDown){
            state.box[i].body.velocity.setTo(0, 0);
        }
        else{
            if(state.box[i].x !== x || state.box[i].y !== y) {
                if (i === state.pairWithValue0) {
                    if(state.box[i].x > state.blank[1].x - state.blank[1].width
                    && state.box[i].x < state.blank[1].x + state.blank[1].width
                    && state.box[i].y > state.blank[1].y - state.blank[1].height
                    && state.box[i].x < state.blank[1].x + state.blank[1].height){
                        game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y,100,200);
                        state.box[i].input.disableDrag();
                        state.isEmpty[1]=false;
                    }
                    else game.physics.arcade.moveToXY(state.box[i], x,y,100,200);
                }
                else {
                    if(!state.isEmpty[1]){
                        if(state.box[i].x > state.blank[2].x - state.blank[2].width
                            && state.box[i].x < state.blank[2].x + state.blank[2].width
                            && state.box[i].y > state.blank[2].y - state.blank[2].height
                            && state.box[i].x < state.blank[2].x + state.blank[2].height){
                            game.physics.arcade.moveToXY(state.box[i], state.blank[2].x, state.blank[2].y,100,200);
                            state.box[i].input.disableDrag();
                            state.isEmpty[2]=false;
                        }
                        else game.physics.arcade.moveToXY(state.box[i], x, y,100,200);
                    }
                    else {
                        if(state.box[i].x > state.blank[1].x - state.blank[1].width
                            && state.box[i].x < state.blank[1].x + state.blank[1].width
                            && state.box[i].y > state.blank[1].y - state.blank[1].height
                            && state.box[i].x < state.blank[1].x + state.blank[1].height){
                            game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y,100,200);
                            game.time.events.add(1000, state.backIfFail, state);
                        }
                        else game.physics.arcade.moveToXY(state.box[i], x,y,100,200);
                    }
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
    this.value;
    this.res;
    this.pairWithValue0=0;
    this.notPairWithValue0;
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

        Game3.addBackButton(this.stage1);
        this.ball = [];
        Game3.addTurnBar(this.turn,this.ball);

        this.blank=[];
        Game3.addBlank(this);

        this.value=[6,68,24];
        textDefault = [];
        Game3.addTextDefault(this,textDefault);
        this.box=[];
        textBox=[];
        Game3.addBox(this);
        Game3.addTextBox(this,textBox);

        if((this.value[1]+this.value[0]) % 10 === 0) {
            this.pairWithValue0 = 1;
            this.notPairWithValue0 = 2;
        }
        else {
            this.pairWithValue0 = 2;
            this.notPairWithValue0 = 1;
        }

        bracket = this.add.sprite(this.blank[0].x, this.blank[0].y + this.blank[0].height + 4,'bracket');
        ballRes = this.add.sprite(bracket.x + bracket.width/2, bracket.y+60,'ballRes');
        ballRes.anchor.set(0.5);
        game.physics.arcade.enable(ballRes);
        ballRes.inputEnabled = true;
        textRes = this.game.add.text(ballRes.x, ballRes.y+5, this.value[0]+this.value[this.pairWithValue0],{font: "32px Arial", fill: "#000"});
        textRes.anchor.set(0.5);
        bracket.visible = false;
        ballRes.visible = false;
        textRes.visible = false;

        this.isEmpty = [true,true,true];
        start = true;
        end = false;
        end2 = false;
        endGame = false;
        result = '';
    },

    update: function (){
        if(start) {
            for (i = 1; i < 3; i++) {
                Game3.moveToBlank(this, i, this.stage1.x + 10 + i * 150, this.stage1.y + 75);
            }
            this.box[0].input.disableDrag();
            this.game.physics.arcade.moveToXY(this.box[0], this.blank[0].x, this.blank[0].y, 100, 350);
            if (this.isEmpty[0]) {
                game.time.events.add(600, this.addBracket, this);
            }
        }

        Game3.updateTextBox(this, textBox);
        Game3.updateTextRes(ballRes,textRes);
        if(!this.isEmpty[0] && !this.isEmpty[1] && !this.isEmpty[2]){
            this.game.time.events.add(500, this.showOperator, this);
        }

        if(end) this.game.time.events.add(800, this.destroy2, this);
        game.input.keyboard.addCallbacks(this, null, null, this.isTrueRes);

        this.nextTurn();
    },

    addBracket:function () {
        bracket.visible = true;
        ballRes.visible = true;
        textRes.visible = true;
        this.isEmpty[0]=false;
    },

    backIfFail: function () {
        for(i=1;i<3;i++){
            if(i !== this.pairWithValue0) {
                game.physics.arcade.moveToXY(this.box[i], this.stage1.x + 10+ i*(10+this.box[i-1].width), this.stage1.y + 75, 100, 100);
            }
        }
    },

    showOperator: function(){
        textDefault[1].x = textDefault[0].x+45;
        textDefault[2].x = textDefault[1].x+110;
        textDefault[3].x = textDefault[2].x+110;
        textDefault[4].destroy();
        game.time.events.add(500, this.destroyBox,this);
    },

    destroyBox: function () {
        start = false;
        textBox[0].destroy();
        textBox[this.pairWithValue0].destroy();
        this.box[0].destroy();
        this.box[this.pairWithValue0].destroy();
        this.blank[0].destroy();
        this.blank[1].destroy();
        this.blank[2].destroy();
        bracket.destroy();
        game.physics.arcade.moveToXY(ballRes,textDefault[3].x + 70, textDefault[3].y+23, 200, 200);
        game.physics.arcade.moveToXY(this.box[this.notPairWithValue0],textDefault[3].x + 110, textDefault[3].y-15, 200, 200);
        end=true;
    },

    destroy2: function () {
        textRes.destroy();
        ballRes.destroy();
        this.box[this.notPairWithValue0].destroy();
        game.time.events.add(100, this.addLast,this);
    },

    addLast: function () {
        if(!end2) {
            game.add.text(textDefault[3].x + 60, textDefault[3].y, this.value[0] + this.value[this.pairWithValue0],{font: "48px Arial", fill: "#000"});
            game.add.text(textDefault[3].x + 240, textDefault[3].y, '=',{font: "48px Arial", fill: "#000"});
            game.add.image(textDefault[3].x + 280, textDefault[3].y-5, 'textBox');
            end2 = true;
        }
    },

    isTrueRes:function (char) {
        if (result.length < 2) result = result + char;
        if (result.length === 1) a1 = game.add.text(textDefault[3].x + 288, textDefault[3].y+3, result,{font: "48px Arial", fill: "#000"});
        else if (result.length === 2) a2 = game.add.text(a1.x+30, a1.y, result.charAt(1),{font: "48px Arial", fill: "#000"});
        trueRes = this.value[0]+this.value[1]+this.value[2];
        if (result.length === 2 && result !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            result = '';
        }
        else if (result === trueRes.toString()) endGame=true;
    },

    nextTurn: function () {
        if(endGame) {
            a=this.game.time.events.add(1000, this.gotoStateB, this);
            game.physics.arcade.moveToXY(this.ball[5], turnBar.x + turnBar.width/2 - 15, turnBar.y, 100, 200);

        }
    },

    gotoStateB: function () {
        game.state.start('Game3_StateB');
    }

};
