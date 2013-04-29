define('app/views/sidebar', [
		'text!app/templates/sidebar.html',
		'app/views/finder',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( sidebar_html, Finder ) {
		return Ember.ContainerView.extend({
      childViews: [ Finder.create(), Ember.View.extend({
        classNames: [''],
			  elementId: 'sidebar',
			  tagName: 'div',
			  template: Ember.Handlebars.compile( sidebar_html )
      })]
    });
	}
);
