App = Ember.Application.create({
  ready: function() {
    this.baseLayer.get();
  }
});

App.Router.map(function() {
  // put your routes here
});


App.SidebarRoute = Ember.Route.extend({
  //nothing
});

App.baseLayer = Ember.Object.create({
  content: null,
  get: function() {
    var self = this;
    this.set('content', usStates);
    /*
     sdflkajdsfal;skdjfa@!%!#^@$%#$$^@&
    $.getJSON('data/us-states.json', function(data) {
      console.log('data')
      self.set('content', data);
      self.set('usStates', usStates);
    });
    */
  }
});

App.Map = Ember.View.extend({
  classNames: ['map'],
  path: function() {
    var h  = this.$().height();
    var w  = this.$().width();
    this.proj = d3.geo.albersUsa().scale(1000).translate( [ w/2, h/2 ] );
    
    return d3.geo.path().projection( this.proj );
  }.property(),
  
  didInsertElement: function() {
    var view = this;
    var el = this.get('elementId');
    view.features = App.baseLayer.content.features;
    view.path = this.get('path');
    
    view.regions = d3.select( "#" + el ).append("svg")
      .call(d3.behavior.zoom()
        .translate(view.proj.translate())
        .scale(view.proj.scale())
        .on("zoom", function( z ) {
            view.redraw(view);
          })
        );
       
    view.regions.selectAll("#regions path")
      .data(view.features)
    .enter().append("path")
      .attr("id", "regions")
      .attr("d", view.path)
      .attr('stroke', '#ccc'  )
      .attr('fill',   'white' );
    
    /*
     * 
     * Custom Events
     * 
     */
    //mousewheel zoom
    this.$().on('mousewheel', function( event, delta, deltaX, deltaY ) {
      view.zoom( event, delta, deltaX, deltaY, view )
    });
    
  },
  
  zoom: function( event, delta, deltaX, deltaY, view) {
    var s = view.proj.scale();
    if ( delta > 0 ) {
      view.proj.scale( s * 1.1 );
    } else {
      view.proj.scale( s * 0.9 );
    }
    
    view.regions.selectAll("path").attr("d", view.path)
  },
  
  redraw: function( view ) {
    if (d3.event) {
      view.proj
        .translate(d3.event.translate)
        .scale(d3.event.scale);
    }
    view.regions.selectAll("path").attr("d", view.path);
  }
});

App.Sidebar = Ember.View.extend({
  didInsertElement: function() {
    var elementId = this.get('elementId');
    console.log('sidebar', elementId)
  }
});

