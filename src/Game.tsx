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
	backgroundColor: '#242424',
	scene: MyScene,
	parent: 'game-container',
	physics: {
		default: 'arcade',
		arcade: {
            debug: true,
        }
    },
    fps: {
		target: 60,
		forceSetTimeOut: false,
    },
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        // The width/height here must match your logical game dimensions.
        // These are the "original" dimensions that Phaser will scale from.
        width: mapPixelWidth,
        height: mapPixelHeight
    },
};

new Phaser.Game(config);
