const PINS_COUNT = 10;

const _empty = (new Array(PINS_COUNT).fill(false));
const _full = (new Array(PINS_COUNT).fill(true));


class PinsLayout {
    constructor (...pins) {
        this.pins = pins.map(Boolean).concat(_empty).slice(0, PINS_COUNT);

        this.count = this.pins.reduce(
            (sum, pin) => pin ? (sum + 1) : sum,
            0
        );
        this.score = PINS_COUNT - this.count;

        Object.freeze(this.pins);
        Object.freeze(this);
    }

    toString () {
        return this.pins.map(pin => pin ? '1' : '0').join();
    }

    valueOf () {
        return this.pins.reduceRight(
            (a, v) => a*2 + v,
           0
        );
    }

    static fullSetup () {
        return new PinsLayout(..._full);
    }
}

/**
 * @param number_to_break {Number}
 */
const breakSomePins = (layout, number_to_break) => {
    return new PinsLayout(...layout.pins.map(
        pin => {
            if (pin && number_to_break > 0) {
                number_to_break -= 1;
                return false;
            } else {
                return pin;
            }
        }
    ));
}

class Resource {
    acquire () {
        if (this.acquired) {
            throw new Error('${this} is busy');
        }
    }

    release () {
        this.acquired = false;
    }
}

class AbstractLane extends Resource {
    /*
     * @abstract
     * @param layout {PinsLayout}
     * @returns {Promise}
     */
    setPins (layout) {
        throw new Error('Not implemented');
    }

    /**
     * @abstract
     * @param initial_layout {PinsLayout}
     * @param ball_params {Object}
     * @returns {Promise} resolving to resulting {PinsLayout}
     */
    countPins (initial_layout, ball_params) {
        throw new Error('Not implemented');
    }

    /**
     * @final
     * @param initial_layout {PinsLayout}
     * @param player {Player}
     * @returns {Promise} resolving to resulting {PinsLayout}
     */
    doRoll (player, initial_layout) {
        return this.setPins(
            initial_layout
        ).then(
            player.throwBall
        ).then(
            this.countPins.bind(this, initial_layout)
        ).then(resulting_layout => {
            //sanity check
            if (initial_layout | resulting_layout === initial_layout) {
                return resulting_layout;
            } else {
                throw new Error('This lane is out of service');
            }
        });
    }
}

class AbstractDisplay extends Resource {
    /**
     * @param players {[AbstractPlayer..]}
     */
    greetPlayers (players) {
        throw new Error('not implemented');
    }

    /**
     * @param frame_report {Object}
     * @returns {Promise}
     */
    showRollReport (player, frame, roll, layout) {
        return Promise.resolve();
    }

    /**
     * @abstract
     * @param frame_report {Object}
     * @returns {Promise}
     */
    showFrameReport (player, frame, score, extra) {
        throw new Error('not implemented');
    }

    /**
     * @abstract
     * @param result {Object}
     * @returns {Promise}
     */
    showGameResult (result) {
        throw new Error('not implemented');
    }

}


module.exports = {
    PINS_COUNT,
    PinsLayout,
    breakSomePins,
    AbstractLane,
    AbstractDisplay
};

