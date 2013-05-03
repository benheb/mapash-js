Composer.LayerStore = Ember.Object.extend(Ember.Evented, {
			store: localStorage.getItem( this.name ),
			data: ( this.store && JSON.parse( this.store ) ) || {},

			// Save the current state of the **Store** to *localStorage*.
			save: function() {
				//localStorage.setItem( this.name, JSON.stringify( this.data ) );
			},

			createFromData: function( data ) {
				var layer = Composer.Layer.create({
					id: data.id,
					style: data.style,
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
          model.properties = self.props( data.features );
          model.geom_type = data.features[0].geometry.type;
          model.features = data.features;
          self.update( model );
          self.trigger('features', model);
        });
      },   

      // builds a list of property types 
      props: function( features ){
        var types = {};
        features.forEach(function(f){
          for (var p in f.properties) {
            var val = f.properties[p];
            if (!types[p]) {
              types[p] = { type: typeof(f.properties[p])};
            
              if (typeof(f.properties[p]) == 'number') { 
                types[p].min = val;
                types[p].max = val;
              }
            }

            if ( typeof( f.properties[p] ) == 'number' ){ 
              types[p].min = ( val < types[p].min ) ? val : types[p].min;
              types[p].max = ( val > types[p].max ) ? val : types[p].max;
            }

          } 
        });
        return types;
      }, 

			// Update a model by replacing its copy in `this.data`.
			update: function( model ) {
				this.data[ model.get( 'id' ) ] = model.getProperties(
					'id', 'features', 'geom_type'
				);
				this.save();
				return model;
			},

			// Retrieve a model from `this.data` by id.
			find: function( id ) {
				var layer = Composer.Layer.create( this.data[ id ] );
				layer.set( 'store', this );
				return layer;
			},

			// Return the array of all models currently in storage.
			findAll: function() {
				var result = [],
						key;

				for ( key in this.data ) {
					var layer = Composer.Layer.create( this.data[ key ] );
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
