import React from 'react'
import { render } from 'react-dom'

import * as env from './env.js'
import * as ui from './ui.js'

const { bowlingManager } = require('../lib/gameplay.js');


class Intro extends React.Component {
    componentWillMount () {
        this.setState({
            name: '',
            names: []
        });
    }

    addPlayer () {
        const { names, name } = this.state;
                           
        this.setState({
            names: [...names, name],
            name: ''
        });
    }

    handleChange (e) {
        const val = e.target.value;

        this.setState({
            name: val
        });
    }

    render () {
        const { names, name } = this.state;
        const { cb } = this.props;

        return React.createElement(
            'div',
            { className: 'intro' },
            React.createElement(
                'input',
                { 
                    type: 'text',
                    placeholder: 'Player\'s name',
                    ref: 'input',
                    value: name,
                    onChange: this.handleChange.bind(this)
                }
            ),
            React.createElement(
                'button',
                {
                    ref: 'btn',
                    onClick: this.addPlayer.bind(this),
                    ...(name.length === 0 ? { disabled: true } : {})
                },
                '+'
            ),
            React.createElement(
                'span',
                { className: 'players' },
                names.join(', ')
            ),
            names.length > 1 ? React.createElement(
                'button',
                {
                    onClick: () => { cb(...names); }
                },
                'Let\'s play!!!'
            ) : null,
        );
    }
}

class BowlingApp {
    constructor (mountpoint) {
        this.mountpoint = mountpoint;
        this._state = {
            players: [],
            started: false,
            pins: [],
            ball: 'hidden',
            curr_frame: 1,
            scores: {}
        };
    }



    handleChange (e) {
        console.log(e)
    }

    update (modificator) {
        this._state = Object.assign(
            this._state, modificator(this._state)
        );

        this.render();
    }

    render () {
        const {
            started, players, pins, unbroken_pins, curr_frame,
            scores, curr_player, ball, result
        } = this._state;

        render(
            started ? React.createElement(
                'div',
                null,
                curr_player ? React.createElement(
                    'h3',
                    null,
                    `${curr_player}${ball === 'still' ? ', press any key': ''}`
                ) : null,
                React.createElement(ui.Lane, { pins, unbroken_pins, ball }),
                React.createElement(ui.Display, { scores, curr_frame, curr_player, result })
            ) : React.createElement(
                    Intro,
                    {
                        cb: (...names) => {
                            names.sort();

                            this.update(() => ({started: true}));
                            this.run(...names);
                        }
                    }
                ),
            document.getElementById(this.mountpoint),
        );
    }

    initiate (obj) {
        const cb = this.update.bind(this);

        obj.update = cb;

        return obj;
    }

    run (...players) {
        const facilities = [new env.Lane(), new env.Display(), ...players.map(name => new env.Player(name))];

        bowlingManager(...facilities.map(this.initiate.bind(this)));
    }
}


new BowlingApp('mountpoint').render();