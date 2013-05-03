Composer.searchController = Ember.ArrayController.extend( Ember.Evented, {
      store: null,
      length: 0,
      content: [],

      add: function( obj ) {
        this.pushObject( obj );
      },

      remove: function( id ){
        console.log('REMOVE', id)
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
      }
});

Composer.searchController = Composer.searchController.create();
