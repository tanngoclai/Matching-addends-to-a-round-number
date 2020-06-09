var Game3 = {
    preload: function () {
        game.load.image("background", "assets/background.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("turnBall", "assets/turnBall.png");
        game.load.image("turnBar", "assets/turnBar.png");
        game.load.image("box", "assets/box.png");
        game.load.image("bracket", "assets/bracket.png");
        game.load.image("ballRes", "assets/ballRes.png");
        game.load.image("textBox", "assets/textBox3.png");
    },

    create: function (state) {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        state.add.image(0, 0, "background");
        state.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");

        state.failActivities = false;

        state.ball = [];
        state.blank = [];
        state.textDefault = [];
        state.box = [];
        state.textBox = [];

        Game3.addBackButton(state);
        Game3.addTurnBar(state);
        Game3.addBlank(state);
        Game3.addTextDefault(state);
        Game3.addBox(state);
        Game3.addTextBox(state);

        //Xac dinh gia tri ghep voi gia tri o vi tri 0
        if ((state.value[1] + state.value[0]) % 10 === 0) {
            state.pairWithValue0 = 1;
            state.notPairWithValue0 = 2;
        } else {
            state.pairWithValue0 = 2;
            state.notPairWithValue0 = 1;
        }

        //Them dau ngoac nhon, ban dau o trang thai an
        state.bracket = state.add.sprite(state.blank[0].x, state.blank[0].y + state.blank[0].height + 4, 'bracket');
        state.bracket.visible = false;

        //Them ballRes, textRes, ban dau o trang thai an
        state.ballRes = state.add.sprite(state.bracket.x + state.bracket.width / 2, state.bracket.y + 60, 'ballRes');
        state.ballRes.anchor.set(0.5);
        game.physics.arcade.enable(state.ballRes);
        state.ballRes.inputEnabled = true;
        state.ballRes.visible = false;

        state.textRes = state.game.add.text(state.ballRes.x, state.ballRes.y + 5, state.value[0] + state.value[state.pairWithValue0], {
            font: "32px Arial",
            fill: "#000"
        });
        state.textRes.anchor.set(0.5);
        state.textRes.visible = false;

        //Cai dat cac trang thai ban dau
        state.isEmpty = [true, true, true];
        state.effectStart = true;
        state.endStep1 = false;
        state.endStep2 = false;
        state.endGame = false;
        state.result = '';
    },

    update: function (state) {
        //Hieu ung khi bat dau game
        if (state.effectStart) {
            for (i = 1; i < 3; i++) {
                Game3.moveToBlank(state, i, state.stage1.x + 10 + i * 150, state.stage1.y + 75);
            }
            state.box[0].input.disableDrag();
            state.game.physics.arcade.moveToXY(state.box[0], state.blank[0].x, state.blank[0].y, 100, 350);
            if (state.isEmpty[0]) {
                game.time.events.add(600, Game3.addBracket, state);
            }
        }

        Game3.updateTextBox(state);
        Game3.updateTextRes(state);

        //Khi ghep dung cac gia tri vao vi tri tuong ung
        if (!state.isEmpty[0] && !state.isEmpty[1] && !state.isEmpty[2]) {
            state.game.time.events.add(500, Game3.showOperator, state);
        }

        //Khi ket thuc buoc 1
        if (state.endStep1) {
            state.game.time.events.add(800, Game3.destroyToShowOperator, state);
        }

        //Khi ket thuc buoc 2
        if (state.endStep2) {
            game.input.keyboard.addCallbacks(state, null, null, Game3.inputRes);
        }

        if(state.failActivities){
            Game3.backTurn(state);
        }

        //Khi hoan thanh luot choi
        if (state.endGame){
            if (!state.failActivities){
                game.time.events.add(1000, state.nextState, state);
                Game3.nextTurn(state);
            }
            else {
                game.time.events.add(1000, state.backState, state);
            }
        }
    },

    back: function () {
        game.state.start("Start");
    },

    addBackButton: function (state) {
        backButton = game.add.text(state.stage1.x + 5, state.stage1.y + 7, "<", {
            font: "40px Arial",
            fill: " #00BFFF",
            align: "center"
        });
        backButton2 = game.add.text(state.stage1.x + 30, state.stage1.y + 14, "Back", {
            font: "25px Arial",
            fill: " #00BFFF",
            align: "center"
        });
        backButton.inputEnabled = true;
        backButton2.inputEnabled = true;
        backButton.events.onInputUp.add(Game3.back);
        backButton2.events.onInputUp.add(Game3.back);
    },

    addTurnBar: function (state) {

        turnBar = game.add.image(game.world.width / 2, 50, "turnBar");
        turnBar.anchor.set(0.5);

        for (i = 0; i < state.turn; i++) {
            newBall = game.add.sprite(turnBar.x - turnBar.width / 2 + 15 + i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
        for (i = 0; i < 6 - state.turn; i++) {
            newBall = game.add.sprite(turnBar.x + turnBar.width / 2 - 15 - i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
    },

    addBox: function (state) {
        bounds = new Phaser.Rectangle(game.world.width / 2 - 450, 80, 900, 580);
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                newBox = game.add.sprite(state.stage1.x + 10 + i * (10 + state.box[i - 1].width), state.stage1.y + 75, "box");
            } else {
                newBox = game.add.sprite(state.stage1.x + 10, state.stage1.y + 75, "box");
            }
            game.physics.arcade.enable(newBox);
            newBox.inputEnabled = true;
            newBox.input.enableDrag();
            newBox.input.boundsRect = bounds;
            newBox.outOfBoundsKill = true;
            state.box.push(newBox);
        }
    },

    addBlank: function (state) {
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                newBlank = game.add.sprite(state.blank[0].x + i * (15 + state.blank[i - 1].width), state.blank[i - 1].y, "box");
            } else {
                newBlank = game.add.sprite(state.stage1.x + 150, state.stage1.y + 250, "box");
            }
            game.physics.arcade.enable(newBlank);
            state.blank.push(newBlank);
        }
    },

    addTextDefault: function (state) {
        style = {font: "48px Arial", fill: "#000"};
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                newText = game.add.text(state.stage1.x + 20 + i * 150, state.stage1.y + 88, "+ " + state.value[i].toString(), style);
            } else {
                newText = game.add.text(state.stage1.x + 20, state.stage1.y + 88, state.value[i].toString(), style);
            }
            state.textDefault.push(newText);
        }
        equal = game.add.text(state.stage1.x + 470, state.stage1.y + 88, '=', style);
        questionMark = game.add.text(state.stage1.x + 520, state.stage1.y + 88, '?', style);
        state.textDefault.push(equal);
        state.textDefault.push(questionMark);
    },

    addTextBox: function (state) {
        style = {font: "48px Arial", fill: "#000"};
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                newText = game.add.text(100, 100, '+ ' + state.value[i].toString(), style);
            } else {
                newText = game.add.text(100, 100, state.value[i].toString(), style);
            }
            newText.anchor.set(0.5);
            state.textBox.push(newText);
        }
    },

    addBracket: function () {
        this.bracket.visible = true;
        this.ballRes.visible = true;
        this.textRes.visible = true;
        this.isEmpty[0] = false;
    },

    updateTextBox: function (state) {
        for (i = 0; i < 3; i++) {
            state.textBox[i].x = Math.floor(state.box[i].x + state.box[i].width / 2);
            state.textBox[i].y = Math.floor(state.box[i].y + state.box[i].height / 2 + 8);
        }
    },

    updateTextRes: function (state) {
        state.textRes.x = Math.floor(state.ballRes.x);
        state.textRes.y = Math.floor(state.ballRes.y + 5);
    },

    moveToBlank: function (state, i, x, y) {
        if (game.input.mousePointer.isDown) {
            state.box[i].body.velocity.setTo(0, 0);
        } else {
            if (state.box[i].x !== x || state.box[i].y !== y) {
                if (i === state.pairWithValue0) {
                    if (Game3.isAroundBlank(state, i, 1)) {
                        game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y, 100, 200);
                        state.box[i].input.disableDrag();
                        state.isEmpty[1] = false;
                    } else game.physics.arcade.moveToXY(state.box[i], x, y, 100, 200);
                } else {
                    if (!state.isEmpty[1]) {
                        if (Game3.isAroundBlank(state, i, 2)) {
                            game.physics.arcade.moveToXY(state.box[i], state.blank[2].x, state.blank[2].y, 100, 200);
                            state.box[i].input.disableDrag();
                            state.isEmpty[2] = false;
                        } else game.physics.arcade.moveToXY(state.box[i], x, y, 100, 200);
                    } else {
                        if (Game3.isAroundBlank(state, i, 1)) {
                            game.physics.arcade.moveToXY(state.box[i], state.blank[1].x, state.blank[1].y, 100, 200);
                            game.time.events.add(1000, Game3.backIfFail, state);
                        } else game.physics.arcade.moveToXY(state.box[i], x, y, 100, 200);
                    }
                }
            }
        }
    },

    isAroundBlank: function (state, i, j) {
        return state.box[i].x > state.blank[j].x - state.blank[j].width
            && state.box[i].x < state.blank[j].x + state.blank[j].width
            && state.box[i].y > state.blank[j].y - state.blank[j].height
            && state.box[i].x < state.blank[j].x + state.blank[j].height;
    },

    backIfFail: function () {
        for (i = 1; i < 3; i++) {
            if (i !== this.pairWithValue0) {
                this.failActivities = true;
                game.physics.arcade.moveToXY(this.box[i], this.stage1.x + 10 + i * (10 + this.box[i - 1].width), this.stage1.y + 75, 100, 100);
            }
        }
    },

    showOperator: function () {
        this.textDefault[1].x = this.textDefault[0].x + 60;
        this.textDefault[2].x = this.textDefault[1].x + 110;
        this.textDefault[3].x = this.textDefault[2].x + 110;
        this.textDefault[4].destroy();
        game.time.events.add(500, Game3.destroyBox, this);
    },

    destroyBox: function () {
        this.effectStart = false;
        this.textBox[0].destroy();
        this.textBox[this.pairWithValue0].destroy();
        this.box[0].destroy();
        this.box[this.pairWithValue0].destroy();
        this.blank[0].destroy();
        this.blank[1].destroy();
        this.blank[2].destroy();
        this.bracket.destroy();
        game.physics.arcade.moveToXY(this.ballRes, this.textDefault[3].x + 70, this.textDefault[3].y + 23, 200, 200);
        game.physics.arcade.moveToXY(this.box[this.notPairWithValue0], this.textDefault[3].x + 110, this.textDefault[3].y - 15, 200, 200);
        this.endStep1 = true;
    },

    destroyToShowOperator: function () {
        this.textRes.destroy();
        this.ballRes.destroy();
        this.box[this.notPairWithValue0].destroy();
        game.time.events.add(100, Game3.addLast, this);
    },

    addLast: function () {
        if (!this.endStep2) {
            game.add.text(this.textDefault[3].x + 60, this.textDefault[3].y, this.value[0] + this.value[this.pairWithValue0], {
                font: "48px Arial",
                fill: "#000"
            });
            game.add.text(this.textDefault[3].x + 240, this.textDefault[3].y, '=', {font: "48px Arial", fill: "#000"});
            game.add.image(this.textDefault[3].x + 280, this.textDefault[3].y - 5, 'textBox');
            this.endStep2 = true;
        }
    },

    inputRes: function (char) {
        Game3.inputTrueRes(char, this);
    },

    inputTrueRes: function (char, state) {
        style = {
            font: "48px Arial",
            fill: "#000"
        };

        if (state.result.length < 2) state.result = state.result + char;

        if (state.result.length === 1) showRes = game.add.text(state.textDefault[3].x + 288, state.textDefault[3].y + 3, state.result, style);

        trueRes = state.value[0] + state.value[1] + state.value[2];

        if (state.result.length === 2 && state.result !== trueRes.toString()) {
            state.failActivities = true;
            showRes.destroy();
            state.result = '';
        } else if (state.result === trueRes.toString()) {
            showRes.destroy();
            showRes = game.add.text(state.textDefault[3].x + 288, state.textDefault[3].y + 3, state.result, style);
            state.endGame = true;
        }
    },

    nextTurn: function (state) {
        game.physics.arcade.moveToXY(state.ball[state.turn - 1], turnBar.x + turnBar.width / 2 - 15 - 23 * (6 - state.turn), turnBar.y, 100, 200);
    },

    backTurn: function (state) {
        if(state.turn < 6) game.physics.arcade.moveToXY(state.ball[state.turn], turnBar.x - turnBar.width / 2 + 15 + state.turn * 23, turnBar.y, 100, 200);
    }
};


