define('app/views/finder', [
		'text!app/templates/finder.html',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( html ) {
		return Ember.View.extend({
      classNames: ['sidebar-panel'],
			elementId: '#finder',
			tagName: 'div',
			template: Ember.Handlebars.compile( html )
    });
	}
);
