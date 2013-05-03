require('app/views/search');

Composer.FinderView = Ember.ContainerView.extend({
  classNames: ['sidebar-panel'],
	elementId: 'find',
	childViews: [ 
	  Ember.View.extend({
	    templateName: 'finder'
	  }),
	  Composer.SearchView.create(),
	],
	didInsertElement: function(){
    //Test Data
    $('#' + this.elementId + ' #add').on('click', function(){
      Composer.layersController.add({
        title: 'Colorado Snow Totals', 
        url: '../data/snow.json'});
    });
    
    //search AGOL
    $('#' + this.elementId + ' #search-agol').on('keyup', function(){
      var val = $(this).val();
      Composer.arcgis.search( { q: val }, function( err, res ){
        if ( res ) {
          //console.log('SERACH RES!', res)
          $.each(res.results, function(i,f){
            console.log('RES', f)
            Composer.searchController.add({
              title: f.title, 
              count: 'count'
            });
          });
          
        }
        if ( err ) { console.log( 'error: ', err) };
      });
    });
    
    //Add Selected Search Item
    $('#' + this.elementId + ' .search-item-result').on('click', function(){
      console.log('Add: ', $(this).html());
    });
  }
});