Game3.StateA = function () {
    this.failActivities;//Kiem tra xem da thao tac sai lan nao hay chua, neu da tung thao tac sai thi lui luot choi
    this.stage1;
    this.turn = 6;
    this.box;//Hop chua gia tri la so, co the di chuyen duoc
    this.blank;//Vi tri de dat cac hop chua gia tri la so (this.box)
    this.value = [6, 68, 24];
    this.pairWithValue0;//So thu tu cua hop mang gia tri de ghep voi gia tri thu nhat tao thanh so tron (round number)
    this.notPairWithValue0;//So thu tu cua hop mang gia tri ghep voi gia tri thu nhat khong tao thanh so tron (round number)
    this.isEmpty;//Kiem tra cac vi tri dat cac hop (this.blank) co trong hay khong
    this.textDefault;//Cac gia tri o hang thu nhat, nam co dinh, chi nhin thay khi di chuyen cac hop ra ngoai
    this.textBox;//Hien thi cac so trong moi hop
    this.bracket;//Hien thi hoac an dau ngoac nhon
    this.ballRes;//Hinh tron nho chua gia tri, nam duoi dau ngoac ngon
    this.textRes;//Hien thi gia tri trong hinh tron o tren (this.ballRes)
    this.effectStart;//Kiem tra hieu ung khi bat dau tro choi da hoat dong hay chua
    this.endStep1;//Kiem tra ket thuc thao tac thu nhat hay chua (Thao tac 1: tu dau den khi ghep dung cac hop vao vi tri thich hop)
    this.endStep2;//Kiem tra ket thuc thao tac 2 hay chua (Thao tac 2: tu ket thuc thao tac 1 den khi hien thi xong phep tinh)
    this.endGame;//Kiem tra dieu kien ket thuc luot choi (dieu kien dung = nhap dung ket qua)
    this.result;//Hien tri ket qua nhap tu ban phim
};

