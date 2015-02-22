var React = require('react');
var DocumentTitle = require('react-document-title');
var _ = require('lodash');
var actions = require('../actions.js');
var Immutable = require('immutable');
var Router = require('react-router');
var Help = require('./help.js');
var Keybinding = require('react-keybinding');
var { Navigation, State } = Router;
var SongStore = require('../stores/song_store.js');

var osc = T('pulse');
var env = T('perc', {a:50, r:250});
var synth = T('OscGen', {osc:osc, env:env, mul:0.15}).play();

const START_NOTE = 69;

const CURSOR_LEFT = 'Move cursor left';
const CURSOR_RIGHT = 'Move cursor right';
const CURSOR_UP = 'Move cursor up';
const CURSOR_DOWN = 'Move cursor down';
const FLIP_NOTE = 'Flip note under cursor';
const SHOW_HELP = 'Show help';

var Song = React.createClass({
  mixins: [SongStore.listenTo, State, Navigation, Keybinding],
  keybindings: {
    'arrow-left': CURSOR_LEFT,
    'arrow-right': CURSOR_RIGHT,
    'arrow-up': CURSOR_UP,
    'arrow-down': CURSOR_DOWN,
    'enter': FLIP_NOTE,
    '?': SHOW_HELP
  },
  inBounds(pos, dimension) {
      return Math.max(0, Math.min(pos, this.state.resolution[dimension]));
  },
  moveCursor(dir) {
      this.setState({
          cursor: [
              this.state.cursor[0] + dir[0],
              this.state.cursor[1] + dir[1]
          ].map(this.inBounds)
      }, () => {
          var noteNum  = START_NOTE + this.state.cursor[1];
          var velocity = 20;
          synth.noteOn(noteNum, velocity);
      });
  },
  keybinding(e, action) {
    switch (action) {
        case CURSOR_LEFT: this.moveCursor([-1, 0]); break;
        case CURSOR_RIGHT: this.moveCursor([1, 0]); break;
        case CURSOR_UP: this.moveCursor([0, 1]); break;
        case CURSOR_DOWN: this.moveCursor([0, -1]); break;
        case FLIP_NOTE: this.flipNote(...this.state.cursor); break;
        case SHOW_HELP: this.toggleHelp(); break;
    }
    e.preventDefault();
  },
  toggleHelp() {
      this.setState({help:!this.state.help});
  },
  getInitialState() {
    return {
      song: SongStore.all(),
      beat: 0,
      help: true,
      cursor: [7, 7],
      resolution: [16, 16]
    };
  },
  componentDidMount() {
    this.interval = T('interval', {interval:100}, (count) => {
      var beat = count % this.state.resolution[0];
      this.setState({ beat: beat });
      this.state.song.get(beat, Immutable.Map()).forEach((note, index) => {
        if (note) {
          var noteNum  = START_NOTE + index;
          var velocity = 64;
          synth.noteOn(noteNum, velocity);
        }
      });
    }).start();
    document.addEventListener('keydown', (e) => {
      if (e.which === 90 && e.metaKey && e.shiftKey) {
        actions.redo();
        e.preventDefault();
      } else if (e.which === 90 && e.metaKey) {
        actions.undo();
        e.preventDefault();
      }
    });
  },
  _onChange() {
    this.setState({
      song: SongStore.all()
    });
  },
  flipNote(beat, note) {
    actions.flipNote([beat, note]);
  },
  undo() {
    actions.undo();
  },
  previewNote: _.debounce((beat, note) => {
    synth.noteOn(note + START_NOTE, 80);
  }, 100),
  noteOn(beat, note) {
    return this.state.song.getIn([beat, note]);
  },
  isCursor(beat, note) {
    return this.state.cursor[0] === beat && this.state.cursor[1] === note;
  },
  resolutionY() {
    this.setState({
      resolution: [this.state.resolution[0], this.state.resolution[1] === 16 ? 32 : 16]
    });
  },
  resolutionX() {
    this.setState({
      resolution: [this.state.resolution[0] === 16 ? 32 : 16, this.state.resolution[1]]
    });
  },
  render: function() {
    return <DocumentTitle title='♥♫❤♬'>
      <div>
        <div className='fill-pink fix-width keyline-all round'>
          {_.range(0, this.state.resolution[0]).map((beat) => {
            return <div
                key={'beat-' + beat}
                className={'flex-beat ' +
                    `resolution-${this.state.resolution[0]}` +
                    (beat === this.state.beat ? ' beat-on' : '')}>
            {_.range(0, this.state.resolution[1]).reverse().map((note) => {
                return <div
                    key={`beat-${beat}-note-${note}`}
                    onMouseOver={this.previewNote.bind(this, beat, note)}
                    onClick={this.flipNote.bind(this, beat, note)}
                    className={'love-note ' +
                        `resolution-${this.state.resolution[1]}` +
                        (this.isCursor(beat, note) ? ' cursor-on' : '') +
                        (this.noteOn(beat, note) ? ' note-on' : '')}>
                </div>
            })}
            </div>
          })}
        </div>
        {this.state.help ? <Help /> : ''}
        <div className='center pad0y'>
            <a onClick={this.toggleHelp}
                className={'icon help ' + (!this.state.help ? 'quiet' : '')}></a>
            <a onClick={actions.undo}
                className={'icon undo ' + (!SongStore.hasUndo() ? 'quiet' : '')}></a>
            <a onClick={actions.redo}
                className={'icon redo ' + (!SongStore.hasRedo() ? 'quiet' : '')}></a>
            <a onClick={this.resolutionX}
                className={'icon l-r-arrow'}></a>
            <a onClick={this.resolutionY}
                className={'icon u-d-arrow'}></a>
            <a onClick={actions.reset}
                className={'icon trash'}></a>
        </div>
        <div className='center pad0y'>
            <a href='http://github.com/tmcw/ditty'
                className='icon github'></a>
        </div>
      </div>
    </DocumentTitle>;
  }
});

module.exports = Song;
