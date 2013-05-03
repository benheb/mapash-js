Composer.SettingsView = Ember.View.extend({
  classNames: ['sidebar-panel'],
  elementId: 'settings',
  templateName: 'settings',
  didInsertElement: function() {
    var self = this;
    /*
     * Change Projections
     */
    $('.projections').on('click', function(){
      $('.projections').removeClass('selected')
      $(this).addClass('selected');
      var projection = $(this).html().toLowerCase();
      var p = Composer.Map.projection;
      p.name = projection;
      Composer.Map.project(p);
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
      Composer.Map.style( style );
    });
    
    
    /*
     * Open Styler
     * 
     */
    $('.settings-button .edit').on('click', function( e ) {
      var target = $(this).closest(".settings-button").children('.features');
      $('#styler').remove();
      self.styler( target, e );
    });
    
    /*
     * Toggle Layers
     * 
     */
    $('.features').on('click', function() {
      var feature = {};
      var val = $(this).attr('id');
      var is = ( Composer.Map.features[ val ] ) ? false : true;
      feature[ val ] = is;
      //console.log('Composer.Map.features', feature, $(this).attr('id'));
      Composer.Map.setFeatures( feature )
    });
    
    /*
     * Pan controls
     */
    $('#dynamic-panning').on('click', function() {
      var val = $(this).is(':checked');
      Composer.Map.setPan( val );
    })
  },
  
  styler: function( target, e ) {
        
    var val = $( target ).attr( 'id' ),
      fill = {},
      stroke = {},
      mode = 'fill';
    
    var edit = "\
        <div id='styler'>\
          <input type='text' id='flat' />\
          <div id='styler-close'>&times;</div>\
          <div class='btn light small selected stroke-fill' id='styler-fill'>Fill</div>\
          <div class='btn light small stroke-fill' id='styler-stroke'>Stroke</div>\
          <div id='hide-show'></div>\
        </div>"
    $( '#app_container' ).append(edit);
    
    var offset = $(target).offset();
    $( '#styler' ).css({ 'left': offset.left+144+'px', 'top': offset.top-7+'px' })
    
    $('.stroke-fill').on('click', function() {
      $('.stroke-fill').removeClass('selected');
      $(this).addClass('selected');
      mode = $(this).html().toLowerCase();
    });
    
    $('#styler-close').on('click', function() {
      $('#styler').remove();
    })
    
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
