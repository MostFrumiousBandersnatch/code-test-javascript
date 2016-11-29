/**
 * @absrtract
 */
class AbstractPlayer {
    constructor (name) {
        this.name = name;
    }

    /**
     * @abstract
     * @param layout {PinsLayout}
     * @returns {Promise} resolving to the object describing the ball thrown
     */
    throwBall (layout) {
        throw new Error('Not implemented');
    }
}


module.exports = {
    AbstractPlayer
};
