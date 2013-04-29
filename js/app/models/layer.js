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
      data: null,
			store: null
		});
	}
);
