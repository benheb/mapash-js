Composer.FinderView = Ember.View.extend({
  classNames: ['sidebar-panel'],
	elementId: 'find',
	templateName: 'finder', //Ember.Handlebars.compile( html ),
  didInsertElement: function(){
    //Test Data
    $('#' + this.elementId + ' #add').on('click', function(){
      Composer.layersController.add({title: 'Colorado Snow Totals', url: '../data/snow.json'});
    });
    
    //search AGOL
    $('#' + this.elementId + ' #search-agol').on('keyup', function(){
      var val = $(this).val();
      
      Composer.arcgis.search( { q: val }, function( err, res ){
        if ( res ) {
          $('#search-items').empty();
          $.each(res.results, function(i,f){
            var item = '<li class="search-item-result">'+ f.title +'</li>';
            $('#search-items').append(item)
          });
          
        }
        if ( err ) { $('#search-items').empty(); console.log( 'error: ', err) };
      });
    });
    
    //Add Selected Search Item
    $('#' + this.elementId + ' .search-item-result').on('click', function(){
      console.log('Add: ', $(this).html());
    });
  }
});
