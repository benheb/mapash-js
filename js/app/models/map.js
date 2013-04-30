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
        name: "kavrayskiy7"
      },
      
      project: function( proj ){
        if (proj) this.projection = proj;
        return this.projection;
      }

    });
  }
);
