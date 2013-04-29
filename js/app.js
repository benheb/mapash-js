// Define libraries
require.config({
  baseUrl: 'js/',
  paths: {
    d3: 'libs/d3', 
    d3geo: 'libs/d3.geo',
    jquery: 'libs/jquery-1.9.1',
    ember: 'libs/ember-latest.min',
    //ember: 'libs/ember-1.0.0-rc.3',
    //handlebars: 'libs/handlebars-1.0.0-rc.3',
    text: 'libs/text',
    jasmine: 'lib/jasmine/jasmine',
    jasmine_html: 'lib/jasmine/jasmine-html'
  }
});

// Load our app
define( 'app', [
  'app/router',
  'app/models/layer_store',
  'app/controllers/layers',
  'app/models/basedata',
  'app/views/application',
  'jquery',
  //'handlebars',
  'ember'
  ], function( Router, LayerStore, LayersController, BaseData, ApplicationView ) {
    var App = Ember.Application.create({
      VERSION: '0.1.0',
      rootElement: '#map_app',
      Router: Router,
      // Extend to inherit outlet support
      ApplicationController: Ember.Controller.extend(),
      ApplicationView: ApplicationView,
      //BaseData: BaseData.create({path : 'data/us-states.json'}),
      BaseData: BaseData.create({path : 'data/world.json'}),     
      //BaseData: BaseData.create({path : 'data/us.json'}),
      layersController: LayersController.create({
        store: new LayerStore('layers')
      }),
      ready: function() {
        this.initialize();
      }
    });

    // Expose the application globally
    return window.Map = App;
  }
);
