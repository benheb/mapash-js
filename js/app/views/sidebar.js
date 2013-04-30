define('app/views/sidebar', [
		'app/views/finder',
		'app/views/add_data',
		'app/views/settings',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( Finder, AddData, Settings ) {
		return Ember.ContainerView.extend({
      childViews: [ Finder.create(), AddData.create(), Settings.create(), Ember.CollectionView.extend({
        classNames: [''],
			  elementId: 'sidebar',
			  tagName: 'div',
        content: ['Add', 'Find', 'Settings'],
        didInsertElement: function() {
          $('.sidebar-panel .close').on('click', function(){
            $('.sidebar-panel').hide();
          });
        },
        itemViewClass: Ember.View.extend({
          classNames: ['sidebar-item'],
			    template: Ember.Handlebars.compile("{{view.content}}"),
          click: function(){
            $('.sidebar-item').removeClass('selected');
            $('.sidebar-item:eq('+this.contentIndex+')').addClass('selected');
            $('.sidebar-panel').hide();
            $('.sidebar-panel#' + this.get('content').toLowerCase() ).show();
          } 
        })
      })]
    });
	}
);
