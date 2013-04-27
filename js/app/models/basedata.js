define('app/models/basedata', [
		'app/models/geojson',
		'ember'
	],
	/**
	 * Todo entries storage model
	 *
	 * @param Class Todo, the todo entry model
	 * @returns Class
	 */
	function( GeoJSON ) {
		return function( path ) {
      var self = this;
			this.path = path;
      
      //require(['text!' + path], function( data ){
			  //self.data = data;

			  this.findAll = function() {
				  return []; //self.data.features;
			  };

      //});
		};
	}
);
