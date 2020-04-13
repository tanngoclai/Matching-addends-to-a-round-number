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

    }
};

Game2.StateA = function (){
    this.stage1;
    this.ball;
    this.turn = 4;
    this.markPag;
    this.car;
    this.bag;
    this.flag;
    this.textBag;
};

Game2.StateA.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        var style = { font: "32px Arial", fill: "#000"};

        this.add.image(0, 0, "background");
        this.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");

        turnBar = game.add.image(game.world.width / 2, 50, "turnBar");
        turnBar.anchor.set(0.5);

        this.ball = [];
        for (i = 0; i < this.turn; i++) {
            newBall = this.add.sprite(turnBar.x - turnBar.width / 2 + 15 + i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            this.ball.push(newBall);
        }
        for (i = 0; i < 3 - this.turn; i++) {
            newBall = this.add.sprite(turnBar.x + turnBar.width / 2 - 15 - i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            this.ball.push(newBall);
        }

        backButton = this.add.text(this.stage1.x + 5, this.stage1.y + 7, "<", {
            font: "40px Arial",
            fill: " #00BFFF",
            align: "center"
        });
        backButton2 = this.add.text(this.stage1.x + 30, this.stage1.y + 14, "Back", {
            font: "25px Arial",
            fill: " #00BFFF",
            align: "center"
        });
        backButton.inputEnabled = true;
        backButton2.inputEnabled = true;
        backButton.events.onInputUp.add(this.back, this);
        backButton2.events.onInputUp.add(this.back, this);


        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, this.stage1.width, this.stage1.height-100);

        this.markPag = [];
        for( i=0; i<4; i++){
            newMark = this.add.image(game.world.width / 2 + (i-2)*105, 165, "bag2");
            this.markPag.push(newMark);
        }

        this.bag = [];
        this.textBag = [];
        value = [18,29,3,31];

        for(i=0; i<4; i++){
            newBag = this.add.image(this.markPag[i].x,this.markPag[i].y,"bag");
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = this.add.text(0,0,value[i],style);
            newText.anchor.set(0.5);

            this.bag.push(newBag);
            this.textBag.push(newText);
        }

        this.car = this.add.image(game.world.width/2, game.world.height/2+110, "car");
        this.car.anchor.set(0.5);
        this.flag = this.add.image(this.car.x+130, this.car.y-120, "flag");

    },

    back: function () {
        game.state.start("Start");
    },

    update: function (){
        for(i=0; i<4; i++){
            this.textBag[i].x = Math.floor(this.bag[i].x + this.bag[i].width / 2 + 1);
            this.textBag[i].y = Math.floor(this.bag[i].y + this.bag[i].height / 2 + 25);
        }

    }
};

