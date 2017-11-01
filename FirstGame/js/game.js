window.onload = function() {

		var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

		function preload() {
			game.load.image('sky', 'assets/sky.png');
			game.load.image('ground', 'assets/platform.png');
			game.load.image('star', 'assets/star.png');
			game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
			game.load.image('winner', 'assets/winner.png');
			game.load.spritesheet('badGuy', 'assets/baddie.png', 30, 30);
			game.load.image('healthPack', 'assets/firstaid.png');
			game.load.image('diamond', 'assets/diamond.png');

		} // End Preload

		// Global Variables

			var moveKeys;
			var score = 0;
			var scoreText;
			var player;
			var healthText;
			var health = 100;
			var healthPack;
			var badGuy;
			var starCount = 12;

			function create() {
//		This game uses physics, so we will start the ARCADE physics engine
				game.physics.startSystem(Phaser.Physics.ARCADE);

				game.add.sprite(0, 0, 'sky');

//		We are going to group all the ledges and the ground together
				platforms = game.add.group();
//		Any object added to this group will have physics enabled
				platforms.enableBody = true;

//		Now create two ledges
				var ledge = platforms.create(400, 400, 'ground');
				ledge.body.immovable = true;
				ledge = platforms.create(-150, 200, 'ground');
				ledge.body.immovable = true;

//		Create the ground and add it to the platforms group
			var ground = platforms.create(0, game.world.height - 32, 'ground');
//		Scale the ground along the X and Y axis to fill  the bottom of the screen
				ground.scale.setTo(2, 1);
// 		This means that it will no longer move away when someting collides with it
			ground.body.immovable = true;

//		Create the player sprite and call the object 'player'
				player = game.add.sprite(32, game.world.height - 150, 'dude');

//		Enable physics on the player
				game.physics.arcade.enable(player);

//		Player physics properties
				player.body.bounce.y = 0.2;
				player.body.gravity.y = 300;
				player.body.collideWorldBounds = true;

//		Two animations, walking left and right
				player.animations.add('left' , [0, 1, 2, 3], 10, true);
				player.animations.add('right', [5, 6, 7, 8], 10, true );

// 		For the bad guy
				enemy = game.add.sprite(400, game.world.height - 150, 'badGuy');
				game.physics.arcade.enable(enemy);
				enemy.body.bounce.y = 0.1;
				enemy.body.gravity.y = 100;
				enemy.body.collideWorldBounds = true;


			moveKeys = game.input.keyboard.addKeys(
					{
							'up': Phaser.KeyCode.W,
							'down': Phaser.KeyCode.S,
							'left': Phaser.KeyCode.A,
							'right': Phaser.KeyCode.D
					}
			);

			stars = game.add.group();
			stars.enableBody = true;
//		Here we'll create 12 of them evenly spaced apart
			for (var i = 0; i < 12; i++)
			{
//		Create a star inside of the 'stars' group
				var star = stars.create(i * 70, 0, 'star');

//		Let gravity do its thing
				star.body.gravity.y = 1000;

				game.add.sprite(525, 368, 'healthPack');


//		This just gives each star a slightly random bounce value
//				star.body.bounce.y = 0.7 + Math.random() * 0.2;
			}
				scoreText = game.add.text(16, 16, 'Score: ' + score, {fontSize: '32px', fill: '#000' });
				healthText = game.add.text(600, 16, 'Health: ' + health, {fontSize: '32px', fill: '#000'});
	} // End Create

		function update () {
//		Collide the player and the stars with the platorms
				var hitPlatform = game.physics.arcade.collide(player, platforms);
				game.physics.arcade.collide(enemy, platforms);

//		Reset the player velocity (movement)
				player.body.velocity.x = 0;

			if (moveKeys.left.isDown)
			{
//		Move to the left
					player.body.velocity.x = -400;

					player.animations.play('left');
			}
				else if (moveKeys.right.isDown)
				{
//		Move to the right
					player.body.velocity.x = 400;

					player.animations.play('right');
				}
			else
				{
//		Stand still
					player.animations.stop();

					player.frame = 4;
				}

//		Allow the player to jump if they are touching the ground.
		if (moveKeys.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -350;
		}

		if (starCount == 0) {
			moreStars();
			starCount == 12;
		}

//		Have the stars collide with the platforms
		game.physics.arcade.collide(stars, platforms);
//		If there is a collision between the player and a star, run 'collectStar'
		game.physics.arcade.overlap(player, stars, collectStar, null, this);
// Check for a collision between the player and the Health Pack
		game.physics.arcade.collide(player, healthPack, moreHealth);
	} // End Update

		function collectStar(player, star) {
//		Removes the star from the screen
				star.kill();
				score += 10;
				scoreText.text = 'Score: ' + score;
				starCount -= 1;

	/*			if (score > 115){
					game.add.sprite(50, 50, 'winner');
					player.kill();
			} */
			} // End collectStar

			function moreHealth(player, healthPack) {
				healthPack.kill();
				health += 20
				healthText.text = 'Health: ' + health

				if (healthText.text > 100){
					healthText.text = 'Health: ' + health
				}
			} // End moreHealth

			function moreStars() {

				stars = game.add.group();
				stars.enableBody = true;
	//		Here we'll create 12 of them evenly spaced apart
				for (var i = 0; i < 12; i++)
				{
	//		Create a star inside of the 'stars' group
					var star = stars.create(i * 70, 0, 'star');

	//		Let gravity do its thing
					star.body.gravity.y = 1000;
			}
		} // End moreStars

}; // End Form
