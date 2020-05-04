var Game2={
    preload: function() {
        game.load.image("background", "assets/background.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("turnBall","assets/turnBall.png");
        game.load.image("turnBar","assets/turnBar.png");
        game.load.image("car","assets/car.png");
        game.load.image("flag","assets/flag1.png");
        game.load.image("bag","assets/bag.png");
        game.load.image("bag2","assets/bag2.png");
        game.load.image("textBox","assets/textbox.png");
        game.load.image("textBox3","assets/textbox3.png");
    },

    back: function () {
        game.state.start("Start");
    },

    addBackButton: function (stage1) {
        backButton = game.add.text(stage1.x + 5, stage1.y+7, "<", { font: "40px Arial", fill: " #00BFFF", align: "center" });
        backButton2 = game.add.text(stage1.x + 30, stage1.y+14, "Back", { font: "25px Arial", fill: " #00BFFF", align: "center" });
        backButton.inputEnabled = true;
        backButton2.inputEnabled = true;
        backButton.events.onInputUp.add(Game3.back);
        backButton2.events.onInputUp.add(Game3.back);
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
        for(i=0; i<4-turn; i++){
            newBall = game.add.sprite(turnBar.x + turnBar.width/2 - 15 - i*23,turnBar.y,"turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            ball.push(newBall);
        }
    },

    addMarkBag: function (state) {
        state.markBag = [];
        for( i=0; i<4; i++){
            newMark = state.add.image(game.world.width / 2 + (i-2)*105, 165, "bag2");
            state.markBag.push(newMark);
        }
    },

    addBag: function (state,value,bounds) {
        for(i=0; i<4; i++){
            newBag = game.add.sprite(state.markBag[i].x,state.markBag[i].y,"bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            state.bag.push(newBag);
            state.textBag.push(newText);
        }
    },

    updateTextBag: function (state) {
        for(i=0; i<4; i++){
            state.textBag[i].x = Math.floor(state.bag[i].x + state.bag[i].width / 2 + 1);
            state.textBag[i].y = Math.floor(state.bag[i].y + state.bag[i].height / 2 + 25);
        }
    },

    updateTextBox: function (state,textBox){
        textBox.x = Math.floor(state.flag.x + 11);
        textBox.y = Math.floor(state.flag.y + 12);
    },

    updateFlag: function(state){
        state.flag.x = state.car.x+130;
        state.flag.y = state.car.y-120;

    },

    updateBag: function(state,bagInCar){
        state.bag[bagInCar[0]].x = state.car.x-120;
        state.bag[bagInCar[0]].y = state.car.y-64;
        state.bag[bagInCar[1]].x = state.bag[bagInCar[0]].x + 100;
        state.bag[bagInCar[1]].y = state.bag[bagInCar[0]].y;
    },

    updateRes1: function(state,inputRes1){
        inputRes1.x = state.flag.x+16;
        inputRes1.y = state.flag.y+18;

    },

    moveBag: function (i,state,posBagInCar1,posBagInCar2,bagInCar,value) {
        x = state.markBag[i].x;
        y = state.markBag[i].y;

        if(game.input.mousePointer.isDown ) {
            state.bag[i].body.velocity.setTo(0, 0);
        }
        else {
            if(state.bag[i].x !== x || state.bag[i].y !== y) {
                if(state.bag[i].x > posBagInCar1[0] - 80 && state.bag[i].x < posBagInCar1[0] + 20
                && state.bag[i].y > posBagInCar1[1] - 100 && state.bag[i].y < posBagInCar1[1] + 500) {
                    game.physics.arcade.moveToXY(state.bag[i], posBagInCar1[0], posBagInCar1[1], 100, 100);
                    bagInCar[0] = i;
                }
                else if(state.bag[i].x > posBagInCar2[0] - 60 && state.bag[i].x < posBagInCar2[0] + 40
                    && state.bag[i].y > posBagInCar2[1] - 50 && state.bag[i].y < posBagInCar2[1] + 50) {
                    game.physics.arcade.moveToXY(state.bag[i], posBagInCar2[0], posBagInCar2[1], 100, 100);
                    bagInCar[1] = i;
                }
                else game.physics.arcade.moveToXY(state.bag[i], x, y, 100, 100);
            }
        }
    },

    showOperator1: function (state, textBox) {
        textBox.visible = true;
        game.input.keyboard.addCallbacks(state, null, null, state.inputRes1);
    },

    showOperator2: function (state,bagInCar,textBox) {

        c=1;
        for(i=0; i<4; i++) {
            if(i !== bagInCar[0] && i !== bagInCar[1]) {
                game.physics.arcade.moveToXY(state.bag[i], state.car.x + 100 + c*160, state.car.y - 50, 100, 200);
                c++;
            }
        }
        textBox.visible = true;
        game.add.text(state.stage1.x + 450, state.stage1.y + 450, '+', {font: "32px Arial", fill: "#000"});
        game.add.text(state.stage1.x + 600, state.stage1.y + 450, '+', {font: "32px Arial", fill: "#000"});
        game.add.text(state.stage1.x + 750, state.stage1.y + 450, '=', {font: "32px Arial", fill: "#000"});
        game.input.keyboard.addCallbacks(state, null, null, state.inputRes2);
    },

    nextTurn: function (state) {
        game.physics.arcade.moveToXY(state.ball[state.turn - 1], turnBar.x + turnBar.width/2 - 15 - 23*(4-state.turn), turnBar.y, 100, 200);
    }

};


Game2.StateA = function (){
    this.stage1;
    this.ball;
    this.turn = 4;
    this.markBag;
    this.car;
    this.bag;
    this.flag;
    this.textBag;
    this.checkMatch;
};

Game2.StateA.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, this.stage1.width, this.stage1.height-100);
        var style = { font: "32px Arial", fill: "#000"};

        Game2.addBackButton(this.stage1);
        this.ball = [];
        Game2.addTurnBar(this.turn,this.ball);

        Game2.addMarkBag(this);

        this.car = this.add.sprite(game.world.width/2, game.world.height/2+110, "car");
        game.physics.arcade.enable(this.car);
        this.car.inputEnabled = true;
        this.car.anchor.set(0.5);
        this.flag = this.add.image(this.car.x+130, this.car.y-120, "flag");

        this.bag = [];
        this.textBag = [];
        value = [18,29,3,31];
        for(i=0; i<4; i++){
            newBag = game.add.sprite(this.markBag[i].x, this.markBag[i].y,"bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            this.bag.push(newBag);
            this.textBag.push(newText);
        }

        textBox = game.add.image(this.flag.x+11,this.flag.y+12,'textBox');
        textBox.visible = false;
        textBox2 = game.add.image(this.stage1.x + 800, this.stage1.y + 425, 'textBox3');
        textBox2.visible = false;

        this.checkMatch = false;
        posBagInCar1 = [this.car.x-120, this.car.y-64];
        posBagInCar2 = [this.car.x-20, this.car.y-64];
        bagInCar = [-1,-1];
        res1 = ''; checkRes1 = false;
        inputRes1 = game.add.text(this.flag.x+18, this.flag.y+18, res1,{ font: "36px Arial", fill: "#000"});
        res2 = ''; checkRes2 = false;
        inputRes2 = game.add.text(this.stage1.x + 813, this.stage1.y + 435, res2,{ font: "42px Arial", fill: "#000"});
    },

    update: function (){
        Game2.updateTextBag(this);
        Game2.updateFlag(this);
        Game2.updateTextBox(this,textBox);
        Game2.updateRes1(this,inputRes1);

        if(!this.checkMatch) {
            for (i = 0; i < 4; i++) {
                Game2.moveBag(i, this, posBagInCar1, posBagInCar2, bagInCar, value);
                game.time.events.add(1500, this.backIfFail, this);
            }
        }

        if(this.checkMatch){
            if(this.car.body.velocity.x === 0) {
                this.bag[bagInCar[0]].body.velocity.x = 0;
                this.bag[bagInCar[0]].body.velocity.y = 0;
                this.bag[bagInCar[1]].body.velocity.x = 0;
                this.bag[bagInCar[1]].body.velocity.y = 0;
            }
            Game2.updateBag(this,bagInCar);
            if(!checkRes1) Game2.showOperator1(this,textBox);
            if(checkRes1){
                game.physics.arcade.moveToXY(this.car, game.world.width/2-250, game.world.height/2+110, 100, 200);
                Game2.showOperator2(this,bagInCar,textBox2);
            }
        }

        if(checkRes2) {
            game.time.events.add(1000, this.gotoStateB, this);
            Game2.nextTurn(this);
        }
    },

    backIfFail: function () {
        if(bagInCar[0]>-1 && bagInCar[1]>-1){
            if((value[bagInCar[0]] + value[bagInCar[1]]) % 10 === 0) {
                this.checkMatch = true;
            }
            else {
                game.physics.arcade.moveToXY(this.bag[bagInCar[0]], this.markBag[bagInCar[0]].x, this.markBag[bagInCar[0]].y, 100, 200);
                game.physics.arcade.moveToXY(this.bag[bagInCar[1]], this.markBag[bagInCar[1]].x, this.markBag[bagInCar[1]].y, 100, 200);
                bagInCar[0] = -1;
                bagInCar[1] = -1;
            }
        }
    },

    inputRes1: function(char){

        if (res1.length < 2) res1 = res1 + char;
        if (res1.length === 1) inputRes1.setText(res1);
        else if (res1.length === 2) inputRes1.setText(res1);
        trueRes = value[bagInCar[0]] + value[bagInCar[1]];
        if (res1.length === 2 && res1 !== trueRes.toString()) {
            res1 = '';
            inputRes1.setText(res1);
        }
        else if (res1===trueRes.toString()) checkRes1=true;
    },

    inputRes2: function(char){
        if (res2.length < 2) res2 = res2 + char;
        if (res2.length === 1) inputRes2.setText(res2);
        else if (res2.length === 2) inputRes2.setText(res2);
        trueRes2 = value[0] + value[1] + value[2] + value[3];
        if (res2.length === 2 && res2 !== trueRes2.toString()) {
            res2 = '';
            inputRes2.setText(res2);
        }
        else if (res2 === trueRes2.toString()) checkRes2=true;
    },

    gotoStateB: function () {
        game.state.start('Game2_StateB');
    }

};


Game2.StateB = function (){
    this.stage1;
    this.ball;
    this.turn = 3;
    this.markBag;
    this.car;
    this.bag;
    this.flag;
    this.textBag;
    this.checkMatch;
};

Game2.StateB.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, this.stage1.width, this.stage1.height-100);
        var style = { font: "32px Arial", fill: "#000"};

        Game2.addBackButton(this.stage1);
        this.ball = [];
        Game2.addTurnBar(this.turn,this.ball);

        Game2.addMarkBag(this);

        this.car = this.add.sprite(game.world.width/2, game.world.height/2+110, "car");
        game.physics.arcade.enable(this.car);
        this.car.inputEnabled = true;
        this.car.anchor.set(0.5);
        this.flag = this.add.image(this.car.x+130, this.car.y-120, "flag");

        this.bag = [];
        this.textBag = [];
        value = [32,14,26,15];
        for(i=0; i<4; i++){
            newBag = game.add.sprite(this.markBag[i].x, this.markBag[i].y,"bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            this.bag.push(newBag);
            this.textBag.push(newText);
        }

        textBox = game.add.image(this.flag.x+11,this.flag.y+12,'textBox');
        textBox.visible = false;
        textBox2 = game.add.image(this.stage1.x + 800, this.stage1.y + 425, 'textBox3');
        textBox2.visible = false;

        this.checkMatch = false;
        posBagInCar1 = [this.car.x-120, this.car.y-64];
        posBagInCar2 = [this.car.x-20, this.car.y-64];
        bagInCar = [-1,-1];
        res1 = ''; checkRes1 = false;
        inputRes1 = game.add.text(this.flag.x+18, this.flag.y+18, res1,{ font: "36px Arial", fill: "#000"});
        res2 = ''; checkRes2 = false;
        inputRes2 = game.add.text(this.stage1.x + 813, this.stage1.y + 435, res2,{ font: "42px Arial", fill: "#000"});
    },

    update: function (){
        Game2.updateTextBag(this);
        Game2.updateFlag(this);
        Game2.updateTextBox(this,textBox);
        Game2.updateRes1(this,inputRes1);

        if(!this.checkMatch) {
            for (i = 0; i < 4; i++) {
                Game2.moveBag(i, this, posBagInCar1, posBagInCar2, bagInCar, value);
                game.time.events.add(1500, this.backIfFail, this);
            }
        }

        if(this.checkMatch){
            if(this.car.body.velocity.x === 0) {
                this.bag[bagInCar[0]].body.velocity.x = 0;
                this.bag[bagInCar[0]].body.velocity.y = 0;
                this.bag[bagInCar[1]].body.velocity.x = 0;
                this.bag[bagInCar[1]].body.velocity.y = 0;
            }
            Game2.updateBag(this,bagInCar);
            if(!checkRes1) Game2.showOperator1(this,textBox);
            if(checkRes1){
                game.physics.arcade.moveToXY(this.car, game.world.width/2-250, game.world.height/2+110, 100, 200);
                Game2.showOperator2(this,bagInCar,textBox2);
            }
        }

        if(checkRes2) {
            game.time.events.add(1000, this.gotoStateC, this);
            Game2.nextTurn(this);
        }
    },

    backIfFail: function () {
        if(bagInCar[0]>-1 && bagInCar[1]>-1){
            if((value[bagInCar[0]] + value[bagInCar[1]]) % 10 === 0) {
                this.checkMatch = true;
            }
            else {
                game.physics.arcade.moveToXY(this.bag[bagInCar[0]], this.markBag[bagInCar[0]].x, this.markBag[bagInCar[0]].y, 100, 200);
                game.physics.arcade.moveToXY(this.bag[bagInCar[1]], this.markBag[bagInCar[1]].x, this.markBag[bagInCar[1]].y, 100, 200);
                bagInCar[0] = -1;
                bagInCar[1] = -1;
            }
        }
    },

    inputRes1: function(char){

        if (res1.length < 2) res1 = res1 + char;
        if (res1.length === 1) inputRes1.setText(res1);
        else if (res1.length === 2) inputRes1.setText(res1);
        trueRes = value[bagInCar[0]] + value[bagInCar[1]];
        if (res1.length === 2 && res1 !== trueRes.toString()) {
            res1 = '';
            inputRes1.setText(res1);
        }
        else if (res1===trueRes.toString()) checkRes1=true;
    },

    inputRes2: function(char){
        if (res2.length < 2) res2 = res2 + char;
        if (res2.length === 1) inputRes2.setText(res2);
        else if (res2.length === 2) inputRes2.setText(res2);
        trueRes2 = value[0] + value[1] + value[2] + value[3];
        if (res2.length === 2 && res2 !== trueRes2.toString()) {
            res2 = '';
            inputRes2.setText(res2);
        }
        else if (res2 === trueRes2.toString()) checkRes2=true;
    },

    gotoStateC: function () {
        game.state.start('Game2_StateC');
    }

};


