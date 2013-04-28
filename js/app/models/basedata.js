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
        var self = this;
        d3.json( this.path, function( data ){
          self.features = data.features;
          console.log('triggering update', self.features );
          self.trigger('update');
        });
      }
		});
	}
);
