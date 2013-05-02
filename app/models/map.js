//require('app/models/layer_store');

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
      land: "#444",
      water: "#FEFEFE",
    },
    stroke: {
      color: "#777"
    }
  },
  features: {
    land: true,
    states: true,
    lakes: true,
    counties: false,
  },
  dynamicPan: false,

  project: function( proj ){
    if ( proj ) this.projection = $.extend({}, this.projection, proj);
    return this.projection;
  },

  style: function( style ) {
    if (style) {
      if (style.fill) this.styles.fill = $.extend({}, this.styles.fill, style.fill);
      if (style.stroke) this.styles.stroke = $.extend({}, this.styles.stroke, style.stroke);
    }
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
    alert('init')
  } 

});

Composer.Map = Composer.MapModel.create();
