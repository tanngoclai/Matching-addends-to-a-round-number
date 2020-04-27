var Game1={

    preload: function () {
        game.load.image("background", "assets/background.png");
        game.load.image("tail", "assets/tail.png");
        game.load.image("head", "assets/head.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("flag","assets/flag1.png");
        game.load.image("turnBall","assets/turnBall.png");
        game.load.image("turnBar","assets/turnBar.png");
        game.load.image("textbox","assets/textbox.png");
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

    addTail: function (stage1,tail) {
        for(i=0;i<3;i++){
            if(i>0) {
                newTail = game.add.sprite(stage1.x + 100, stage1.y + 75 + i*(25+tail[i-1].height), "tail");
            }
            else{
                newTail = game.add.sprite(stage1.x + 100, stage1.y + 75, "tail");
            }
            game.physics.arcade.enable(newTail);
            newTail.inputEnabled = true;
            newTail.input.enableDrag();
            newTail.input.boundsRect = bounds;
            newTail.outOfBoundsKill = true;
            tail.push(newTail);
        }
    },

    addHead: function (stage1,head,tail) {
        for(i=0;i<3;i++){
            newHead = game.add.sprite(stage1.x + stage1.width - 266 - 75, tail[i].y, "head" );
            game.physics.arcade.enable(newHead);
            newHead.inputEnabled = true;
            head.push(newHead);
        }
    },

    addFlag: function (flag,head) {
        for(i=0;i<3;i++){
            newFlag = game.add.image(head[i].x+200,head[i].y-6,"flag");
            flag.push(newFlag);
        }
    },

    addTextHead: function(textHead,valueHead,style){
        for(i=0;i<3;i++){
            newText = game.add.text(100, 100, valueHead[i], style);
            newText.anchor.set(0.5);
            textHead.push(newText);
        }
    },

    addTextTail: function(textTail,valueTail,style){
        for(i=0;i<3;i++){
            newText = game.add.text(100, 100, valueTail[i], style);
            newText.anchor.set(0.5);
            textTail.push(newText);
        }
    },

    moveTail: function (i,x,y,stage1,tail,head,valueHead,valueTail,checkMatch,matchHead,operator,state) {
        var style={ font: "72px Arial", fill: "#000"};

        if(game.input.mousePointer.isDown ) {
            tail[i].body.velocity.setTo(0, 0);
        }
        else {
            if(tail[i].x !== x || tail[i].y !== y) {
                if (tail[i].x < stage1.x + stage1.height/2) {
                    game.physics.arcade.moveToXY(tail[i], x, y, 100, 100);
                }
                else {
                    if (tail[i].y < head[1].y-head[0].height/2){
                        game.physics.arcade.moveToXY(tail[i], head[0].x - tail[0].width, head[0].y, 100, 100);
                        matchHead[0]=i;
                        if((valueTail[i]+valueHead[0])%10 === 0) {
                            if(!checkMatch[0]) Game1.addOperator(head[0],operator,style);
                            tail[i].input.disableDrag();
                            checkMatch[0]=true;
                        }
                        else{
                            game.time.events.add(1500, state.backIfFail, state);
                        }
                    }
                    else {
                        if (tail[i].y < head[2].y-head[1].height/2) {
                            game.physics.arcade.moveToXY(tail[i], head[0].x - tail[0].width, head[1].y, 100, 100);
                            matchHead[1]=i;
                            if ((valueTail[i]+valueHead[1])%10===0) {
                                if(!checkMatch[1]) Game1.addOperator(head[1],operator,style);
                                tail[i].input.disableDrag();
                                checkMatch[1]=true;
                            }
                            else {
                                game.time.events.add(1500, state.backIfFail, state);
                            }
                        }
                        else {
                            game.physics.arcade.moveToXY(tail[i], head[0].x - tail[0].width, head[2].y, 100, 100);
                            matchHead[2]=i;
                            if ((valueTail[i]+valueHead[2])%10===0) {
                                if(!checkMatch[2]) Game1.addOperator(head[2],operator,style);
                                tail[i].input.disableDrag();
                                checkMatch[2]=true;
                            }
                            else {
                                game.time.events.add(1500, state.backIfFail, state);
                            }
                        }
                    }
                }
            }
        }
    },

    addOperator: function (head,operator,style) {
        newoperator = game.add.text(head.x-10,head.y+90,'+',style);
        newoperator.anchor.set(0.5);
        game.add.image(head.x+212,head.y+7,'textbox')
        //game.physics.arcade.enable(operator);
        //operator.inputEnabled = true;
        //operator.push(newOperator);
    },

    inputRes:function(i,state){
        if(i===0) {
            game.input.keyboard.addCallbacks(state, null, null, state.isTrueKey1);
        }
        else if(i===1){
            game.input.keyboard.addCallbacks(state, null, null, state.isTrueKey2);
        }
        else {
            game.input.keyboard.addCallbacks(state, null, null, state.isTrueKey3);
        }
    }

};

Game1.StateA = function () {
    this.stage1;
    this.ball;
    this.turn = 3;
    this.tail;
    this.head;
    this.flag;
    this.text;
    this.next1=false;
    this.next2=false;
    this.next3=false;
};

Game1.StateA.prototype = {

    preload: function () {
        Game1.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width/2 - 475,25, "stage1" );
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, 608, 580);

        Game1.addBackButton(this.stage1);
        this.ball = [];
        Game1.addTurnBar(this.turn,this.ball);

        this.tail=[];
        Game1.addTail(this.stage1,this.tail);
        this.head=[];
        Game1.addHead(this.stage1,this.head,this.tail);
        this.flag=[];
        Game1.addFlag(this.flag,this.head);

        var style = { font: "32px Arial", fill: "#000"};
        valueHead=[42,13,34];
        valueTail=[27,36,8];
        textHead=[];
        textTail=[];
        Game1.addTextHead(textHead,valueHead,style);
        Game1.addTextTail(textTail,valueTail,style);

        checkMatch=[false,false,false];
        checkRes=[false,false,false];
        checkMoveCar=[false,false,false];
        matchHead=[-1,-1,-1];

        res=['','',''];
        operator=[];

    },

    update: function  () {
        for(i=0;i<3;i++){
                Game1.moveTail(i,this.stage1.x + 100, this.head[i].y,this.stage1,this.tail,this.head,valueHead,valueTail,checkMatch,matchHead,operator,this);
        }

        for(i=0;i<3;i++){
            textHead[i].x = Math.floor(this.head[i].x + this.head[i].width / 2 - 47);
            textHead[i].y = Math.floor(this.head[i].y + this.head[i].height / 2 + 8 );
        }

        for(i=0;i<3;i++){
            textTail[i].x = Math.floor(this.tail[i].x + this.tail[i].width / 2 + 1);
            textTail[i].y = Math.floor(this.tail[i].y + this.tail[i].height / 2 + 8 );
        }

        for(i=0;i<3;i++){
            this.flag[i].x = Math.floor(this.head[i].x+200);
            this.flag[i].y = Math.floor(this.head[i].y-6);
        }

        for(i=0;i<3;i++) {
            if(checkMatch[i] && !checkRes[i]) {
                Game1.inputRes(i,this);
            }
/*            if(checkMatch[i] && checkRes[i]){
                this.tail[matchHead[i]].body.velocity.x=500;
                this.head[i].body.velocity.x=500;
            }*/
        }

        if(checkRes[0] && checkRes[1] && checkRes[2]) {
            a=this.game.time.events.add(1000, this.gotoStateB, this);
            game.physics.arcade.moveToXY(this.ball[2], turnBar.x + turnBar.width/2 - 15, turnBar.y, 100, 200);

        }
    },

    backIfFail: function(){
        for(i=0;i<3;i++){
            if(matchHead[i]>-1 && !checkMatch[i]){
                game.physics.arcade.moveToXY(this.tail[matchHead[i]], this.stage1.x + 100, this.head[i].y, 100, 100);
                matchHead[i]=-1;
            }
        }
    },

    isTrueKey1: function(char){
        if (res[0].length < 2) res[0] = res[0] + char;
        if (res[0].length === 1) a1 = game.add.text(this.flag[0].x+20, this.flag[0].y+22, res[0]);
        else if (res[0].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[0].charAt(1));
        trueRes = valueHead[0] + valueTail[matchHead[0]];
        if (res[0].length === 2 && res[0] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[0] = '';
        }
        else if (res[0]===trueRes.toString()) checkRes[0]=true;
    },

    isTrueKey2: function(char){
        if (res[1].length < 2) res[1] = res[1] + char;
        if (res[1].length === 1) a1 = game.add.text(this.flag[1].x+20, this.flag[1].y+22, res[1]);
        else if (res[1].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[1].charAt(1));
        trueRes = valueHead[1] + valueTail[matchHead[1]];
        if (res[1].length === 2 && res[1] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[1] = '';
        }
        else if (res[1]===trueRes.toString()) checkRes[1]=true;
    },

    isTrueKey3: function(char){
        if (res[2].length < 2) res[2] = res[2] + char;
        if (res[2].length === 1) a1 = game.add.text(this.flag[2].x+20, this.flag[2].y+22, res[2]);
        else if (res[2].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[2].charAt(1));
        trueRes = valueHead[2] + valueTail[matchHead[2]];
        if (res[2].length === 2 && res[2] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[2] = '';
        }
        else if (res[2]===trueRes.toString()) checkRes[2]=true;
    },

    gotoStateB: function () {
        game.state.start('Game1_StateB');
    }
};


