var Dispatcher = require('../dispatcher.js'),
  Immutable = require('immutable'),
  SongConstants = require('../constants/song_constants.js'),
  makeStore = require('../make_store.js');

var _songs = Immutable.List([Immutable.Map()]),
    _idx = 0;

function newVersion(op) {
    var nextVersion = op(_songs.get(_idx));
   _idx++;
    _songs = _songs
      .slice(0, _idx)
      .push(nextVersion);
}

var SongStore = makeStore({
  all: () => _songs.get(_idx),
  hasUndo: () => _idx > 0,
  hasRedo: () => _idx < _songs.size - 1,
  dispatcherIndex: Dispatcher.register(payload => {
    var action = payload.action;
    switch (action.actionType) {
      case SongConstants.NOTE_FLIP:
        newVersion(song => song.updateIn(action.note, val => !val));
        break;
      case SongConstants.UNDO:
        _idx = Math.max(_idx - 1, 0);
        break;
      case SongConstants.REDO:
        _idx = Math.min(_idx + 1, _songs.size - 1);
        break;
      default:
        return true;
    }
    SongStore.emitChange(action.actionType);
    return true;
  })
});

SongStore.setMaxListeners(1000);
module.exports = SongStore;
