var Game2 = {
    preload: function () {
        game.load.image("background", "assets/background.png");
        game.load.image("stage1", "assets/stage1.png");
        game.load.image("turnBall", "assets/turnBall.png");
        game.load.image("turnBar", "assets/turnBar.png");
        game.load.image("car", "assets/car.png");
        game.load.image("flag", "assets/flag1.png");
        game.load.image("bag", "assets/bag.png");
        game.load.image("bag2", "assets/bag2.png");
        game.load.image("textBox", "assets/textbox.png");
        game.load.image("textBox3", "assets/textbox3.png");
    },

    create: function (state) {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        state.add.image(0, 0, "background");
        state.stage1 = game.add.sprite(game.world.width / 2 - 475, 25, "stage1");

        var style = {font: "32px Arial", fill: "#000"};

        Game2.addBackButton(state);
        state.ball = [];
        Game2.addTurnBar(state);

        Game2.addMarkBag(state);

        state.car = state.add.sprite(game.world.width / 2, game.world.height / 2 + 110, "car");
        game.physics.arcade.enable(state.car);
        state.car.inputEnabled = true;
        state.car.anchor.set(0.5);
        state.flag = state.add.image(state.car.x + 130, state.car.y - 120, "flag");

        Game2.addBag(state);

        state.textBox = game.add.image(state.flag.x + 11, state.flag.y + 12, 'textBox');
        state.textBox.visible = false;
        state.textBox2 = game.add.image(state.stage1.x + 800, state.stage1.y + 425, 'textBox3');
        state.textBox2.visible = false;

        state.checkMatch = false;
        state.posBagInCar1 = [state.car.x - 120, state.car.y - 64];
        state.posBagInCar2 = [state.car.x - 20, state.car.y - 64];
        state.bagInCar = [-1, -1];

        state.res = ['', ''];
        state.checkRes = [false, false];
        state.addRes = [null, null];
        state.addRes[0] = game.add.text(state.flag.x + 18, state.flag.y + 18, state.res[0], {
            font: "36px Arial",
            fill: "#000"
        });
        state.addRes[1] = game.add.text(state.stage1.x + 813, state.stage1.y + 435, state.res[1], {
            font: "42px Arial",
            fill: "#000"
        });
    },

    update: function (state) {
        Game2.updateTextBag(state);
        Game2.updateFlag(state);
        Game2.updateTextBox(state);
        Game2.updateRes1(state);

        //Neu chua ghep dung 2 gio thi thuc hien ghep
        if (!state.checkMatch) {
            for (i = 0; i < 4; i++) {
                Game2.moveBag(i, state);
            }
        }

        //Neu da ghep dung 2 gio
        if (state.checkMatch) {
            //Cap nhat vi tri cua 2 gio trong xe theo vi tri cua xe
            Game2.updateBag(state);

            //Khi xe dung yen thi 2 gio trong xe cung dung yen
            if (state.car.body.velocity.x === 0) {
                state.bag[state.bagInCar[0]].body.velocity.x = 0;
                state.bag[state.bagInCar[0]].body.velocity.y = 0;
                state.bag[state.bagInCar[1]].body.velocity.x = 0;
                state.bag[state.bagInCar[1]].body.velocity.y = 0;
            }
            //Neu chua dien dung ket qua thu nhat thi thuc hien dien ket qua
            if (!state.checkRes[0]) Game2.showOperator1(state);

            //Neu da dien dung ket qua thu nhat thi cap nhat vi tri moi cua xe va hien phep tinh thu hai
            if (state.checkRes[0]) {
                game.physics.arcade.moveToXY(state.car, game.world.width / 2 - 250, game.world.height / 2 + 110, 100, 200);
                Game2.showOperator2(state);
            }
        }

        //Neu dien dung ket qua thu 2 thi chuyen luot tiep theo
        if (state.checkRes[1]) {
            game.time.events.add(1000, state.nextState, state);
            Game2.nextTurn(state);
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
        for (i = 0; i < 4 - state.turn; i++) {
            newBall = game.add.sprite(turnBar.x + turnBar.width / 2 - 15 - i * 23, turnBar.y, "turnBall");
            newBall.anchor.set(0.5);
            game.physics.arcade.enable(newBall);
            state.ball.push(newBall);
        }
    },

    addMarkBag: function (state) {
        state.markBag = [];
        for (i = 0; i < 4; i++) {
            newMark = state.add.image(game.world.width / 2 + (i - 2) * 105, 165, "bag2");
            state.markBag.push(newMark);
        }
    },

    addBag: function (state) {
        bounds = new Phaser.Rectangle(game.world.width / 2 - 473, 78, state.stage1.width, state.stage1.height - 100);
        state.bag = [];
        state.textBag = [];

        for (i = 0; i < 4; i++) {
            newBag = game.add.sprite(state.markBag[i].x, state.markBag[i].y, "bag");
            game.physics.arcade.enable(newBag);
            newBag.inputEnabled = true;
            newBag.input.enableDrag();
            newBag.input.boundsRect = bounds;

            newText = game.add.text(0, 0, state.value[i], {font: "32px Arial", fill: "#000"});
            newText.anchor.set(0.5);

            state.bag.push(newBag);
            state.textBag.push(newText);
        }
    },

    updateTextBag: function (state) {
        for (i = 0; i < 4; i++) {
            state.textBag[i].x = Math.floor(state.bag[i].x + state.bag[i].width / 2 + 1);
            state.textBag[i].y = Math.floor(state.bag[i].y + state.bag[i].height / 2 + 25);
        }
    },

    updateTextBox: function (state) {
        state.textBox.x = Math.floor(state.flag.x + 11);
        state.textBox.y = Math.floor(state.flag.y + 12);
    },

    updateFlag: function (state) {
        state.flag.x = state.car.x + 130;
        state.flag.y = state.car.y - 120;
    },

    updateBag: function (state) {
        //Cap nhat gio trong theo theo vi tri cua xe
        state.bag[state.bagInCar[0]].x = state.car.x - 120;
        state.bag[state.bagInCar[0]].y = state.car.y - 64;
        state.bag[state.bagInCar[1]].x = state.bag[state.bagInCar[0]].x + 100;
        state.bag[state.bagInCar[1]].y = state.bag[state.bagInCar[0]].y;
    },

    updateRes1: function (state) {
        //Cap nhat vi tri ket qua 1 theo vi tri cua la co
        state.addRes[0].x = state.flag.x + 16;
        state.addRes[0].y = state.flag.y + 18;
    },

    moveBag: function (i, state) {
        x = state.markBag[i].x;
        y = state.markBag[i].y;

        if (game.input.mousePointer.isDown) {
            state.bag[i].body.velocity.setTo(0, 0);
        } else {
            if (state.bag[i].x !== x || state.bag[i].y !== y) {
                //Neu o gan vi tri 1 thi dat gio vao vi tri 1
                if (Game2.isAroundPos1InCar(state, i)) {
                    game.physics.arcade.moveToXY(state.bag[i], state.posBagInCar1[0], state.posBagInCar1[1], 100, 100);
                    state.bagInCar[0] = i;
                }
                //Neu o gan vi tri 1 thi dat gio vao vi tri 1
                else if (Game2.isAroundPos2InCar(state, i)) {
                    game.physics.arcade.moveToXY(state.bag[i], state.posBagInCar2[0], state.posBagInCar2[1], 100, 100);
                    state.bagInCar[1] = i;
                }
                //Neu khong o gan vi tri nao thi quay lai
                else game.physics.arcade.moveToXY(state.bag[i], x, y, 100, 100);
            }
            //Sau khi ghep du 2 gio, neu sai thi quay lai, neu dung thi giu nguyen
            game.time.events.add(3000, Game2.backIfFail, state);
        }
    },

    backIfFail: function () {
        //Neu co 2 gio tren xe
        if (this.bagInCar[0] > -1 && this.bagInCar[1] > -1) {
            //Neu ghep dung 2 gio thi checkMatch=true
            if ((this.value[this.bagInCar[0]] + this.value[this.bagInCar[1]]) % 10 === 0) {
                this.checkMatch = true;
            }
            //Neu ghep sai thi quay ve vi tri ban dau
            else {
                game.physics.arcade.moveToXY(this.bag[this.bagInCar[0]], this.markBag[this.bagInCar[0]].x, this.markBag[this.bagInCar[0]].y, 100, 70);
                game.physics.arcade.moveToXY(this.bag[this.bagInCar[1]], this.markBag[this.bagInCar[1]].x, this.markBag[this.bagInCar[1]].y, 100, 70);
                this.bagInCar[0] = -1;
                this.bagInCar[1] = -1;
            }
        }
    },

    isAroundPos1InCar: function (state, i) {
        return state.bag[i].x > state.posBagInCar1[0] - 80
            && state.bag[i].x < state.posBagInCar1[0] + 20
            && state.bag[i].y > state.posBagInCar1[1] - 80
            && state.bag[i].y < state.posBagInCar1[1] + 80;
    },

    isAroundPos2InCar: function (state, i) {
        return state.bag[i].x > state.posBagInCar2[0] - 60
            && state.bag[i].x < state.posBagInCar2[0] + 40
            && state.bag[i].y > state.posBagInCar2[1] - 80
            && state.bag[i].y < state.posBagInCar2[1] + 80;
    },

    showOperator1: function (state) {
        state.textBox.visible = true;
        game.input.keyboard.addCallbacks(state, null, null, Game2.inputRes1);
    },

    showOperator2: function (state) {
        count = 1;
        for (i = 0; i < 4; i++) {
            if (i !== state.bagInCar[0] && i !== state.bagInCar[1]) {
                game.physics.arcade.moveToXY(state.bag[i], state.car.x + 100 + count * 160, state.car.y - 50, 100, 200);
                count++;
            }
        }
        state.textBox2.visible = true;
        game.add.text(state.stage1.x + 450, state.stage1.y + 450, '+', {font: "32px Arial", fill: "#000"});
        game.add.text(state.stage1.x + 600, state.stage1.y + 450, '+', {font: "32px Arial", fill: "#000"});
        game.add.text(state.stage1.x + 750, state.stage1.y + 450, '=', {font: "32px Arial", fill: "#000"});
        game.input.keyboard.addCallbacks(state, null, null, Game2.inputRes2);
    },

    inputRes1: function (char) {
        Game2.inputRes(char, this, 0);
    },

    inputRes2: function (char) {
        Game2.inputRes(char, this, 1);
    },

    inputRes: function (char, state, i) {
        var trueRes;
        if (i === 0) {
            trueRes = state.value[state.bagInCar[0]] + state.value[state.bagInCar[1]];
        } else {
            trueRes = state.value[0] + state.value[1] + state.value[2] + state.value[3];
        }

        if (state.res[i].length < 2) state.res[i] = state.res[i] + char;
        if (state.res[i].length === 1) state.addRes[i].setText(state.res[i]);
        else if (state.res[i].length === 2) state.addRes[i].setText(state.res[i]);
        if (state.res[i].length === 2 && state.res[i] !== trueRes.toString()) {
            state.res[i] = '';
            state.addRes[i].setText(state.res[i]);
        } else if (state.res[i] === trueRes.toString()) state.checkRes[i] = true;
    },

    nextTurn: function (state) {
        game.physics.arcade.moveToXY(state.ball[state.turn - 1], turnBar.x + turnBar.width / 2 - 15 - 23 * (4 - state.turn), turnBar.y, 100, 200);
    }
};


Game2.StateA = function () {
    this.stage1;
    this.ball;//Bong dem luot choi
    this.turn = 4;
    this.markBag;//2 cho dat 2 gio tren xe
    this.car;
    this.bag;//4 gio
    this.flag;
    this.textBag;//So o trong gio
    this.checkMatch;//Kiem tra ghep 2 gio dung hay sai
    this.value = [18, 29, 3, 31];
    this.textBox;//Cho de dien ket qua
    this.textBox2;
    this.posBagInCar1;//Vi tri dat 2 gio tren xe
    this.posBagInCar2;
    this.bagInCar;//So thu tu cua gio dang o tren xe
    this.res;//Bien luu ket qua
    this.checkRes;//Kiem tra ket qua dung hay sai
    this.addRes;//Hien thi ket qua len man hinh
};

Game2.StateA.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function () {
        Game2.create(this);
    },

    update: function () {
        Game2.update(this);
    },

    nextState: function () {
        game.state.start('Game2_StateB');
    }
};


