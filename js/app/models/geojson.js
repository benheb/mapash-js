define('app/models/geojson', ['ember'],
	/**
	 * base geojson model
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Object.extend({
			id: null,
			features: [],
			// set store reference upon creation instead of creating static bindings
			store: null
		});
	}
);