Game2.StateC = function (){
    this.stage1;
    this.ball;
    this.turn = 2;
    this.markBag;
    this.car;
    this.bag;
    this.flag;
    this.textBag;
    this.checkMatch;
};

Game2.StateC.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, this.stage1.width, this.stage1.height-100);
        var style = { font: "32px Arial", fill: "#000"};

        Game2.addBackButton(this.stage1);
        this.ball = [];
        Game2.addTurnBar(this.turn,this.ball);

        Game2.addMarkBag(this);

        this.car = this.add.sprite(game.world.width/2, game.world.height/2+110, "car");
        game.physics.arcade.enable(this.car);
        this.car.inputEnabled = true;
        this.car.anchor.set(0.5);
        this.flag = this.add.image(this.car.x+130, this.car.y-120, "flag");

        this.bag = [];
        this.textBag = [];
        value = [17,34,4,23];
        for(i=0; i<4; i++){
            newBag = game.add.sprite(this.markBag[i].x, this.markBag[i].y,"bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            this.bag.push(newBag);
            this.textBag.push(newText);
        }

        textBox = game.add.image(this.flag.x+11,this.flag.y+12,'textBox');
        textBox.visible = false;
        textBox2 = game.add.image(this.stage1.x + 800, this.stage1.y + 425, 'textBox3');
        textBox2.visible = false;

        this.checkMatch = false;
        posBagInCar1 = [this.car.x-120, this.car.y-64];
        posBagInCar2 = [this.car.x-20, this.car.y-64];
        bagInCar = [-1,-1];
        res1 = ''; checkRes1 = false;
        inputRes1 = game.add.text(this.flag.x+18, this.flag.y+18, res1,{ font: "36px Arial", fill: "#000"});
        res2 = ''; checkRes2 = false;
        inputRes2 = game.add.text(this.stage1.x + 813, this.stage1.y + 435, res2,{ font: "42px Arial", fill: "#000"});
    },

    update: function (){
        Game2.updateTextBag(this);
        Game2.updateFlag(this);
        Game2.updateTextBox(this,textBox);
        Game2.updateRes1(this,inputRes1);

        if(!this.checkMatch) {
            for (i = 0; i < 4; i++) {
                Game2.moveBag(i, this, posBagInCar1, posBagInCar2, bagInCar, value);
                game.time.events.add(1500, this.backIfFail, this);
            }
        }

        if(this.checkMatch){
            if(this.car.body.velocity.x === 0) {
                this.bag[bagInCar[0]].body.velocity.x = 0;
                this.bag[bagInCar[0]].body.velocity.y = 0;
                this.bag[bagInCar[1]].body.velocity.x = 0;
                this.bag[bagInCar[1]].body.velocity.y = 0;
            }
            Game2.updateBag(this,bagInCar);
            if(!checkRes1) Game2.showOperator1(this,textBox);
            if(checkRes1){
                game.physics.arcade.moveToXY(this.car, game.world.width/2-250, game.world.height/2+110, 100, 200);
                Game2.showOperator2(this,bagInCar,textBox2);
            }
        }

        if(checkRes2) {
            game.time.events.add(1000, this.gotoStateD, this);
            Game2.nextTurn(this);
        }
    },

    backIfFail: function () {
        if(bagInCar[0]>-1 && bagInCar[1]>-1){
            if((value[bagInCar[0]] + value[bagInCar[1]]) % 10 === 0) {
                this.checkMatch = true;
            }
            else {
                game.physics.arcade.moveToXY(this.bag[bagInCar[0]], this.markBag[bagInCar[0]].x, this.markBag[bagInCar[0]].y, 100, 200);
                game.physics.arcade.moveToXY(this.bag[bagInCar[1]], this.markBag[bagInCar[1]].x, this.markBag[bagInCar[1]].y, 100, 200);
                bagInCar[0] = -1;
                bagInCar[1] = -1;
            }
        }
    },

    inputRes1: function(char){

        if (res1.length < 2) res1 = res1 + char;
        if (res1.length === 1) inputRes1.setText(res1);
        else if (res1.length === 2) inputRes1.setText(res1);
        trueRes = value[bagInCar[0]] + value[bagInCar[1]];
        if (res1.length === 2 && res1 !== trueRes.toString()) {
            res1 = '';
            inputRes1.setText(res1);
        }
        else if (res1===trueRes.toString()) checkRes1=true;
    },

    inputRes2: function(char){
        if (res2.length < 2) res2 = res2 + char;
        if (res2.length === 1) inputRes2.setText(res2);
        else if (res2.length === 2) inputRes2.setText(res2);
        trueRes2 = value[0] + value[1] + value[2] + value[3];
        if (res2.length === 2 && res2 !== trueRes2.toString()) {
            res2 = '';
            inputRes2.setText(res2);
        }
        else if (res2 === trueRes2.toString()) checkRes2=true;
    },

    gotoStateD: function () {
        game.state.start('Game2_StateD');
    }

};


