let Game1 = {
    preload: function() {
        game.load.image("tail", "assets/tail.png");
        game.load.image("head", "assets/head.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("flag", "assets/flag1.png");
        game.load.image("turnBall", "assets/turnBall.png");
        game.load.image("turnBar", "assets/turnBar.png");
        game.load.image("textbox", "assets/textbox.png");
    },

    create: function(state) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        state.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");

        state.ball = [];
        state.tail = [];
        state.head = [];
        state.flag = [];
        state.textHead = [];
        state.textTail = [];
        state.matchHead = [-1, -1, -1];
        state.checkMatch = [false, false, false];
        state.checkRes = [false, false, false];
        state.res = ['', '', ''];

        Game1.addBackButton(state);
        Game1.addTurnBar(state);

        Game1.addTail(state);
        Game1.addHead(state);
        Game1.addFlag(state);

        Game1.addTextHead(state);
        Game1.addTextTail(state);
    },

    update: function(state) {
        for (i = 0; i < 3; i++) {
            Game1.moveTail(i, state.stage1.x + 100, state.head[i].y, state);
        }

        Game1.updateTextHead(state);
        Game1.updateTextTail(state);
        Game1.updateFlag(state);

        //Nhap ket qua dung
        for (i = 0; i < 3; i++) {
            if (state.checkMatch[i] && !state.checkRes[i]) {
                Game1.inputRes(i, state);
            }
        }

        //Neu 3 ket qua dung thi chuyen luot tiep theo
        if (state.checkRes[0] && state.checkRes[1] && state.checkRes[2]) {
            game.time.events.add(1000, state.nextState, state);
            Game1.nextTurn(state);
        }
    },

    back: function() {
        game.state.start("Start");
    },

    addBackButton: function(state) {
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
        backButton.events.onInputUp.add(Game1.back);
        backButton2.events.onInputUp.add(Game1.back);
    },

    addTurnBar: function(state) {

        turnBar = game.add.image(game.world.width / 2, 50, "turnBar");
        turnBar.anchor.set(0.5);

        for (i = 0; i < state.turn; i++) {
            newBall = game.add.sprite(turnBar.x - turnBar.width / 2 + 15 + i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
        for (i = 0; i < 3 - state.turn; i++) {
            newBall = game.add.sprite(turnBar.x + turnBar.width / 2 - 15 - i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
    },

    addTail: function(state) {
        bounds = new Phaser.Rectangle(game.world.width / 2 - 473, 78, 608, 580);
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                newTail = game.add.sprite(state.stage1.x + 100, state.stage1.y + 75 + i * (25 + state.tail[i - 1].height), "tail");
            } else {
                newTail = game.add.sprite(state.stage1.x + 100, state.stage1.y + 75, "tail");
            }
            game.physics.arcade.enable(newTail);
            newTail.inputEnabled = true;
            newTail.input.enableDrag();
            newTail.input.boundsRect = bounds;
            newTail.outOfBoundsKill = true;
            state.tail.push(newTail);
        }
    },

    addHead: function(state) {
        for (i = 0; i < 3; i++) {
            newHead = game.add.sprite(state.stage1.x + state.stage1.width - 266 - 75, state.tail[i].y, "head");
            game.physics.arcade.enable(newHead);
            newHead.inputEnabled = true;
            state.head.push(newHead);
        }
    },

    addFlag: function(state) {
        for (i = 0; i < 3; i++) {
            newFlag = game.add.image(state.head[i].x + 200, state.head[i].y - 6, "flag");
            state.flag.push(newFlag);
        }
    },

    addTextHead: function(state) {
        let style = { font: "32px Arial", fill: "#000" };
        for (i = 0; i < 3; i++) {
            newText = game.add.text(100, 100, state.valueHead[i], style);
            newText.anchor.set(0.5);
            state.textHead.push(newText);
        }
    },

    addTextTail: function(state) {
        let style = { font: "32px Arial", fill: "#000" };
        for (i = 0; i < 3; i++) {
            newText = game.add.text(100, 100, state.valueTail[i], style);
            newText.anchor.set(0.5);
            state.textTail.push(newText);
        }
    },

    updateTextHead: function(state) {
        for (i = 0; i < 3; i++) {
            state.textHead[i].x = Math.floor(state.head[i].x + state.head[i].width / 2 - 47);
            state.textHead[i].y = Math.floor(state.head[i].y + state.head[i].height / 2 + 8);
        }
    },

    updateTextTail: function(state) {
        for (i = 0; i < 3; i++) {
            state.textTail[i].x = Math.floor(state.tail[i].x + state.tail[i].width / 2 + 1);
            state.textTail[i].y = Math.floor(state.tail[i].y + state.tail[i].height / 2 + 8);
        }
    },

    updateFlag: function(state) {
        for (i = 0; i < 3; i++) {
            state.flag[i].x = Math.floor(state.head[i].x + 200);
            state.flag[i].y = Math.floor(state.head[i].y - 6);
        }
    },

    backIfFail: function() {
        for (i = 0; i < 3; i++) {
            if (this.matchHead[i] > -1 && !this.checkMatch[i]) {
                game.physics.arcade.moveToXY(this.tail[this.matchHead[i]], this.stage1.x + 100, this.head[i].y, 100, 100);
                this.matchHead[i] = -1;
            }
        }
    },

    matchTailToHead: function(i, j, state) {
        // Ghep vao Head[j]
        game.physics.arcade.moveToXY(state.tail[i], state.head[j].x - state.tail[j].width, state.head[j].y, 100, 100);
        state.matchHead[j] = i;
        if ((state.valueTail[i] + state.valueHead[j]) % 10 === 0) {
            //Neu ghep dung, hien phep tinh
            if (!state.checkMatch[j]) Game1.addOperator(state.head[j]);
            state.tail[i].input.disableDrag();
            state.checkMatch[j] = true;
        } else {
            //Neu ghep sai, quay ve vi tri ban dau
            game.time.events.add(1500, Game1.backIfFail, state);
        }
    },

    moveTail: function(i, x, y, state) {
        if (game.input.mousePointer.isDown) {
            //Neu nhan chuot thi Tail khong di chuyen
            state.tail[i].body.velocity.setTo(0, 0);
        } else {
            if (state.tail[i].x !== x || state.tail[i].y !== y) {
                //Neu tail bi keo ra khoi vi tri ban dau va tha chuot
                if (state.tail[i].x < state.stage1.x + state.stage1.height / 2) {
                    // Quay ve vi tri ban dau neu khong o gan Head nao
                    game.physics.arcade.moveToXY(state.tail[i], x, y, 100, 100);
                } else {
                    if (state.tail[i].y < state.head[1].y - state.head[0].height / 2) {
                        //Neu o gan Head 0 thi ghep vao Head 0
                        Game1.matchTailToHead(i, 0, state);
                    } else {
                        if (state.tail[i].y < state.head[2].y - state.head[1].height / 2) {
                            //Neu o gan Head 1 thi ghep vao Head 1
                            Game1.matchTailToHead(i, 1, state);
                        } else {
                            //Neu o gan Head 2 thi ghep vao Head 2
                            Game1.matchTailToHead(i, 2, state);
                        }
                    }
                }
            }
        }
    },

    addOperator: function(head) {
        let style = { font: "64px Arial", fill: "#000" };
        newoperator = game.add.text(head.x - 10, head.y + 90, '+', style);
        newoperator.anchor.set(0.5);
        game.add.image(head.x + 212, head.y + 7, 'textbox');
    },

    inputRes: function(i, state) {
        if (i === 0) {
            game.input.keyboard.addCallbacks(state, null, null, Game1.isTrueKey1);
        } else if (i === 1) {
            game.input.keyboard.addCallbacks(state, null, null, Game1.isTrueKey2);
        } else {
            game.input.keyboard.addCallbacks(state, null, null, Game1.isTrueKey3);
        }
    },

    isTrueKey1: function(char) {
        Game1.inputTrueKey(0, char, this);
    },

    isTrueKey2: function(char) {
        Game1.inputTrueKey(1, char, this);
    },

    isTrueKey3: function(char) {
        Game1.inputTrueKey(2, char, this);
    },

    inputTrueKey: function(i, char, state) {
        //Ham kiem tra ket qua
        if (state.res[i].length < 2) state.res[i] = state.res[i] + char;
        if (state.res[i].length === 1) a1 = game.add.text(state.flag[i].x + 20, state.flag[i].y + 22, state.res[i]);
        else if (state.res[i].length === 2) a2 = game.add.text(a1.x + 20, a1.y, state.res[i].charAt(1));
        trueRes = state.valueHead[i] + state.valueTail[state.matchHead[i]];
        if (state.res[i].length === 2 && state.res[i] !== trueRes.toString()) {
            a1.destroy();
            a2.destroy();
            state.res[i] = '';
        } else if (state.res[i] === trueRes.toString()) state.checkRes[i] = true;
    },

    nextTurn: function(state) {
        game.physics.arcade.moveToXY(state.ball[state.turn - 1], turnBar.x + turnBar.width / 2 - 15 - 23 * (3 - state.turn), turnBar.y, 100, 200);
    }
};


Game1.StateA = function() {
    this.stage1;
    this.ball; //Bong dem luot choi
    this.turn = 3;
    this.tail; //Duoi xe
    this.head; //Dau xe
    this.flag; //la co
    this.valueHead = [42, 13, 34]; //Gia tri cua dau xe
    this.valueTail = [27, 36, 8]; //Gia tri cua duoi xe
    this.textHead; //Hien thi so o dau xe
    this.textTail; //Hien thi so o duoi xe
    this.matchHead; //Kiem tra trang thai noi duoi xe voi dau xe
    this.checkMatch; //Kiem tra noi dung duoi xe voi dau xe chua
    this.checkRes; //Kiem tra ket qua dung hay sai
    this.res; //Hien thi ket qua
};

Game1.StateA.prototype = {

    preload: function() {
        Game1.preload();
    },

    create: function() {
        Game1.create(this);
    },

    update: function() {
        Game1.update(this);
    },

    nextState: function() {
        game.state.start('Game1_StateB');
    }
};


Game1.StateB = function() {
    //Xem chu thich cac bien o StateA
    this.stage1;
    this.ball;
    this.turn = 2;
    this.tail;
    this.head;
    this.flag;
    this.valueHead = [16, 57, 39];
    this.valueTail = [23, 24, 11];
    this.textHead;
    this.textTail;
    this.matchHead;
    this.checkMatch;
    this.checkRes;
    this.res;
};

Game1.StateB.prototype = {

    preload: function() {
        Game1.preload();
    },

    create: function() {
        Game1.create(this);
    },

    update: function() {
        Game1.update(this);
    },

    nextState: function() {
        game.state.start('Game1_StateC');
    }
};


Game1.StateC = function() {
    //Xem chu thich cac bien o StateA
    this.stage1;
    this.ball;
    this.turn = 1;
    this.tail;
    this.head;
    this.flag;
    this.valueHead = [35, 64, 23];
    this.valueTail = [37, 26, 45];
    this.textHead;
    this.textTail;
    this.matchHead;
    this.checkMatch;
    this.checkRes;
    this.res;
};

Game1.StateC.prototype = {

    preload: function() {
        Game1.preload();
    },

    create: function() {
        Game1.create(this);
    },

    update: function() {
        Game1.update(this);
    },

    nextState: function() {
        game.state.start("Congratulation");
    }
};