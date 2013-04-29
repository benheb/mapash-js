define('app/controllers/layers', [ 'ember' ],
	/**
	 * Entries controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.ArrayProxy.extend({
			store: null,
			content: [],

			createNew: function( data ) {
				var layer = this.get( 'store' ).createFromTitle( value );
				this.pushObject( layer );
			},

			pushObject: function( item, ignoreStorage) {
				if ( !ignoreStorage )
					this.get( 'store' ).create( item );
				return this._super( item );
			},

			removeObject: function( item ) {
				this.get( 'store' ).remove( item );
				return this._super( item );
			},

			total: function() {
				return this.get( 'length' );
			}.property( '@each.length' ),

			init: function() {
				this._super();
				// Load layers if any upon initialization
				var layers = this.get( 'store' ).findAll();
				if ( layers.get( 'length' ) ) {
					this.set( '[]', layers );
				};
			}
		});
	}
);
