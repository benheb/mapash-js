define('app/models/map', ['ember'],
  /**
   * base map model
   *
   * @returns Class
   */
  function() {
    return Ember.Object.extend({
      id: null,
      title: null,
      layers: {},
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
  }
);
