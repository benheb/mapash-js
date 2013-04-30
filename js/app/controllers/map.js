define('app/controllers/map', [ 
    'app/models/map',
    'ember' 
  ],
	/**
	 * Todos controller
	 *
	 * @returns Class
	 */
	function( Map ) {
		return Ember.Controller.extend( Ember.Evented, {
      map: null,
      data_path: null,
      base_data: null,

      init: function(){
        this.map = Map.create({
          id: 'newmap',
          title: 'An ArcGIS Composer map'
        }); // TODO add abiltiy to pass in map id 
        this.load();
      },

      // loads in a new data set
      load: function(){
        var self = this;
        d3.json( this.data_path, function( data ){
          self.base_data = data;
          self.update();
        });
      },

      update: function(){
        this.trigger('update');
      }, 

      projection: function( proj ){
        //if ( proj ) set projection
        //else return current projection
        //trigger project event 
      }

		});
	}
);
