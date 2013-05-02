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
          self.updateUI( style );
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
         * Randomizer!
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
        $('.toggle-features').on('click', function() {
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
         * Styler
         * 
         */
        $('.features .edit').on('click', function() {
          var val = $(this).closest(".features").attr('id'),
            fill = {}
          
          $('#styler').remove();
          $('.features').css({'width': '123px', 'height': '20px'});
          $(this).closest(".features").animate({'width': '270px', 'height': '185px'}, 'slow');
          
          var edit = "\
              <div id='styler'>\
                <input type='text' id='flat' />\
                <div id='hide-show'></div>\
              </div>"
          
          $(this).closest(".features").append(edit);
          $("#flat").spectrum({
              flat: true,
              showInput: true,
              move: function(color) {
                $(this).closest(".features").css('background', color.toHexString());
                fill[ val ] = color.toHexString();
                Map.mapController.style({fill: fill})
              }
          });
        });
        
        /*
         * Pan controls
         */
        $('#dynamic-panning').on('click', function() {
          var val = $(this).is(':checked');
          Map.mapController.setPan( val );
        })
      },
      
      updateUI: function( style ) {
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
