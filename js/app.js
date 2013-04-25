App = Ember.Application.create({
  ready: function() {
    this.set('usStates', usStates);
  }
});

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  //nothing
});


App.Map = Ember.View.extend({
  path: function() {
    var h  = this.$().height();
    var w  = this.$().width();
    var mapXY = d3.geo.albersUsa().scale(1000).translate( [ w/2, h/2 ] );

    return d3.geo.path().projection(mapXY);
  }.property(),
  
  didInsertElement: function() {
    var elementId = this.get('elementId');
    var regions = d3.select("#" + elementId).append("svg").append("g").attr("id", "regions");
    var features = this.get('geoData').features;
    console.log('features', features)
    var path = this.get('path');

    regions.selectAll("#regions path").data(features).enter().insert("path")
      .attr("d",      path)
      .attr('stroke', '#ccc'  )
      .attr('fill',   'white' );
  }
});