define('app/router', [ 'ember' ],
	/**
	 * Map Router
	 *
	 * Defined routes represent filters according to specs
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Router.extend({

			root: Ember.Route.extend({

				/*specs: Ember.Route.extend({
					route: '/specs',
					connectOutlets: function() {
						require( [ 'app/specs/helper' ] );
					}
				})*/
			})
		});
	}
);
