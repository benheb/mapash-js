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
            fill = {},
            stroke = {},
            mode = 'fill',
            visible = (Map.mapController.features[ val ]) ? "Hide" : "Show";
          
          $('#styler').remove();
          $('.features').css({'width': '123px', 'height': '20px'});
          $(this).closest(".features").animate({'width': '270px', 'height': '185px'}, 'slow');
          
          var edit = "\
              <div id='styler'>\
                <input type='text' id='flat' />\
                <div class='btn light small selected stroke-fill' id='styler-fill'>Fill</div>\
                <div class='btn light small stroke-fill' id='styler-stroke'>Stroke</div>\
                <div class='btn light small' id='styler-show-hide'>" + visible + "</div>\
                <div id='hide-show'></div>\
              </div>"
          $(this).closest(".features").append(edit);
          
          $('.strok-fill').on('click', function() {
            $('#styler .btn').removeClass('selected');
            $(this).addClass('selected');
            mode = $(this).html().toLowerCase();
          });
          
          $('#styler-show-hide').on('click', function() {
            var feature = { feature : null };
            feature[ val ] = ( Map.mapController.features[ val ] ) ? false : true;
            Map.mapController.setFeatures( feature );
            var html = ( $('#styler-show-hide').html() == 'Hide' ) ? 'Show' : 'Hide';
            $('#styler-show-hide').html( html );
          });
          
          $("#flat").spectrum({
              flat: true,
              showInput: true,
              move: function(color) {
                $(this).closest(".features").css('background', color.toHexString());
                if (mode == 'fill') {
                  fill[ val ] = color.toHexString();
                  Map.mapController.style({fill: fill});
                } else {
                  stroke[ val ] = color.toHexString();
                  Map.mapController.style({stroke: stroke});
                }
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
