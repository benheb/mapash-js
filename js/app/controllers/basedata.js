define('app/controllers/basedata', [ 'ember' ],
	/**
	 * Entries controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.ArrayProxy.extend({
			store: null,
      path: null,
      features: [],
			content: [],

			init: function( path ) {
        var self = this;
				this._super();
        d3.json(this.path, function( data ){
          self.features = data.features;
          console.log('Data', self.features);
        });
				// Load items if any upon initialization
				/*var features = this.get( 'store' ).findAll();
				if ( features.get( 'length' ) ) {
					this.set( '[]', features );
				};*/
			}
		});
	}
);
