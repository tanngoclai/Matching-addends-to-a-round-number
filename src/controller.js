var game = new Phaser.Game(1250,700 ,Phaser.AUTO,"");
game.state.add("Start", Start);
game.state.add("Game1_StateA", Game1.StateA);
game.state.add("Game1_StateB",Game1.StateB);
game.state.add("Game2_StateA",Game2.StateA);
game.state.start("Start");