Game3.StateA.prototype = {
    preload: function () {
        Game3.preload();
    },

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Game3_StateB');
    },

    backState: function () {
        game.state.start('Game3_StateA');
    }

};


Game3.StateB = function () {
    //Xem chu thich cac bien o StateA
    this.failActivities;
    this.stage1;
    this.ball;
    this.turn = 5;
    this.box;
    this.blank;
    this.value = [17, 23, 30];
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

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Game3_StateC');
    },

    backState: function () {
        game.state.start('Game3_StateA');
    }

};


Game3.StateC = function () {
    //Xem chu thich cac bien o StateA
    this.failActivities;
    this.stage1;
    this.ball;
    this.turn = 4;
    this.box;
    this.blank;
    this.value = [10, 12, 20];
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

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Game3_StateD');
    },

    backState: function () {
        game.state.start('Game3_StateB');
    }

};


Game3.StateD = function () {
    //Xem chu thich cac bien o StateA
    this.failActivities;
    this.stage1;
    this.ball;
    this.turn = 3;
    this.box;
    this.blank;
    this.value = [13, 15, 17];
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

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Game3_StateE');
    },

    backState: function () {
        game.state.start('Game3_StateC');
    }
};


Game3.StateE = function () {
    //Xem chu thich cac bien o StateA
    this.failActivities;
    this.stage1;
    this.ball;
    this.turn = 2;
    this.box;
    this.blank;
    this.value = [15, 24, 35];
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

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Game3_StateF');
    },

    backState: function () {
        game.state.start('Game3_StateD');
    }
};


Game3.StateF = function () {
    //Xem chu thich cac bien o StateA
    this.failActivities;
    this.stage1;
    this.ball;
    this.turn = 1;
    this.box;
    this.blank;
    this.value = [2, 30, 28];
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

    create: function () {
        Game3.create(this);
    },

    update: function () {
        Game3.update(this);
    },

    nextState: function () {
        game.state.start('Congratulation');
    },

    backState: function () {
        game.state.start('Game3_StateE');
    }
};