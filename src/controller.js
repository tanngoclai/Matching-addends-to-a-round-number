var game = new Phaser.Game(1250,700 ,Phaser.AUTO,"");
game.state.add("Start", Start);
game.state.add("Game1", Game1);
game.state.start("Start");