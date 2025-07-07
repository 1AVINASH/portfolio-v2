// src/Game.ts
import Phaser from 'phaser';
import MyScene from './features/home/Game'

const mapPixelHeight = 320
const mapPixelWidth = 640

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: mapPixelWidth,
	height: mapPixelHeight,
    pixelArt: true,
    // width: 480,
    // height: 480,
    // width: window.innerHeight,
    // height: window.innerWidth,
	backgroundColor: '#242424',
	scene: MyScene,
	parent: 'game-container',
	physics: {
		default: 'arcade',
		arcade: {
            // gravity: {y: 500, x:0},
            debug: true,
            // checkCollision: {
            //     up: true,
            //     down: true,
            //     left: true,
            //     right: true,
            // },
        }
    },
    fps: {
		target: 60,
		forceSetTimeOut: false,
    },
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,			 // This is key! It will scale the game to fit within
                                                                    // the available space while maintaining its aspect ratio.
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, // Centers the game horizontally and vertically.
        // parent: 'game-container',	 // Optional: If you want the game canvas to be inside a specific HTML div.
                                                                // If omitted, Phaser will append it directly to the <body>.
        // The width/height here must match your logical game dimensions.
        // These are the "original" dimensions that Phaser will scale from.
        // width: window.innerHeight,
        // height: window.innerWidth,
        width: mapPixelWidth,
        height: mapPixelHeight
    },
};

new Phaser.Game(config);
