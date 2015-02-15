Object.assign = require('object-assign');

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler } = Router;
var Song = require('./components/song.js');

var App = React.createClass({
  render: function () {
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route handler={App} path='/'>
    <DefaultRoute handler={Song} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.body);
});
