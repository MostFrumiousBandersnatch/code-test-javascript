/**
 * Bowling gameplay manager
 */

const { PINS_COUNT, PinsLayout } = require('./lane.js');

const FRAMES_PER_GAME = 10;
const ROLLS_PER_FRAME = 2;

const STRIKE = 'strike';
const SPARE = 'spare';


/**
 * @param reason {String}
 * @param frame {Number} number of the frame in game
 * @return {Number} number of extra rolls to play in this frame
 */
const getExtraRolls = (reason, frame) => {
    switch (reason) {
        case STRIKE:
            return frame === FRAMES_PER_GAME ? 2 : 1;

        case SPARE:
            return frame === FRAMES_PER_GAME ? 1 : 0;

        default:
            return 0;
    }
};

/**
 * @param player {AbstractPlayer}
 * @param frame {Number} number of the frame in game
 * @return {Promise} resolving to {score, extra}
 */

async function playFrame(lane, display, player, frame) {
    var rolls_to_do = ROLLS_PER_FRAME;
    var rolls_done = 0;
    var layout = PinsLayout.fullSetup();
    var frame_score = 0;
    var extra = null;

    while (rolls_done < rolls_to_do) {
        if (layout.count === 0) {
            layout = PinsLayout.fullSetup();
        }

        let layout_after_roll = await lane.doRoll(player, layout);
        rolls_done += 1;

        await display.showRollReport(
            player,
            frame,
            rolls_done,
            layout_after_roll
        );

        frame_score += layout_after_roll.score - layout.score;

        if (layout_after_roll.score === PINS_COUNT) {
            switch (rolls_done) {
                case 1:
                    extra = STRIKE;
                    rolls_to_do += getExtraRolls(extra, frame);
                break;

                case ROLLS_PER_FRAME:
                    extra = SPARE;
                    rolls_to_do += getExtraRolls(extra, frame);
                break;
            }
        }

        layout = layout_after_roll;
    }

    return {
        score: frame_score,
        extra
    }
}

async function bowlingManager (lane, display, ...players) {
    lane.acquire();
    display.acquire();

    await display.greetPlayers(players);

    const result = new Map(players.map(
        p => [p, 0]
    ));

    for (let frame = 1; frame <= FRAMES_PER_GAME; frame += 1) {
        for (const player of players) {
            await display.startFrame(frame);

            const {score, extra} = await playFrame(lane, display, player, frame);

            result.set(player, result.get(player) + score);

            await display.showFrameReport(
                player, frame, score, extra, result.get(player)
            );
        }
    }

    await display.showGameResult(result.entries());

    lane.release();
    display.release();

};

module.exports = {
    FRAMES_PER_GAME,
    ROLLS_PER_FRAME,
    STRIKE,
    SPARE,
    getExtraRolls,
    bowlingManager
};
