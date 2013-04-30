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
        //TODO REMOVE! style / projection events not firing, unless load complete
        this.style();
        this.project();
      }, 
      
      //Projections Object
      project: function( proj ){
        this.projection = this.map.project( proj );
        this.trigger( 'project', this.projection );
      },
      
      //Style Object
      style: function( style ) {
        console.log('style', style)
        this.styles = this.map.style( style );
        console.log('SRYLES', this.styles)
        this.trigger( 'style', this.styles );
      }
      
		});
	}
);
