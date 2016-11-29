#!/bin/env node

const { AbstractLane, breakSomePins, AbstractDisplay  } = require('./lane.js');
const { AbstractPlayer } = require('./player.js');

const { bowlingManager } = require('./gameplay.js');

class DumbCLILane extends AbstractLane {
    setPins (layout) {
        return Promise.resolve(layout);
    }

    countPins (initial_layout, ball_params) {
       return Promise.resolve(
           breakSomePins(initial_layout, ball_params.knockedPinsCount)
       );
    }
}

class DumbCLIPlayer extends AbstractPlayer {
    throwBall(layout) {
        return Promise.resolve({
            knockedPinsCount: Math.round(Math.random() * layout.count)
        });
    }
}

class DumbCLIDisplay extends AbstractDisplay {
    greetPlayers (players) {
        for (let player of players) {
            console.log(`Welcome ${player.name}! Let's play!\n`);
        }

        //even though it's not necessary
        return Promise.resolve();
    }

    showRollReport (player, frame, roll, layout) {
        console.log(`#${frame}(${roll}): ${player.name} ==>> ${layout}`);

        return Promise.resolve();
    }

    showFrameReport (player, frame, score, extra) {
        console.log(`===========# ${frame}  ${player.name} earns ${score}#========== ${extra ? extra : ''}\n`)

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
    new DumbCLILane(), new DumbCLIDisplay(),
    ...process.argv.slice(2).map(name => (new DumbCLIPlayer(name)))
);

