# devBuddies Code Test for JavaScript Ninjas

## Your motivation

Dear dev buddy, it's important to us to explain why we ask you to do this code test:

* You help us and yourself to assess your level of coding skills and find the right position for you
* We can pass it along in your introduction, which drastically increases your chances to be invited for an interview. The dev teams can review your code and get a first real impression
* Your own your code! You can use it to pimp you github profile and to send it along for any companies you approach yourself
* Last, we hope it will be fun!

## Task

Bowling Challenge

* Please clone this repository in GitHub (or similar) and invite us, so that we can follow your progress.
* The implementation should use "vanilla" JavaScript (no libraries or frameworks). But if you feel strongly to use react.js - go for it ;)
* Remember that we are more interested how you approach this problem than completing all the features (if you don't have enough time explain how you would progress).

Minimum (keep in mind the optional requirements):

 * Implement a scoring system for a bowling game according to these rules:
  - A game consists of 10 frames.
  - In general each frame has 2 rolls.
  - In general a player scores the number of pins knocked down.
  - If the player knocks down all 10 pins on the first roll it’s a strike. The player scores 10 plus the number of pins knocked down in the next two rolls.
  - If the player knocks down all 10 pins in two rolls it’s a spare. The player scores 10 plus the number of pins knocked down in the next roll.
* Simple visualisation of the game.

Optional:

* Add support for the last frame in the game:
 - The player gets additional rolls in the last frame: one additional for a spare after the second roll or two extra rolls for a strike.
* Create a method that randomly throws a roll (one roll is 1-10 pins knocked down), and progresses the scoring.
* Support multiple players.
* Or anything fun you can think of :)


Good luck & Fun

Your devbuddies team :)


## Solution
**NodeJS 7.0 or younger is required!!!**

There is an implementation of Bowling gameplay.
You can run the demo-game in console:

```
npm install
node --harmony-async-await run-in-console.js  Curt Roland Robert Ian

```

either open it in browser index.html:
```
npm install
webpack run build

```
Deployed instance: http://ivan-kondratyev.ru/demo/bowling/.


To run the tests:
```
npm test
```
as usual.
