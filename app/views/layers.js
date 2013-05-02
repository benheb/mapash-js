Composer.LayersView = Ember.CollectionView.extend({
  contentBinding: 'Composer.layersController.content',
  classNames: [''],
  elementId: 'layers',
  itemViewClass: Ember.View.extend({
    templateName: 'layer-item',
    didInsertElement: function(){
      var self = this;
      $('.layer-item:eq('+self.contentIndex+') .close').on('click', function(){
        Composer.layersController.remove( self.content.id );
      });
    }
  })
});
