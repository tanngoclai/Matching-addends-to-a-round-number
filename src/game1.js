var Game1;
Game1 = {
    tail1 : null,
    tail2 : null,
    tail3 : null,
    head1 : null,
    head2 : null,
    head3 : null,
    stage1 : null,


    preload: function () {
        game.load.image("background", "assets/background.png")
        game.load.image("player", "assets/player.png");
        game.load.image("tail", "assets/tail.png");
        game.load.image("head", "assets/head.png");
        game.load.image("stage1", "assets/stage1.png");
    },

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.add.image(0, 0, "background");

        this.stage1 = game.add.sprite(game.world.width/2 - 475,25, "stage1" );
        game.physics.arcade.enable(this.stage1);

        bounds = new Phaser.Rectangle(game.world.width/2 - 473, 78, 608, 580);


        this.tail1 = game.add.sprite(this.stage1.x + 100, this.stage1.y + 75, "tail");
        game.physics.arcade.enable(this.tail1);
        this.tail1.inputEnabled = true;
        this.tail1.input.enableDrag();
        this.tail1.input.boundsRect = bounds;

        this.tail2 = game.add.sprite(this.stage1.x + 100, this.stage1.y + this.tail1.height + 100, "tail");
        game.physics.arcade.enable(this.tail2);
        this.tail2.inputEnabled = true;
        this.tail2.input.enableDrag();
        this.tail2.input.boundsRect = bounds;

        this.tail3 = game.add.sprite(this.stage1.x + 100, this.stage1.y + 2*this.tail1.height + 125, "tail");
        game.physics.arcade.enable(this.tail3);
        this.tail3.inputEnabled = true;
        this.tail3.input.enableDrag();
        this.tail3.input.boundsRect = bounds;

        this.head1 = game.add.sprite(this.stage1.x + this.stage1.width - 266 - 75, this.stage1.y + 75, "head" );
        game.physics.arcade.enable(this.head1);
        this.head1.body.immovable = true;

        this.head2 = game.add.sprite(this.stage1.x + this.stage1.width - 266 - 75, this.stage1.y + this.tail1.height + 100, "head" );
        game.physics.arcade.enable(this.head2);
        this.head2.body.immovable = true;

        this.head3 = game.add.sprite(this.stage1.x + this.stage1.width - 266 - 75, this.stage1.y + 2*this.tail1.height + 125, "head" );
        game.physics.arcade.enable(this.head3);
        this.head3.body.immovable = true;

        var style = { font: "32px Arial", fill: "#000"};
        textTail1 = game.add.text(100, 100, 27, style);
        textTail1.anchor.set(0.5);

        var style = { font: "32px Arial", fill: "#000"};
        textTail2 = game.add.text(100, 100, 36, style);
        textTail2.anchor.set(0.5);

        var style = { font: "32px Arial", fill: "#000"};
        textTail3 = game.add.text(100, 100, 8, style);
        textTail3.anchor.set(0.5);

        var style = { font: "32px Arial", fill: "#000"};
        textHead1 = game.add.text(100, 100, 42, style);
        textHead1.anchor.set(0.5);

        var style = { font: "32px Arial", fill: "#000"};
        textHead2 = game.add.text(100, 100, 13, style);
        textHead2.anchor.set(0.5);

        var style = { font: "32px Arial", fill: "#000"};
        textHead3 = game.add.text(100, 100, 34, style);
        textHead3.anchor.set(0.5);
    },


    update: function () {

        if(game.input.mousePointer.isDown ) {
            this.tail1.body.velocity.setTo(0, 0);
        }
        else {
            if(this.tail1.x != this.stage1.x + 100) {
                if (this.tail1.x < this.stage1.x + 325) {
                    game.physics.arcade.moveToXY(this.tail1, this.stage1.x + 100, this.head1.y, 100, 350);
                }
                else {
                    if (this.tail1.y < this.head2.y-this.head1.height/2){
                        game.physics.arcade.moveToXY(this.tail1, this.head1.x - this.tail1.width, this.head1.y, 100, 250);
                    }
                    else {
                        if (this.tail1.y < this.head3.y-this.head2.height/2) {
                            game.physics.arcade.moveToXY(this.tail1, this.head1.x - this.tail1.width, this.head2.y, 100, 250);
                        }
                        else game.physics.arcade.moveToXY(this.tail1, this.head1.x - this.tail1.width, this.head3.y, 100, 250);
                    }
                }
            }
        }


        if(game.input.mousePointer.isDown ) {
            this.tail2.body.velocity.setTo(0, 0);
        }
        else {
            if(this.tail2.x != this.stage1.x + 100) {
                if (this.tail2.x < this.stage1.x + 325) {
                    game.physics.arcade.moveToXY(this.tail2, this.stage1.x + 100, this.head2.y, 100, 350);
                }
                else {
                    if (this.tail2.y < this.head2.y-this.head1.height/2){
                        game.physics.arcade.moveToXY(this.tail2, this.head1.x - this.tail1.width, this.head1.y, 100, 250);
                    }
                    else {
                        if (this.tail2.y < this.head3.y-this.head2.height/2) {
                            game.physics.arcade.moveToXY(this.tail2, this.head1.x - this.tail1.width, this.head2.y, 100, 250);
                        }
                        else game.physics.arcade.moveToXY(this.tail2, this.head1.x - this.tail1.width, this.head3.y, 100, 250);
                    }
                }
            }
        }


        if(game.input.mousePointer.isDown ) {
            this.tail3.body.velocity.setTo(0, 0);
        }
        else {
            if(this.tail3.x != this.stage1.x + 100) {
                if (this.tail3.x < this.stage1.x + 325) {
                    game.physics.arcade.moveToXY(this.tail3, this.stage1.x + 100, this.head3.y, 100, 350);
                }
                else {
                    if (this.tail3.y < this.head2.y-this.head1.height/2){
                        game.physics.arcade.moveToXY(this.tail3, this.head1.x - this.tail1.width, this.head1.y, 100, 250);
                    }
                    else {
                        if (this.tail3.y < this.head3.y-this.head2.height/2) {
                            game.physics.arcade.moveToXY(this.tail3, this.head1.x - this.tail1.width, this.head2.y, 100, 250);
                        }
                        else game.physics.arcade.moveToXY(this.tail3, this.head1.x - this.tail1.width, this.head3.y, 100, 250);
                    }
                }
            }
        }

        textTail1.x = Math.floor(this.tail1.x + this.tail1.width / 2 + 1);
        textTail1.y = Math.floor(this.tail1.y + this.tail1.height / 2 + 8);

        textTail2.x = Math.floor(this.tail2.x + this.tail1.width / 2 + 1);
        textTail2.y = Math.floor(this.tail2.y + this.tail1.height / 2 + 8);

        textTail3.x = Math.floor(this.tail3.x + this.tail1.width / 2 + 1);
        textTail3.y = Math.floor(this.tail3.y + this.tail1.height / 2 + 8);

        textHead1.x = Math.floor(this.head1.x + this.head1.width / 2 - 66);
        textHead1.y = Math.floor(this.head1.y + this.head1.height / 2 + 8 );

        textHead2.x = Math.floor(this.head2.x + this.head1.width / 2 - 66);
        textHead2.y = Math.floor(this.head2.y + this.head1.height / 2 + 8 );

        textHead3.x = Math.floor(this.head3.x + this.head1.width / 2 - 66);
        textHead3.y = Math.floor(this.head3.y + this.head1.height / 2 + 8 );

    },

    endGame: function() {
        //game.state.start("Start");
    }
};