var Start = {
    preload: function () {
        game.load.image("startBtn1", "assets/main1.png");
        game.load.image("startBtn2", "assets/main2.png");
        game.load.image("startBtn3", "assets/main3.png");
    },

    create: function () {
        game.stage.backgroundColor = "#fff";

        startButton1 = game.add.button(game.width / 2 - 250, game.height / 2 - 50, "startBtn1", this.startGame1, this);
        startButton1.anchor.setTo(0.5);

        startButton2 = game.add.button(game.width / 2, game.height / 2 - 50, "startBtn2", this.startGame2, this);
        startButton2.anchor.setTo(0.5);

        startButton3 = game.add.button(game.width / 2 + 250, game.height / 2 - 50, "startBtn3", this.startGame3, this);
        startButton3.anchor.setTo(0.5);

    },

    startGame1: function () {
        game.state.start("Game1_StateA");
    },

    startGame2: function () {
        game.state.start("Game2_StateA");
    },

    startGame3: function () {
        game.state.start("Game3_StateA");
    }
};
