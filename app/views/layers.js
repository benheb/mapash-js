Composer.LayersView = Ember.CollectionView.extend({
  contentBinding: 'Composer.layersController.content',
  classNames: [''],
  elementId: 'layers',
  itemViewClass: Ember.View.extend({
    templateName: 'layer-item',
    didInsertElement: function(){
      var self = this;
      $('#layers').show();
      $('.layer-item:eq('+self.contentIndex+') .close').on('click', function(){
        d3.selectAll('.lyr-' + self.content.id).remove();
        Composer.layersController.remove( self.content.id );
      });
    }
  })
});
