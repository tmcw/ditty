# ditty

[![Greenkeeper badge](https://badges.greenkeeper.io/tmcw/ditty.svg)](https://greenkeeper.io/)

This is an online grid-based [music sequencer](http://en.wikipedia.org/wiki/Music_sequencer).

It's also an example of a [React.js](http://facebook.github.io/react/)
[facebook/flux](https://facebook.github.io/flux/) +
[immutable.js](https://github.com/facebook/immutable-js) +
[babelify](https://github.com/babel/babelify) project.
Audio is by [timbre.js](http://mohayonao.github.io/timbre/).
Keybindings are powered by the [react-keybinding](https://github.com/mapbox/react-keybinding)
project.

## Architecutre

Songs are immutable-js objects that are managed in [Songstore](src/stores/song_store.js).
Modifications to songs move through actions.

## Development

```sh
$ npm install
$ npm start
```
