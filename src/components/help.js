var React = require('react');
var Keybinding = require('react-keybinding');

var Help = React.createClass({
  mixins: [Keybinding],
  render: function() {
    return <div className='fill-darken same-width pad2y'>
      <div className='pad2'>
      {this.getAllKeybindings()
          .filter(binding => binding)
          .reduce((list, binding) =>
      list.concat(Object.keys(binding).map(k => [k, binding[k]])), [])
      .map(binding =>
           <div key={binding[1]} className='pad0y'>
             <div className='col6 code text-right keyline-right pad2x'>
               {binding[0]}
             </div>
             <div className='col6 pad2x'>
               {binding[1]}
             </div>
          </div>
      )}
      </div>
    </div>;
  }
});

module.exports = Help;
