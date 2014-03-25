# Audio in Motion

An experiment mixing Web Audio with Leap Motion

- https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
- https://developer.leapmotion.com/leapjs/welcome

## Leap Controls

Check the 'Play' box to begin.  Uncheck to stop audio and Leap polling.

Right hand (a hand first seen on the right of the leap detection area) looks for the first pointable, and uses that to control a cursor, which may be run over the target squares to play samples and notes.

Left hand:
- fist: mute
- two fingers: height is master volume
- open: height is echo volume, left and right change echo delay

## Audio setup

See doc/audiograph.dot

## Sounds

Sound samples are not included in the repository.  I obtained some from:

http://www.freesound.org/people/TicTacShutUp/packs/17/
