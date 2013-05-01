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
			elementId: 'find',
			template: Ember.Handlebars.compile( html ),
      didInsertElement: function(){
        $('#' + this.elementId + ' #add').on('click', function(){
          Map.mapController.addLayer({title: 'Colorado Snow Totals', url: 'data/snow.json'});
        });
      }
    });
	}
);
