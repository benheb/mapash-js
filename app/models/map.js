//require('app/models/layer_store');

Composer.Map = Ember.Object.extend({
  store: null,
  mapChanged: function() {
    //store.update( this );
  }.observes( 'title', 'styles', 'projection', 'layers' ),
  all: function(){
    return this;
  }
});


/* 
  Constructor/Class/Static/Whatever properties of Map.
*/
Composer.Map.reopenClass({
  store: null,
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

  addLayer: function( obj ){
    if (!obj.id) obj.id = new Date().getTime();
    this.layers[ obj.id ] = obj ;
    Map.layersController.add( obj );
  },

  removeLayer: function( id ){
    delete this.layers[ id ];
    Map.layersController.remove( id );
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
  }

});
