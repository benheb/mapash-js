define('app/models/layer', ['ember'],
	/**
	 * base layer model
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Object.extend({
			id: null,
			title: null,
      path: null,
			store: null
		});
	}
);
