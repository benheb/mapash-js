define('app/views/settings', [
		'text!app/templates/settings.html',
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
			elementId: 'settings',
			template: Ember.Handlebars.compile( html )
    });
	}
);
