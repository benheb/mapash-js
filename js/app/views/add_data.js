define('app/views/add_data', [
		'text!app/templates/add_data.html',
		'ember'
	],
	/**
	 * View to render the add data interface
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( html ) {
		return Ember.View.extend({
      classNames: ['sidebar-panel'],
			elementId: 'add',
			template: Ember.Handlebars.compile( html )
    });
	}
);