Game2.StateB = function () {
    this.stage1;
    this.ball;//Bong dem luot choi
    this.turn = 3;
    this.markBag;//2 cho dat 2 gio tren xe
    this.car;
    this.bag;//4 gio
    this.flag;
    this.textBag;//So o trong gio
    this.checkMatch;//Kiem tra ghep 2 gio dung hay sai
    this.value = [32, 14, 26, 15];
    this.textBox;//Cho de dien ket qua
    this.textBox2;
    this.posBagInCar1;//Vi tri dat 2 gio tren xe
    this.posBagInCar2;
    this.bagInCar;//So thu tu cua gio dang o tren xe
    this.res;//Bien luu ket qua
    this.checkRes;//Kiem tra ket qua dung hay sai
    this.addRes;//Hien thi ket qua len man hinh
};

Game2.StateB.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function () {
        Game2.create(this);
    },

    update: function () {
        Game2.update(this);
    },

    nextState: function () {
        game.state.start('Game2_StateC');
    }
};


Game2.StateC = function () {
    this.stage1;
    this.ball;//Bong dem luot choi
    this.turn = 2;
    this.markBag;//2 cho dat 2 gio tren xe
    this.car;
    this.bag;//4 gio
    this.flag;
    this.textBag;//So o trong gio
    this.checkMatch;//Kiem tra ghep 2 gio dung hay sai
    this.value = [17, 34, 4, 23];
    this.textBox;//Cho de dien ket qua
    this.textBox2;
    this.posBagInCar1;//Vi tri dat 2 gio tren xe
    this.posBagInCar2;
    this.bagInCar;//So thu tu cua gio dang o tren xe
    this.res;//Bien luu ket qua
    this.checkRes;//Kiem tra ket qua dung hay sai
    this.addRes;//Hien thi ket qua len man hinh
};

Game2.StateC.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function () {
        Game2.create(this);
    },

    update: function () {
        Game2.update(this);
    },

    nextState: function () {
        game.state.start('Game2_StateD');
    }
};


Game2.StateD = function () {
    this.stage1;
    this.ball;//Bong dem luot choi
    this.turn = 1;
    this.markBag;//2 cho dat 2 gio tren xe
    this.car;
    this.bag;//4 gio
    this.flag;
    this.textBag;//So o trong gio
    this.checkMatch;//Kiem tra ghep 2 gio dung hay sai
    this.value = [3, 8, 6, 4];
    this.textBox;//Cho de dien ket qua
    this.textBox2;
    this.posBagInCar1;//Vi tri dat 2 gio tren xe
    this.posBagInCar2;
    this.bagInCar;//So thu tu cua gio dang o tren xe
    this.res;//Bien luu ket qua
    this.checkRes;//Kiem tra ket qua dung hay sai
    this.addRes;//Hien thi ket qua len man hinh
};

Game2.StateD.prototype = {
    preload: function () {
        Game2.preload();
    },

    create: function () {
        Game2.create(this);
    },

    update: function () {
        Game2.update(this);
    },

    nextState: function () {
        game.state.start('Congratulation');
    }
};