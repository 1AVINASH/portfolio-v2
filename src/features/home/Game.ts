import Phaser from 'phaser';

// Define the class for your game scene
export default class Game extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private staticColliders!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Add this line

    constructor() {
        // Provide a unique key for your scene
        super('Game');
    }

    preload() {
        // --- 1. Load your assets ---
        this.load.image('tileset', 'assets/tileset16x16.png');

        // Load the Tiled map data (the JSON file you exported from Tiled)
        // 'platformer' is a unique identifier for Phaser to refer to this map data.
        this.load.tilemapTiledJSON('platformer', 'assets/platformer.json');
    }

    create() {
        // --- 2. Basic Scene Setup and Debugging Aids ---

        // Set a background color to easily see if the scene is rendering anything
        this.cameras.main.setBackgroundColor('#333333'); // A dark grey, easily distinguishable
        this.staticColliders = this.physics.add.staticGroup(); 
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Create the map object using the key you defined in preload()
        // console.log('Phaser Map Object:', map); // DEBUG: Check if map object is created successfully
        const map = this.make.tilemap({ key: 'platformer' });
        const tileset = map.addTilesetImage('Tileset', 'tileset');

        // Essential check: If tileset is null, the name didn't match.
        if (!tileset) {
            console.error(
                "ERROR: Tileset 'Test-Spritesheet' not found or name mismatch in Tiled map data!",
                "Check the 'name' property of your tileset in the exported JSON file."
            );
            return; // Stop execution if tileset isn't loaded correctly
        }
        const tiledLayer1 = map.createLayer("Terrain", tileset, 0, 0);
        const collisionObjects = map.getObjectLayer('collision');

        console.log('Tiled Layer 1 created:', tiledLayer1); // DEBUG: Check if layer objects are created
        if (collisionObjects) {
            collisionObjects.objects.forEach(obj => {
                // Create a static physics body for each object in the 'collision' layer
                // This assumes your objects in Tiled are rectangles.
                const collisionRect = this.add.rectangle(obj.x! + obj.width! / 2, obj.y! + obj.height! / 2, obj.width!, obj.height!);
                this.physics.world.enable(collisionRect, Phaser.Physics.Arcade.STATIC_BODY);
                collisionRect.setVisible(true); // Make the collision rectangle invisible

                this.staticColliders.create(obj.x! + obj.width! / 2, obj.y! + obj.height! / 2)
                .setSize(obj.width, obj.height)
                .setVisible(false);
            });
        } else {
            console.warn("Object layer 'collision' not found in map.");
        }

        this.player = this.physics.add.sprite(100, 100, '__WHITE');
        this.player.setDisplaySize(32, 40); // Set its visual size
        this.player.setTint(0xff0000);      // Make it red for easy visibility
        
        // Enable physics for the player
        this.physics.world.enable(this.player); // This is often implicit with this.physics.add.sprite

        // Set player properties
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true); // Player cannot go outside game bounds
        this.player.setGravityY(500); // Apply gravity so the player falls onto platforms
        this.physics.add.collider(this.player, this.staticColliders, () => {
            // console.log('Player collided with static group!');
        });

        console.log('Setting Camera Bounds to:', 0, 0, map.widthInPixels+200, map.heightInPixels);
        this.cameras.main.setBounds(-175, 0, map.widthInPixels+500, map.heightInPixels);
        console.log('Camera World View after setBounds:', this.cameras.main.worldView);


        this.cameras.main.startFollow(this.player);

        this.cameras.main.setLerp(1, 1);
        this.cameras.main.roundPixels = true; // <--- Add this line!
    }

    update(time: number, delta: number) {
        // Horizontal Movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200); // Move left at 160 pixels/second
            // Flip player sprite if you load one later
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200); // Move right at 160 pixels/second
            // Unflip player sprite
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0); // Stop horizontal movement if no key is pressed
        }

        // Jumping
        // Check if 'UP' arrow is pressed AND the player is currently on the floor
        if (this.cursors.up.isDown && this.player.body?.blocked.down) {
            this.player.setVelocityY(-250); // Apply an upward velocity for jumping (negative Y is up)
            console.log('Player jumped!'); // Debug: Confirm jump
        }
    }
}