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

    create: function(state) {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        state.add.image(0, 0, "background");
        state.stage1 = game.add.sprite(game.world.width/2 - 475,25, "stage1" );

        state.ball = [];
        state.blank=[];
        state.textDefault = [];
        state.box=[];
        state.textBox=[];

        Game3.addBackButton(state);
        Game3.addTurnBar(state);
        Game3.addBlank(state);
        Game3.addTextDefault(state);
        Game3.addBox(state);
        Game3.addTextBox(state);

        //Xac dinh gia tri ghep voi gia tri o vi tri 0
        if((state.value[1]+state.value[0]) % 10 === 0) {
            state.pairWithValue0 = 1;
            state.notPairWithValue0 = 2;
        }
        else {
            state.pairWithValue0 = 2;
            state.notPairWithValue0 = 1;
        }

        state.bracket = state.add.sprite(state.blank[0].x, state.blank[0].y + state.blank[0].height + 4,'bracket');
        state.bracket.visible = false;

        state.ballRes = state.add.sprite(state.bracket.x + state.bracket.width/2, state.bracket.y+60,'ballRes');
        state.ballRes.anchor.set(0.5);
        game.physics.arcade.enable(state.ballRes);
        state.ballRes.inputEnabled = true;
        state.ballRes.visible = false;

        state.textRes = state.game.add.text(state.ballRes.x, state.ballRes.y+5, state.value[0]+state.value[state.pairWithValue0],{font: "32px Arial", fill: "#000"});
        state.textRes.anchor.set(0.5);
        state.textRes.visible = false;

        state.isEmpty = [true,true,true];
        state.effectStart = true;
        state.endStep1 = false;
        state.endStep2 = false;
        state.endGame = false;
        state.result = '';
    },

    update: function (state){
        //Hieu ung khi bat dau game
        if(state.effectStart) {
            for (i = 1; i < 3; i++) {
                Game3.moveToBlank(state, i, state.stage1.x + 10 + i * 150, state.stage1.y + 75);
            }
            state.box[0].input.disableDrag();
            state.game.physics.arcade.moveToXY(state.box[0], state.blank[0].x, state.blank[0].y, 100, 350);
            if (state.isEmpty[0]) {
                game.time.events.add(600, state.addBracket, state);
            }
        }

        Game3.updateTextBox(state);
        Game3.updateTextRes(state);

        //Khi ghep dung cac gia tri vao vi tri tuong ung
        if(!state.isEmpty[0] && !state.isEmpty[1] && !state.isEmpty[2]){
            state.game.time.events.add(500, state.showOperator, state);
        }

        //Khi ket thuc buoc 1
        if(state.endStep1) {
            state.game.time.events.add(800, state.destroyToShowOperator, state);
        }

        //Khi ket thuc buoc 2
        if(state.endStep2) {
            game.input.keyboard.addCallbacks(state, null, null, state.inputTrueRes);
        }

        //Khi hoan thanh luot choi
        if(state.endGame) {
            game.time.events.add(1000, state.nextState, state);
            Game3.nextTurn(state);
        }
    },

    back: function () {
        game.state.start("Start");
    },

    addBackButton: function (state) {
        backButton = game.add.text(state.stage1.x + 5, state.stage1.y+7, "<", { font: "40px Arial", fill: " #00BFFF", align: "center" });
        backButton2 = game.add.text(state.stage1.x + 30, state.stage1.y+14, "Back", { font: "25px Arial", fill: " #00BFFF", align: "center" });
        backButton.inputEnabled = true;
        backButton2.inputEnabled = true;
        backButton.events.onInputUp.add(Game3.back);
        backButton2.events.onInputUp.add(Game3.back);
    },

    addTurnBar: function(state){

        turnBar = game.add.image(game.world.width/2,50,"turnBar");
        turnBar.anchor.set(0.5);

        for(i=0; i<state.turn; i++){
            newBall = game.add.sprite(turnBar.x - turnBar.width/2 + 15 + i*23,turnBar.y,"turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
        for(i=0; i<6-state.turn; i++){
            newBall = game.add.sprite(turnBar.x + turnBar.width/2 - 15 - i*23,turnBar.y,"turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
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

    addTextDefault:function(state){
        style = { font: "48px Arial", fill: "#000"};
        for(i=0;i<3;i++){
            if(i > 0){
                newText=game.add.text(state.stage1.x + 20 + i*150, state.stage1.y + 88,"+ "+state.value[i].toString(),style);
            }
            else {
                newText=game.add.text(state.stage1.x + 20, state.stage1.y + 88,state.value[i].toString(),style);
            }
            state.textDefault.push(newText);
        }
        equal = game.add.text(state.stage1.x + 470, state.stage1.y + 88,'=',style);
        questionMark = game.add.text(state.stage1.x + 520, state.stage1.y + 88,'?',style);
        state.textDefault.push(equal);
        state.textDefault.push(questionMark);
    },

    addTextBox:function(state){
        style = { font: "48px Arial", fill: "#000"};
        for(i=0;i<3;i++){
            if(i > 0){
                newText=game.add.text(100, 100,'+ ' + state.value[i].toString(),style);
            }
            else {
                newText=game.add.text(100, 100,state.value[i].toString(),style);
            }
            newText.anchor.set(0.5);
            state.textBox.push(newText);
        }
    },

    addBracket:function(state){
        state.bracket.visible = true;
        state.ballRes.visible = true;
        state.textRes.visible = true;
        state.isEmpty[0]=false;
    },

    updateTextBox: function(state){
        for(i=0; i<3; i++){
            state.textBox[i].x = Math.floor(state.box[i].x + state.box[i].width/2);
            state.textBox[i].y = Math.floor(state.box[i].y + state.box[i].height/2+8);
        }
    },

    updateTextRes: function(state){
        state.textRes.x = Math.floor(state.ballRes.x);
        state.textRes.y = Math.floor(state.ballRes.y+5);
    },

    moveToBlank: function (state,i,x,y) {
        if(game.input.mousePointer.isDown){
            state.box[i].body.velocity.setTo(0, 0);
        }
        else{
            if(state.box[i].x !== x || state.box[i].y !== y) {
                if (i === state.pairWithValue0) {
                    if(Game3.isAroundBlank1(state,i)){
                        game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y,100,200);
                        state.box[i].input.disableDrag();
                        state.isEmpty[1]=false;
                    }
                    else game.physics.arcade.moveToXY(state.box[i], x,y,100,200);
                }
                else {
                    if(!state.isEmpty[1]){
                        if(Game3.isAroundBlank2(state,i)){
                            game.physics.arcade.moveToXY(state.box[i], state.blank[2].x, state.blank[2].y,100,200);
                            state.box[i].input.disableDrag();
                            state.isEmpty[2]=false;
                        }
                        else game.physics.arcade.moveToXY(state.box[i], x, y,100,200);
                    }
                    else {
                        if(Game3.isAroundBlank1(state,i)){
                            game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y,100,200);
                            game.time.events.add(1000, state.backIfFail, state);
                        }
                        else game.physics.arcade.moveToXY(state.box[i], x,y,100,200);
                    }
                }
            }
        }
    },

    isAroundBlank1:function(state,i){
        return state.box[i].x > state.blank[1].x - state.blank[1].width
            && state.box[i].x < state.blank[1].x + state.blank[1].width
            && state.box[i].y > state.blank[1].y - state.blank[1].height
            && state.box[i].x < state.blank[1].x + state.blank[1].height;
    },

    isAroundBlank2:function(state,i){
        return state.box[i].x > state.blank[2].x - state.blank[2].width
            && state.box[i].x < state.blank[2].x + state.blank[2].width
            && state.box[i].y > state.blank[2].y - state.blank[2].height
            && state.box[i].x < state.blank[2].x + state.blank[2].height;
    },

    backIfFail: function (state) {
        for(i=1;i<3;i++){
            if(i !== state.pairWithValue0) {
                game.physics.arcade.moveToXY(state.box[i], state.stage1.x + 10+ i*(10+state.box[i-1].width), state.stage1.y + 75, 100, 100);
            }
        }
    },

    showOperator:function(state){
        state.textDefault[1].x = state.textDefault[0].x+60;
        state.textDefault[2].x = state.textDefault[1].x+110;
        state.textDefault[3].x = state.textDefault[2].x+110;
        state.textDefault[4].destroy();
        game.time.events.add(500, state.destroyBox,state);
    },

    destroyBox:function(state){
        state.effectStart = false;
        state.textBox[0].destroy();
        state.textBox[state.pairWithValue0].destroy();
        state.box[0].destroy();
        state.box[state.pairWithValue0].destroy();
        state.blank[0].destroy();
        state.blank[1].destroy();
        state.blank[2].destroy();
        state.bracket.destroy();
        game.physics.arcade.moveToXY(state.ballRes,state.textDefault[3].x + 70, state.textDefault[3].y+23, 200, 200);
        game.physics.arcade.moveToXY(state.box[state.notPairWithValue0],state.textDefault[3].x + 110, state.textDefault[3].y-15, 200, 200);
        state.endStep1=true;
    },

    destroyToShowOperator:function(state){
        state.textRes.destroy();
        state.ballRes.destroy();
        state.box[state.notPairWithValue0].destroy();
        game.time.events.add(100, state.addLast,state);
    },

    addLast:function(state){
        if(!state.endStep2) {
            game.add.text(state.textDefault[3].x + 60, state.textDefault[3].y, state.value[0] + state.value[state.pairWithValue0],{font: "48px Arial", fill: "#000"});
            game.add.text(state.textDefault[3].x + 240, state.textDefault[3].y, '=',{font: "48px Arial", fill: "#000"});
            game.add.image(state.textDefault[3].x + 280, state.textDefault[3].y-5, 'textBox');
            state.endStep2 = true;
        }
    },

    inputTrueRes:function (char,state) {
        if (state.result.length < 2) state.result = state.result + char;
        if (state.result.length === 1) a1 = game.add.text(state.textDefault[3].x + 288, state.textDefault[3].y+3, state.result,{font: "48px Arial", fill: "#000"});
        else if (state.result.length === 2) a2 = game.add.text(a1.x+30, a1.y, state.result.charAt(1),{font: "48px Arial", fill: "#000"});
        trueRes = state.value[0]+state.value[1]+state.value[2];
        if (state.result.length === 2 && state.result !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            state.result = '';
        }
        else if (state.result === trueRes.toString()) state.endGame=true;
    },

    nextTurn: function (state) {
        game.physics.arcade.moveToXY(state.ball[state.turn - 1], turnBar.x + turnBar.width/2 - 15 - 23*(6-state.turn), turnBar.y, 100, 200);
    }
};


Game3.StateA = function (){
    this.stage1;
    this.ball;
    this.turn = 6;
    this.box;
    this.blank;
    this.value=[6,68,24];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateA.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Game3_StateB');
    }

};


Game3.StateB = function (){
    this.stage1;
    this.ball;
    this.turn = 5;
    this.box;
    this.blank;
    this.value=[17,23,30];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateB.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Game3_StateC');
    }

};


