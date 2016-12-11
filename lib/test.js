const assert = require('assert');
const {
    PINS_COUNT, PinsLayout, breakSomePins, AbstractLane, AbstractDisplay
} = require('./lane.js');
const { AbstractPlayer } = require('./player.js');

const {
    FRAMES_PER_GAME, ROLLS_PER_FRAME, STRIKE, SPARE, getExtraRolls, bowlingManager
} = require('./gameplay.js');


class TestPlayer extends AbstractPlayer {
    throwBall(layout) {
        return Promise.resolve({ knockedPinsCount: 0 });
    }
}

class MalfunctionLane extends AbstractLane {
    setPins (layout) {
        return Promise.resolve(layout);
    }

    countPins (initial_layout, ball_params) {
       return Promise.resolve(PinsLayout.fullSetup());
    }
}

class TrivialLane extends AbstractLane {
    setPins (layout) {
        return Promise.resolve(layout);
    }

    countPins (initial_layout, ball_params) {
        return Promise.resolve(
            breakSomePins(
               initial_layout,
               Math.round(Math.random() * initial_layout.count)
            )
       );
    }
}

class CountingDisplay extends AbstractDisplay {
    constructor () {
        super();
        this.frames_cnt = 0;
        this.rolls_cnt = 0;
    }

    greetPlayers () {
        return Promise.resolve();
    }

    showFrameReport () {
        this.frames_cnt += 1;
    }

    showRollReport () {
        this.rolls_cnt += 1;
    }


    showGameResult (result) {
        return Promise.resolve();
    }
}



describe('PinsLayout', function () {
    describe('construction', function () {
        it('should contains exatcly "ten" pins ', function () {
            assert.equal(PINS_COUNT, (new PinsLayout()).pins.length);
            assert.equal(PINS_COUNT, (new PinsLayout(0, 1)).pins.length);
            assert.equal(
                PINS_COUNT,
                (new PinsLayout(1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0)).pins.length
            );
        });

        it('should set pins as absent by default', function () {
            for (let n = 0; n <= PINS_COUNT; n += 1) {
                assert.ok(
                    (new PinsLayout(
                        ...(new Array(n)).fill(1))
                    ).pins.slice(n).every(
                        pin => !pin
                    )
                );
            }
        });

        it('should set pins according to the positional arguments', function () {
            assert.deepEqual((new PinsLayout(
                    1, 0, 0, 1, 1
                )).pins,
                [true, false, false, true, true, false, false, false, false, false]
            );
        });

        it(`should preset itself as a string containing\
 comma-separated zeros and ones`, function () {
            assert.equal(
                String(new PinsLayout(1, 0, 1)),
                '1,0,1,0,0,0,0,0,0,0'
            );

        });
    });

    describe('count attribute', function () {
        it('should be  equal to number of pins present in layout', function () {
            assert.equal((new PinsLayout()).count, 0);
            assert.equal((new PinsLayout(1, 0, 1, 1)).count, 3);
            assert.equal(
                (new PinsLayout(...(new Array(PINS_COUNT)).fill(1))).count,
                PINS_COUNT
            );
        });
    });

    describe('score attribute', function () {
        it('should augment the count to the layout capacity', function () {
            assert.equal((new PinsLayout()).score, PINS_COUNT);
            assert.equal((new PinsLayout(1, 0, 1, 1)).score, PINS_COUNT - 3);
            assert.equal(
                (new PinsLayout(...(new Array(PINS_COUNT)).fill(1))).score,
                0
            );
        });
    });


    describe('full combination', function () {
        it('should contains every possible pin', function () {
            assert.equal(PinsLayout.fullSetup().count, PINS_COUNT);
        });
    });

    describe('breaking', function () {
        it('may be transfomed to another (more sparse) layout', function () {
            const initial = new PinsLayout(0, 1, 1, 0, 1, 0, 1, 1, 0, 0);
            var count = 0;

            while (count <= initial.count) {
                const resulting = breakSomePins(initial, count);
                assert.equal(initial.count - count, resulting.count);
                count += 1;
            }
        });
    });
});


describe('lane', function () {
    it('should allow player only knock pins, not set them up', function () {
        return (new MalfunctionLane()).doRoll(
            new TestPlayer(), new PinsLayout()
        ).then(function() {
            assert(false);
        },function (e) {
            assert.equal(e.message, 'This lane is out of service');
            return true;
        });

    });
});

describe('bowling gameplay', function () {
    describe('getExtraRolls', function () {
        it('should give one roll for strike in the frames before last one',
            function () {
                for (let n = 1; n < FRAMES_PER_GAME; n += 1) {
                    assert.equal(1, getExtraRolls(STRIKE, n));
                }
            }
        );

        it('should give two rolls for strike in the last frame',
            function () {
                assert.equal(2, getExtraRolls(STRIKE, FRAMES_PER_GAME));
            }
        );

        it('should give no rolls for spare in the frames before last one',
            function () {
                for (let n = 1; n < FRAMES_PER_GAME; n += 1) {
                    assert.equal(0, getExtraRolls(SPARE, n));
                }
            }
        );

        it('should give one roll for spare in the last frame',
            function () {
                assert.equal(1, getExtraRolls(SPARE, FRAMES_PER_GAME));
            }
        );

        it('should give no rolls without substantial reason',
            function () {
                for (let n = 1; n <= FRAMES_PER_GAME; n += 1) {
                    assert.equal(0, getExtraRolls('give-me-a-roll', n));
                }
            }
        );
    });

    describe('The game', function () {
        const min_rolls_cnt = FRAMES_PER_GAME * ROLLS_PER_FRAME;

        it('must its time limits', function () {
            const display = new CountingDisplay();

            return bowlingManager(
                new TrivialLane(), display,
                new TestPlayer('the_only_player')
            ).then(function () {
                assert.equal(display.frames_cnt, FRAMES_PER_GAME);
                assert(display.rolls_cnt >= min_rolls_cnt);
            });

        });
   });
});