Game1.StateB = function () {
    this.stage1;
    this.ball;
    this.turn = 2;
    this.tail;
    this.head;
    this.flag;
    this.text;
    this.next1=false;
    this.next2=false;
    this.next3=false;
};

Game1.StateB.prototype = {

    preload: function () {
        Game1.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width/2 - 475,25, "stage1" );
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, 608, 580);

        Game1.addBackButton(this.stage1);
        this.ball = [];
        Game1.addTurnBar(this.turn,this.ball);

        this.tail=[];
        Game1.addTail(this.stage1,this.tail);
        this.head=[];
        Game1.addHead(this.stage1,this.head,this.tail);
        this.flag=[];
        Game1.addFlag(this.flag,this.head);

        var style = { font: "32px Arial", fill: "#000"};
        valueHead=[16,57,39];
        valueTail=[23,24,11];
        textHead=[];
        textTail=[];
        Game1.addTextHead(textHead,valueHead,style);
        Game1.addTextTail(textTail,valueTail,style);

        checkMatch=[false,false,false];
        checkRes=[false,false,false];
        checkMoveCar=[false,false,false];
        matchHead=[-1,-1,-1];

        res=['','',''];
        operator=[];

    },

    update: function  () {
        for(i=0;i<3;i++){
            Game1.moveTail(i,this.stage1.x + 100, this.head[i].y,this.stage1,this.tail,this.head,valueHead,valueTail,checkMatch,matchHead,operator,this);
        }

        for(i=0;i<3;i++){
            textHead[i].x = Math.floor(this.head[i].x + this.head[i].width / 2 - 47);
            textHead[i].y = Math.floor(this.head[i].y + this.head[i].height / 2 + 8 );
        }

        for(i=0;i<3;i++){
            textTail[i].x = Math.floor(this.tail[i].x + this.tail[i].width / 2 + 1);
            textTail[i].y = Math.floor(this.tail[i].y + this.tail[i].height / 2 + 8 );
        }

        for(i=0;i<3;i++){
            this.flag[i].x = Math.floor(this.head[i].x+200);
            this.flag[i].y = Math.floor(this.head[i].y-6);
        }

        for(i=0;i<3;i++) {
            if(checkMatch[i] && !checkRes[i]) {
                Game1.inputRes(i,this);
            }
            /*            if(checkMatch[i] && checkRes[i]){
                            this.tail[matchHead[i]].body.velocity.x=500;
                            this.head[i].body.velocity.x=500;
                        }*/
        }

        if(checkRes[0] && checkRes[1] && checkRes[2]) {
            a=this.game.time.events.add(1000, this.gotoStateC, this);
            game.physics.arcade.moveToXY(this.ball[2], turnBar.x + turnBar.width/2 - 15, turnBar.y, 100, 200);
        }
    },

    backIfFail: function(){
        for(i=0;i<3;i++){
            if(matchHead[i]>-1 && !checkMatch[i]){
                game.physics.arcade.moveToXY(this.tail[matchHead[i]], this.stage1.x + 100, this.head[i].y, 100, 100);
                matchHead[i]=-1;
            }
        }
    },

    isTrueKey1: function(char){
        if (res[0].length < 2) res[0] = res[0] + char;
        if (res[0].length === 1) a1 = game.add.text(this.flag[0].x+20, this.flag[0].y+22, res[0]);
        else if (res[0].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[0].charAt(1));
        trueRes = valueHead[0] + valueTail[matchHead[0]];
        if (res[0].length === 2 && res[0] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[0] = '';
        }
        else if (res[0]===trueRes.toString()) checkRes[0]=true;
    },

    isTrueKey2: function(char){
        if (res[1].length < 2) res[1] = res[1] + char;
        if (res[1].length === 1) a1 = game.add.text(this.flag[1].x+20, this.flag[1].y+22, res[1]);
        else if (res[1].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[1].charAt(1));
        trueRes = valueHead[1] + valueTail[matchHead[1]];
        if (res[1].length === 2 && res[1] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[1] = '';
        }
        else if (res[1]===trueRes.toString()) checkRes[1]=true;
    },

    isTrueKey3: function(char){
        if (res[2].length < 2) res[2] = res[2] + char;
        if (res[2].length === 1) a1 = game.add.text(this.flag[2].x+20, this.flag[2].y+22, res[2]);
        else if (res[2].length === 2) a2 = game.add.text(a1.x+20, a1.y, res[2].charAt(1));
        trueRes = valueHead[2] + valueTail[matchHead[2]];
        if (res[2].length === 2 && res[2] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            res[2] = '';
        }
        else if (res[2]===trueRes.toString()) checkRes[2]=true;
    },

    gotoStateC: function () {
        game.state.start('Game1_StateC');
    }
};
