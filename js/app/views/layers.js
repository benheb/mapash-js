define('app/views/layers', [
		'text!app/templates/layers.html',
		'ember'
	],
	/**
	 * View to render layer lists
	 *
	 * @param String html, base html
	 * @returns Class
	 */
	function( html ) {
		return Ember.View.extend({
      classNames: [''],
			elementId: 'layers',
			template: Ember.Handlebars.compile( html )
		})
	}
);
