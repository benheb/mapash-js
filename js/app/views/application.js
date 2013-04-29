define('app/views/application', [
		'app/views/sidebar',
		'app/views/layers',
		'app/views/map',
		'text!app/templates/header.html',
		'ember'
	],
	/**
	 * Main application view
	 *
	 * @param Class StatsView, stats view class
	 * @returns Class
	 */
	function( SidebarView, LayersView, MapView, header_html ) {
		return Ember.ContainerView.extend({
				elementId: 'app_container',
				childViews: [ 'headerView', 'mainView' ],
				headerView: Ember.ContainerView.create({
					childViews: [ 'titleView'],
					elementId: 'header',
					tagName: 'header',
					titleView: Ember.View.create({
            template: Ember.Handlebars.compile( header_html )
					})
				}),
				mainView: Ember.ContainerView.create({
          template: Ember.Handlebars.compile("<div class='row'>{{yield}}</div>"),
					elementId: 'map_main',
					classNames: [''],
				  childViews: [ SidebarView.create(), LayersView.create(), MapView.create() ]
				})
			})
	}
);
