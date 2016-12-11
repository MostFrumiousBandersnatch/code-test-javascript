#!/bin/env node

const { AbstractLane, breakSomePins, AbstractDisplay  } = require('./lib/lane.js');
const { AbstractPlayer } = require('./lib/player.js');
const { bowlingManager } = require('./lib/gameplay.js');

class Lane extends AbstractLane {
    setPins (layout) {
        return Promise.resolve(layout);
    }

    countPins (initial_layout, ball_params) {
       return Promise.resolve(
           breakSomePins(initial_layout, ball_params.knockedPinsCount)
       );
    }
}

class Player extends AbstractPlayer {
    throwBall(layout) {
        return Promise.resolve({
            knockedPinsCount: Math.round(Math.random() * layout.count)
        });
    }
}

class Display extends AbstractDisplay {
    greetPlayers (players) {
        for (let player of players) {
            console.log(`Welcome ${player.name}! Let's play!\n`);
        }
        return Promise.resolve();
    }

    showRollReport (player, frame, roll, layout) {
        console.log(`#${frame}(${roll}): ${player.name} ==>> ${layout}`);

        return Promise.resolve();
    }

    showFrameReport (player, frame, score, extra, total_score) {
        console.log(`===========# ${frame}  ${player.name} earns ${score}=>(${total_score})========= ${extra ? extra : ''}\n`)

        return Promise.resolve();
    }

    showGameResult (result) {
        console.log('--=== GAME OVER ===--');
        for (const [player, score] of result) {
            console.log(`${player.name}: ${score}`)
        }

        return Promise.resolve();
    }
}


bowlingManager(
    new Lane(), new Display(),
    ...process.argv.slice(2).map(name => (new Player(name)))
);

