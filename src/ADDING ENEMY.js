this.enemy1 = this.physics.add.sprite(700, 400, 'enemy1').setScale(.9);
this.enemy1.setCollideWorldBounds(true);

this.enemy2 = this.physics.add.sprite(800, 200, 'enemy2').setScale(.9);
this.enemy2.setCollideWorldBounds(true);

this.physics.add.collider(this.player, this.enemy1, this.playerDie, null, this);
this.physics.add.collider(this.player, this.enemy2, this.playerDie, null, this);

