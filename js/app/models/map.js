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
      layers: null,
      store: null,
      projection: {
        name: "mollweide"
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
      
      project: function( proj ){
        if (proj) this.projection = proj;
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
      }
      
    });
  }
);
