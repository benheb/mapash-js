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
      layers: [],
      store: null,
      projection: null,
      
      project: function( proj ){
        if (proj) this.projection = proj;
        return this.projection;
      },

      addLayer: function( obj ){
        var self = this;
        //d3.json( url, function( data ){
        if (!obj.id) obj.id = new Date().getTime();   
        this.layers.push( obj );
        Map.layersController.add( obj );
        //});
      }

    });
  }
);