Game3.StateC = function (){
    this.stage1;
    this.ball;
    this.turn = 4;
    this.box;
    this.blank;
    this.value=[10,12,20];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateC.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Game3_StateD');
    }

};


Game3.StateD = function (){
    this.stage1;
    this.ball;
    this.turn = 3;
    this.box;
    this.blank;
    this.value=[13,15,17];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateD.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Game3_StateE');
    }
};


Game3.StateE = function (){
    this.stage1;
    this.ball;
    this.turn = 2;
    this.box;
    this.blank;
    this.value=[15,24,35];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateE.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Game3_StateF');
    }
};


Game3.StateF = function (){
    this.stage1;
    this.ball;
    this.turn = 1;
    this.box;
    this.blank;
    this.value=[2,30,28];
    this.pairWithValue0;
    this.notPairWithValue0;
    this.isEmpty;
    this.textDefault;
    this.textBox;
    this.bracket;
    this.ballRes;
    this.textRes;
    this.effectStart;
    this.endStep1;
    this.endStep2;
    this.endGame;
    this.result;
};

Game3.StateF.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function() {
        Game3.create(this);
    },

    update: function (){
        Game3.update(this);
    },

    addBracket:function () {
        Game3.addBracket(this);
    },

    backIfFail: function () {
        Game3.backIfFail(this);
    },

    showOperator: function(){
        Game3.showOperator(this);
    },

    destroyBox: function () {
        Game3.destroyBox(this);
    },

    destroyToShowOperator: function () {
        Game3.destroyToShowOperator(this);
    },

    addLast: function () {
        Game3.addLast(this);
    },

    inputTrueRes:function (char) {
        Game3.inputTrueRes(char,this);
    },

    nextState: function () {
        game.state.start('Congratulation');
    }
};