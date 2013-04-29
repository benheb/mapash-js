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

			createNew: function( value ) {
				//if ( !value.trim() )
				//	return;
				//var todo = this.get( 'store' ).createFromTitle( value );
				//this.pushObject( todo );
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
				// Load items if any upon initialization
				var items = this.get( 'store' ).findAll();
				if ( items.get( 'length' ) ) {
					this.set( '[]', items );
				};
			}
		});
	}
);
