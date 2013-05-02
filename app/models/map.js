require('app/models/layer_store');

Composer.MapModel = Ember.Object.extend( Ember.Evented, {
  store: null,
  mapChanged: function() {
    //store.update( this );
  }.observes( 'title', 'styles', 'projection', 'layers' ),

  all: function(){
    return this;
  },

  projection: {
    name: "mollweide",
    scale:  500,
    rotate: [90],
    center: [-20,39],
    precision: 0.1
  },
  styles: {
    fill: {
          states: "none",
          world: "#444",
          counties: "none",
          water: "#FEFEFE",
        }, 
        stroke: {
          states: "#777",
          world: "333",
          counties: "#777",
          water: "none",
        }
  },
  features: {
    world: true,
    states: true,
    water: true,
    counties: false,
  },
  dynamicPan: false,

  project: function( proj ){
    if ( proj ) this.projection = $.extend({}, this.projection, proj);
    this.trigger('project', this.projection);
    return this.projection;
  },

  style: function( style ) {
    if (style) {
      if (style.fill) this.styles.fill = $.extend({}, this.styles.fill, style.fill);
      if (style.stroke) this.styles.stroke = $.extend({}, this.styles.stroke, style.stroke);
    }
    
    this.trigger('style', this.styles);
    return this.styles;
  },

  setFeatures: function ( features ) {
    if ( features ) this.features = $.extend({}, this.features, features);
    return this.features;
  },

  setPan: function( pan ) {
    this.dynamicPan = ( pan ) ? true : false;
    return this.dynamicPan;
  },

  init: function(){
    this.load('../data/world.json');
  },

  load: function( path ){
    var self = this;
    d3.json( path, function( data ){
      self.base_data = data;
      self.update();
    });
  },

  update: function(){
        //this.trigger('update'); 
        //TODO REMOVE! style / projection events not firing, unless load complete
        //this.setFeatures();
        //this.style();
        //this.setPan();
        //this.project();
    console.log('trigger', this.base_data);
    this.trigger( 'updateFeatures', this.base_data );
    this.trigger( 'setFeatures', this.features );
  } 

});

Composer.Map = Composer.MapModel.create();
