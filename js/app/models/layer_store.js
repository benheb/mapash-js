define('app/models/layer_store', [
		'app/models/layer',
		'ember'
	],
	/**
	 * 
	 *
	 * @param Class Layer, the layer entry model
	 * @returns Class
	 */
	function( Layer ) {
		// Our Store is represented by a single JS object in *localStorage*.
		// Create it with a meaningful name, like the name you'd give a table.
		return Ember.Object.extend(Ember.Evented, {
			store: localStorage.getItem( this.name ),
			data: ( this.store && JSON.parse( this.store ) ) || {},

			// Save the current state of the **Store** to *localStorage*.
			save: function() {
				//localStorage.setItem( this.name, JSON.stringify( this.data ) );
			},

			createFromData: function( data ) {
				var layer = Layer.create({
					id: data.id,
          title: data.title,
          url: data.url,
					store: this
				});
				return layer;
			},

			// Store the model inside the `Store`
			create: function ( model ) {
				if ( !model.get( 'id' ) )
					model.set( 'id', Date.now() );
        this.load( model );
				return this.update( model );
			},

      load: function( model ){
        var self = this;
        d3.json( model.url, function( data ){
          model.features = data.features;
          self.update( model );
          self.trigger('features', model);
        });
      },   

			// Update a model by replacing its copy in `this.data`.
			update: function( model ) {
				this.data[ model.get( 'id' ) ] = model.getProperties(
					'id', 'features'
				);
        //console.log(this.data[ model.get( 'id' ) ], model);
				this.save();
				return model;
			},

			// Retrieve a model from `this.data` by id.
			find: function( id ) {
				var layer = Layer.create( this.data[ id ] );
				layer.set( 'store', this );
				return layer;
			},

			// Return the array of all models currently in storage.
			findAll: function() {
				var result = [],
						key;

				for ( key in this.data ) {
					var layer = Layer.create( this.data[ key ] );
					layer.set( 'store', this );
					result.push( layer );
				}

				return result;
			},

			// Delete a model from `this.data`, returning it.
			remove: function( model ) {
				delete this.data[ model.get( 'id' ) ];
				this.save();
				return model;
			}
	});
  }
);