Game2.StateD = function (){
    this.stage1;
    this.ball;
    this.turn = 1;
    this.markBag;
    this.car;
    this.bag;
    this.flag;
    this.textBag;
    this.checkMatch;
};

Game2.StateD.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");
        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, this.stage1.width, this.stage1.height-100);
        var style = { font: "32px Arial", fill: "#000"};

        Game2.addBackButton(this.stage1);
        this.ball = [];
        Game2.addTurnBar(this.turn,this.ball);

        Game2.addMarkBag(this);

        this.car = this.add.sprite(game.world.width/2, game.world.height/2+110, "car");
        game.physics.arcade.enable(this.car);
        this.car.inputEnabled = true;
        this.car.anchor.set(0.5);
        this.flag = this.add.image(this.car.x+130, this.car.y-120, "flag");

        this.bag = [];
        this.textBag = [];
        value = [3,8,6,4];
        for(i=0; i<4; i++){
            newBag = game.add.sprite(this.markBag[i].x, this.markBag[i].y,"bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            this.bag.push(newBag);
            this.textBag.push(newText);
        }

        textBox = game.add.image(this.flag.x+11,this.flag.y+12,'textBox');
        textBox.visible = false;
        textBox2 = game.add.image(this.stage1.x + 800, this.stage1.y + 425, 'textBox3');
        textBox2.visible = false;

        this.checkMatch = false;
        posBagInCar1 = [this.car.x-120, this.car.y-64];
        posBagInCar2 = [this.car.x-20, this.car.y-64];
        bagInCar = [-1,-1];
        res1 = ''; checkRes1 = false;
        inputRes1 = game.add.text(this.flag.x+18, this.flag.y+18, res1,{ font: "36px Arial", fill: "#000"});
        res2 = ''; checkRes2 = false;
        inputRes2 = game.add.text(this.stage1.x + 813, this.stage1.y + 435, res2,{ font: "42px Arial", fill: "#000"});
    },

    update: function (){
        Game2.updateTextBag(this);
        Game2.updateFlag(this);
        Game2.updateTextBox(this,textBox);
        Game2.updateRes1(this,inputRes1);

        if(!this.checkMatch) {
            for (i = 0; i < 4; i++) {
                Game2.moveBag(i, this, posBagInCar1, posBagInCar2, bagInCar, value);
                game.time.events.add(1500, this.backIfFail, this);
            }
        }

        if(this.checkMatch){
            if(this.car.body.velocity.x === 0) {
                this.bag[bagInCar[0]].body.velocity.x = 0;
                this.bag[bagInCar[0]].body.velocity.y = 0;
                this.bag[bagInCar[1]].body.velocity.x = 0;
                this.bag[bagInCar[1]].body.velocity.y = 0;
            }
            Game2.updateBag(this,bagInCar);
            if(!checkRes1) Game2.showOperator1(this,textBox);
            if(checkRes1){
                game.physics.arcade.moveToXY(this.car, game.world.width/2-250, game.world.height/2+110, 100, 200);
                Game2.showOperator2(this,bagInCar,textBox2);
            }
        }

        if(checkRes2) {
            game.time.events.add(1000, this.winGame, this);
            Game2.nextTurn(this);
        }
    },

    backIfFail: function () {
        if(bagInCar[0]>-1 && bagInCar[1]>-1){
            if((value[bagInCar[0]] + value[bagInCar[1]]) % 10 === 0) {
                this.checkMatch = true;
            }
            else {
                game.physics.arcade.moveToXY(this.bag[bagInCar[0]], this.markBag[bagInCar[0]].x, this.markBag[bagInCar[0]].y, 100, 200);
                game.physics.arcade.moveToXY(this.bag[bagInCar[1]], this.markBag[bagInCar[1]].x, this.markBag[bagInCar[1]].y, 100, 200);
                bagInCar[0] = -1;
                bagInCar[1] = -1;
            }
        }
    },

    inputRes1: function(char){

        if (res1.length < 2) res1 = res1 + char;
        if (res1.length === 1) inputRes1.setText(res1);
        else if (res1.length === 2) inputRes1.setText(res1);
        trueRes = value[bagInCar[0]] + value[bagInCar[1]];
        if (res1.length === 2 && res1 !== trueRes.toString()) {
            res1 = '';
            inputRes1.setText(res1);
        }
        else if (res1===trueRes.toString()) checkRes1=true;
    },

    inputRes2: function(char){
        if (res2.length < 2) res2 = res2 + char;
        if (res2.length === 1) inputRes2.setText(res2);
        else if (res2.length === 2) inputRes2.setText(res2);
        trueRes2 = value[0] + value[1] + value[2] + value[3];
        if (res2.length === 2 && res2 !== trueRes2.toString()) {
            res2 = '';
            inputRes2.setText(res2);
        }
        else if (res2 === trueRes2.toString()) checkRes2=true;
    },

    winGame: function () {
        game.state.start('Congratulation');
    }

};