define('app/controllers/layers', [ 'ember' ],
	/**
	 * Entries controller
	 *
	 * @returns Class
	 */
	function() {
		return Ember.ArrayController.extend( Ember.Evented, {
			store: null,
      length: 0,
			content: [],

			add: function( obj ) {
				var layer = this.get( 'store' ).createFromData( obj );
        this.pushObject( layer );
			},

      remove: function( id ){
        var layer = this.get( 'store' ).find( id );
        this.removeObject( layer );
      },

      pushObject: function( item ) {
        this.get( 'store' ).create( item );
        return this._super( item );
      },

			removeObject: function( item ) {
				this.get( 'store' ).remove( item );
        this.set( 'content', this.get( 'store' ).findAll());
        return this._super( item );
			},

			total: function() {
				return this.get( 'length' );
			}.property( '@each.length' ),

			init: function() {
        var self = this;
				this._super();
				// Load layers if any upon initialization
				var layers = this.get( 'store' ).findAll();
				if ( layers.get( 'length' ) ) {
					this.set( 'content', layers );
				};
			}
		});
	}
);
