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
			  
        Map.mapController.on('updateFeatures', function( features ) {
          self.updateFeatures( features );
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
         * Styler
         * 
         */
        $('.features .edit').on('click', function() {
          var target = $(this).closest(".features");
          
          if ( target.hasClass('selected') ) {
            target.animate({'width': '123px', 'height': '20px'}, 'slow');
            target.removeClass('selected');
            $('#styler').remove();
          } else {
            target.addClass('selected');
            target.animate({'width': '271px', 'height': '185px'}, 'slow');
            self.styler( target );
          }
          
          $.each($('.features'), function(i,f) {
            if ( f !== target[ 0 ] ) $(f).css({'width': '123px', 'height': '20px'}).removeClass('selected');
          })
        })
        
        /*
         * Pan controls
         */
        $('#dynamic-panning').on('click', function() {
          var val = $(this).is(':checked');
          Map.mapController.setPan( val );
        })
      },
      
      styler: function( target ) {
        
        var val = $( target ).attr( 'id' ),
          fill = {},
          stroke = {},
          mode = 'fill',
          visible = ( Map.mapController.features[ val ] ) ? "Hide" : "Show";
        
        $('#styler').remove();
        var edit = "\
            <div id='styler'>\
              <input type='text' id='flat' />\
              <div class='btn light small selected stroke-fill' id='styler-fill'>Fill</div>\
              <div class='btn light small stroke-fill' id='styler-stroke'>Stroke</div>\
              <div class='btn light small' id='styler-show-hide'>" + visible + "</div>\
              <div id='hide-show'></div>\
            </div>"
        $( target ).append(edit);
        
        $('.stroke-fill').on('click', function() {
          $('.stroke-fill').removeClass('selected');
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
              //$(this).closest(".features").css('background', color.toHexString());
              if (mode == 'fill') {
                fill[ val ] = color.toHexString();
                Map.mapController.style({fill: fill});
              } else {
                stroke[ val ] = color.toHexString();
                Map.mapController.style({stroke: stroke});
              }
            }
        });
      },
      
      updateFeatures: function( feature ) {
        $.each($('.features'), function(i,f) {
          var visible = feature[ $(f).attr('id') ];
          if ( !visible ) {
            $(f).addClass('settings-disabled');
          } else {
            $(f).removeClass('settings-disabled');
          } 
        });
      }
    });
	}
);
