Composer.SettingsView = Ember.View.extend({
  classNames: ['sidebar-panel'],
  elementId: 'settings',
  templateName: 'settings',
  didInsertElement: function() {
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
          land: '#'+Math.floor(Math.random()*16777215).toString(16),
          water: '#'+Math.floor(Math.random()*16777215).toString(16),
        }, 
        stroke: {
          color: '#'+Math.floor(Math.random()*16777215).toString(16)  
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
});
