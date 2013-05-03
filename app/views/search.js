Composer.SearchView = Ember.CollectionView.extend({
  contentBinding: 'Composer.searchController.content',
  classNames: [''],
  elementId: 'search-items', //should go INSIDE finder view
  itemViewClass: Ember.View.extend({
    templateName: 'search-item',
    didInsertElement: function(){
      console.log('Search View Initialized')
      //$('.search-item').draggable();
    }
  })
});