var game = new Phaser.Game(1250,700 ,Phaser.AUTO,"");

game.state.add("Start", Start);

game.state.add("Game1_StateA", Game1.StateA);
game.state.add("Game1_StateB",Game1.StateB);
game.state.add("Game1_StateC",Game1.StateC);

game.state.add("Game2_StateA",Game2.StateA);
game.state.add("Game2_StateB",Game2.StateB);
game.state.add("Game2_StateC",Game2.StateC);
game.state.add("Game2_StateD",Game2.StateD);

game.state.add("Game3_StateA",Game3.StateA);
game.state.add("Game3_StateB",Game3.StateB);
game.state.add("Game3_StateC",Game3.StateC);
game.state.add("Game3_StateD",Game3.StateD);
game.state.add("Game3_StateE",Game3.StateE);
game.state.add("Game3_StateF",Game3.StateF);

game.state.add("Congratulation", Congratulation);

game.state.start("Start");