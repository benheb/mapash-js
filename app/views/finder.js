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
    // adjust height of each sidebar-panel
    //$('.sidebar-panel').height(document.height - 75);

    //Test Data
    $('#' + this.elementId + ' #add').on('click', function(){
      var fill = '#'+Math.floor(Math.random()*16777215).toString(16);
      Composer.layersController.add({
        title: 'Colorado Snow Totals',
        style: {
          css: 'fill:'+fill+'; opacity:.4;',
          field: 'total precip'
        }, 
        url: '../data/snow.json'});
    });
    
    //search AGOL
    $('#' + this.elementId + ' #search-agol').on('keyup', function(){
      var val = $(this).val();
      Composer.arcgis.search( { q: val }, function( err, res ){
        if ( res ) {
          $.each(res.results, function(i,f){
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
