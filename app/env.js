const { AbstractLane, breakSomePins, AbstractDisplay } = require('../lib/lane.js');
const { AbstractPlayer } = require('../lib/player.js');
const { FRAMES_PER_GAME } = require('../lib/gameplay.js');


const delay = ms => (new Promise(resolve => {
    window.setTimeout(resolve.bind(null, ms), ms);
}));


class Lane extends AbstractLane {
    setPins (layout) {
        this.update(() => ({pins: layout.pins, unbroken_pins: null}));

        return Promise.resolve(layout);
    }

    countPins (initial_layout, ball_params) {
        const { pins } = initial_layout;
        const new_layout = breakSomePins(initial_layout, ball_params.knockedPinsCount);
        const { pins: unbroken_pins } = new_layout;

        this.update(() => ({ pins, unbroken_pins }));
        return Promise.resolve(new_layout);
    }
}


class Player extends AbstractPlayer {
    throwBall(layout) {
        this.update(() => ({
            curr_player: this.name,
            ball: 'still' 
        }));

        return new Promise(resolve => {
            window.addEventListener('keypress', () => {
                this.update(() => ({
                    ball: 'rolling'
                }));

                delay(3000).then(() => {
                    resolve({
                        knockedPinsCount: Math.round(Math.random() * layout.count)
                    }); 
                });
            }, {
                once: true
            })
        });
    }
}


class Display extends AbstractDisplay {
    startFrame (frame_num) {
        this.update(() => ({
            curr_frame: frame_num
        }));

        return Promise.resolve();
    }

    greetPlayers (players) {
        this.update(() => ({
                scores: Object.assign(
                    {}, ...(players.map(player => ({
                        [player.name]: Array.from(new Array(FRAMES_PER_GAME), (v, n) => (
                            {rolls: [], num: n + 1, extra: ''}
                        ))
                    })))
                )
            })
        );
        return Promise.resolve();
    }

    showRollReport (player, frame_num, roll_num, layout) {
        const frame_index = frame_num - 1;
        const score_key = player.name;

        this.update(({ scores }) => {
            const frames = scores[score_key];
            const rolls = frames[frame_index].rolls;
            const new_rolls = [...rolls, layout.score];

            return {
                scores : {
                    ...scores,
                    [score_key]: frames.map(
                        (val, i) => (i === frame_index) ? { ...val, rolls: new_rolls } : val
                    )
                }
            };
        });

        return delay(1000);
    }

    showFrameReport (player, frame_num, score, extra, total_score) {
        frame_num -= 1;

        const score_key = player.name;

        this.update(({ scores, result }) => {
            var frames = scores[score_key];

            return {
                scores : {
                    ...scores,
                    [score_key]: frames.map(
                        (val, num) => num === frame_num ? {...val, score, extra} : val
                    )
                },
                result: {
                    ...result,
                    [score_key]: total_score
                }
            };
        });

        return Promise.resolve();
    }

    showGameResult (result) {
        var res = {};

        for (const [player, score] of result) {
            res[player.name] = score;

        }

        this.update(() => ({ 
            result: res,
            curr_player: null,
            curr_frame: null
        }));
        return Promise.resolve();
    }
}


export { Lane, Player, Display }