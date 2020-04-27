var Congratulation = {
    preload: function () {
        game.load.image("congratulation", "assets/congratulation.png");
        game.load.image("gotoStart", "assets/gotoStart.png");
    },

    create: function () {
        game.stage.backgroundColor = "#fff";

        congra = game.add.image(game.width / 2, game.height / 2 - 100, "congratulation");
        congra.anchor.setTo(0.5);

        goto = game.add.button(game.width / 2, game.height / 2 + 130, "gotoStart", this.gotoStart, this);
        goto.anchor.setTo(0.5);

    },

    gotoStart: function () {
        game.state.start("Start");
    }
};