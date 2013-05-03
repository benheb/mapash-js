Composer.LayersView = Ember.CollectionView.extend({
  contentBinding: 'Composer.layersController.content',
  classNames: [''],
  elementId: 'layers',
  itemViewClass: Ember.View.extend({
    templateName: 'layer-item',
    didInsertElement: function(){
      var self = this;
      $('#layers').show();
      
      //console.log(self.content.id);
      $('.layer-item:eq('+self.contentIndex+') .close').on('click', function(){
        d3.selectAll('.lyr-' + self.content.id).remove();
        Composer.layersController.remove( self.content.id );
      });

      $('.layer-item .visible').on('change', function(){
        if ( !$(this).attr('checked') ) {
          d3.selectAll('.lyr-' + self.content.id).style('display', 'none');
        } else {
          d3.selectAll('.lyr-' + self.content.id).style('display', 'block');
        }
      });

      $('.layer-item .title').on('click', function(){
        //if ( !$('.layer-item .visible').attr('checked') ) {
        //$('.layer-item .visible').trigger('click');
      });
      

    }
  })
});
