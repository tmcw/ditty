var React = require('react');
var _ = require('lodash');
var actions = require('../actions.js');
var Immutable = require('immutable');
var Router = require('react-router');
var { Navigation, State } = Router;
var SongStore = require('../stores/song_store.js');

var osc = T('pulse');
var env = T('perc', {a:50, r:250});
var synth = T('OscGen', {osc:osc, env:env, mul:0.15}).play();

var Song = React.createClass({
  mixins: [SongStore.listenTo, State, Navigation],
  getInitialState() {
    return {
      song: SongStore.all(),
      beat: 0
    };
  },
  componentDidMount() {
    this.interval = T('interval', {interval:100}, (count) => {
      var beat = count % 16;
      this.setState({ beat: beat });
      this.state.song.get(beat, Immutable.Map()).forEach((note, index) => {
        if (note) {
          var noteNum  = 69 + index;
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
    synth.noteOn(note + 60, 80);
  }, 100),
  noteOn(beat, note) {
    return this.state.song.getIn([beat, note]);
  },
  render: function() {
    return <div>
        <div className='fill-pink fix-width keyline-all round'>
          {_.range(0, 16).map((beat) => {
            return <div key={'beat-' + beat} className={'flex-beat ' + (beat === this.state.beat ? ' beat-on' : '')}>
            {_.range(0, 16).reverse().map((note) => {
                return <div
                    key={'beat-' + beat + '-note-' + note}
                    onMouseOver={this.previewNote.bind(this, beat, note)}
                    onClick={this.flipNote.bind(this, beat, note)}
                    className={'love-note ' + (this.noteOn(beat, note) ? ' note-on' : '')}>
                </div>
            })}
            </div>
          })}
        </div>
        <div className='center pad0y'>
            <a onClick={actions.undo}
                className={'icon undo ' + (!SongStore.hasUndo() ? 'quiet' : '')}></a>
            <a onClick={actions.redo}
                className={'icon redo ' + (!SongStore.hasRedo() ? 'quiet' : '')}></a>
        </div>
        <div className='center pad0y'>
            <a href='http://github.com/tmcw/ditty'
                className='icon github'></a>
        </div>
    </div>;
  }
});

module.exports = Song;
