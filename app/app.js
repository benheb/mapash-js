require('dependencies/jquery-1.8.3');
require('dependencies/arcgis');
require('dependencies/d3.v3.min');
require("dependencies/d3.geo.projection.v0.min");
require("dependencies/topojson.v0.min");
require('dependencies/handlebars');
require('dependencies/ember');
require('dependencies/compiled/templates');

/*
  Creates a new instance of an Ember application and
  specifies what HTML element inside index.html Ember
  should manage for you.
*/
window.Composer = Ember.Application.create({
  rootElement: '#composer',
  arcgis: ArcGIS()
});

// MODELS
require('app/models/map');
require('app/models/layer');

require('app/controllers/layers');
require('app/controllers/search');

// VIEWS
require('app/views/application');

// ROUTES
require('app/routes/router');
