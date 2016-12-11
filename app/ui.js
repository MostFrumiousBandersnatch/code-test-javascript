import React from 'react';

const { FRAMES_PER_GAME } = require('../lib/gameplay.js');

const FRAME_NUMS = Array.from(new Array(FRAMES_PER_GAME), (v, n) => (n + 1));

const PinsLayout = ({ pins, unbroken_pins=null }) => React.createElement(
    'div',
    {className: 'pin-setup'},
    pins.map((stand, num) => {
        const affected = unbroken_pins ? !unbroken_pins[num] : false;

        return React.createElement(
        'div', {
            key: num,
            className: `pin ${stand ? (affected ? 'affected' : '') : 'broken'}`,
            'data-num': num + 1
        })
    })
);

PinsLayout.propTypes = {
    pins: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
    unbroken_pins: React.PropTypes.arrayOf(React.PropTypes.bool)
};


const Lane = ({ pins, unbroken_pins, ball }) => React.createElement(
    'div',
    {id: 'lane'},
    React.createElement(
        'div',
        {className: 'track'},
        React.createElement('div', { className: `ball ${ball}`}),
        React.createElement(PinsLayout, { pins, unbroken_pins })
    )
);

Lane.propTypes = {
    ...PinsLayout.propTypes,
    ball: React.PropTypes.string
}


const Display = ({ scores, curr_player, curr_frame, result }) => {
    const result_key = FRAME_NUMS + 1;

    return React.createElement(
        'table',
        { id: 'display' },
        React.createElement(
            'thead', null,
             React.createElement(
                'tr', null,
                [
                    React.createElement('th', {key: 0}),
                    ...FRAME_NUMS.map(
                        num => React.createElement(
                            'th',
                            {
                                key: num,
                                className: curr_frame === num ? 'curr' : ''
                            },
                            num
                        )
                    ),
                    React.createElement('th', {key: result_key}, 'result'),
                ]
            )
        ),
        React.createElement(
            'tbody', null,
            [

                ...Object.entries(scores).map(
                    ([name, frames], n) => (
                        React.createElement(
                            'tr', {
                                key: n,
                                className: curr_player === name ? 'cur': ''
                            },
                            ...[
                                React.createElement(
                                    'th', { key: 0 }, name
                                ),
                                ...frames.map(
                                    frame => React.createElement(
                                        'td', {
                                            key: frame.num,
                                            className: frame.extra
                                        },
                                        frame.rolls.join()
                                    )
                                )
                            ],
                            result ? React.createElement(
                                'td', {
                                    key: result_key,
                                    className: 'result'
                                },
                                result[name]
                            ) : null
                        )
                    )
                )
            ]
        )
    );
};

Display.propTypes = {
    scores: React.PropTypes.objectOf(
        React.PropTypes.arrayOf(
            React.PropTypes.shape({
                rolls: React.PropTypes.arrayOf(React.PropTypes.number),
                extra: React.PropTypes.string,
                num: React.PropTypes.number
            })
        )
    ).isRequired,
    curr_player: React.PropTypes.string,
    curr_frame: React.PropTypes.number,
    result: React.PropTypes.objectOf(
        React.PropTypes.number
    )
}


export { Lane, Display }
