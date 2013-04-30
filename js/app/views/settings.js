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
			template: Ember.Handlebars.compile( html ),
			didInsertElement: function() {
        $('.projections').on('click', function(){
          var projection = $(this).html().toLowerCase();
          Map.mapController.project({ name: projection });
        });
        $('.styles').on('click', function(){
          //TODO remove random
          var style = {
            fill: {
              land: '#'+Math.floor(Math.random()*16777215).toString(16),
              water: '#'+Math.floor(Math.random()*16777215).toString(16),
            }, 
            stroke: {
              color: '#'+Math.floor(Math.random()*16777215).toString(16)  
            }
          }
          Map.mapController.style( style );
        });
      },
    });
	}
);
