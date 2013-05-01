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
			  var self = this;
			  
			  Map.mapController.on('style', function( style ) {
          self.updateStyle( style );
        });
			  
			  /*
         * Change Projections
         */
        $('.projections').on('click', function(){
          $('.projections').removeClass('selected')
          $(this).addClass('selected');
          var projection = $(this).html().toLowerCase();
          Map.mapController.project({ name: projection });
        });
        
        /*
         * Styles handler
         */
        $('.styles').on('click', function(){
          //TODO remove random
          var style = {
            fill: {
              world: '#'+Math.floor(Math.random()*16777215).toString(16),
              water: '#'+Math.floor(Math.random()*16777215).toString(16),
              states: '#'+Math.floor(Math.random()*16777215).toString(16),
              counties: '#'+Math.floor(Math.random()*16777215).toString(16)
            }, 
            stroke: {
              world: '#'+Math.floor(Math.random()*16777215).toString(16),
              water: '#'+Math.floor(Math.random()*16777215).toString(16),
              states: '#'+Math.floor(Math.random()*16777215).toString(16),
              counties: '#'+Math.floor(Math.random()*16777215).toString(16)  
            }
          }
          Map.mapController.style( style );
        });
        
        /*
         * Add / Remove Features
         */
        $('.features').on('click', function() {
          var feature = { feature : null }
          var val = $(this).html().toLowerCase();
          var is = ( Map.mapController.features[ val ] ) ? false : true;
          if (!is) {
            $(this).addClass('settings-disabled');
          } else {
            $(this).removeClass('settings-disabled')
          }
          feature[ val ] = is;
          Map.mapController.setFeatures( feature )
        });
        
        /*
         * Pan controls
         */
        $('#dynamic-panning').on('click', function() {
          var val = $(this).is(':checked');
          Map.mapController.setPan( val );
        })
      },
      
      updateStyle: function( style ) {
        for (fill in style.fill ) {
          $('.features.'+fill).css('background', style.fill[ fill ])
        }
        for (stroke in style.stroke ) {
          $('.features.'+stroke).css('border', '1px solid '+ style.stroke[ stroke ])
        }

      }
    });
	}
);
