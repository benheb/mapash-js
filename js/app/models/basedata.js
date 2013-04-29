define('app/models/basedata', [
		'ember'
	],
	/**
	 * Basedata storage model
	 *
	 * @param Class basedata, the base data feature model
	 * @returns Class
	 */
	function( ) {
    return Ember.Object.extend( Ember.Evented, {
      path: null,
      features: [],

      init: function( path ) {
        this.load();
      },

      // loads in a new data set
      load: function(){
        var self = this;
        d3.json( this.path, function( data ){
          /*self.features = [
            topojson.object(data, data.objects.land), 
            topojson.object(data, data.objects.states),
            topojson.object(data, data.objects.counties)];*/
          //console.log('data', data)
          self.data = data;
          self.update();
        });
      },

      update: function(){
        this.trigger('update');
      } 
		});
	}
);
