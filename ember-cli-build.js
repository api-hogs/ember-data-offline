/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });
  app.import(app.bowerDirectory + "/bootstrap/dist/css/bootstrap.min.css");
  app.import( app.bowerDirectory + '/object.observe/dist/object-observe.min.js', { type: 'test' } );

  return app.toTree();
};
