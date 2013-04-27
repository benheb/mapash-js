define('app/views/application', [
		'app/views/sidebar',
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
	function( SidebarView, MapView, header_html ) {
		return Ember.ContainerView.extend({
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
					classNames: ['container'],
          childViews: ['rowView'],
          rowView: Ember.ContainerView.create({ 
					  classNames: ['row'],
					  childViews: [ SidebarView.create(), MapView.create() ]
          })
				})
			})
	}
);
