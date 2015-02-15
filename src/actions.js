var SongConstants = require('./constants/song_constants.js'),
    Dispatcher = require('./dispatcher.js');

var actions = {
  redo() {
    Dispatcher.handleViewAction({
      actionType: SongConstants.REDO
    });
  },
  undo() {
    Dispatcher.handleViewAction({
      actionType: SongConstants.UNDO
    });
  },
  flipNote(note) {
    Dispatcher.handleViewAction({
      actionType: SongConstants.NOTE_FLIP,
      note: note
    });
  }
};

module.exports = actions;
