Composer.LayersView = Ember.CollectionView.extend({
  contentBinding: 'Composer.layersController.content',
  classNames: [''],
  elementId: 'layers',
  //templateName: 'layers'
  itemViewClass: Ember.View.extend({
    templateName: 'layer-item',
    didInsertElement: function(){
      var self = this;
      $('#layers').show();
      
      console.log('LAYER ID', self.content.id, self.content.title);
      $('.layer-item:eq(' + self.contentIndex + ') .close').on('click', function(){
        d3.selectAll('.lyr-' + self.content.id ).remove();
        Composer.layersController.remove( self.content.id );
      });

      $('.layer-item:eq(' + self.contentIndex + ') .visible').on('change', function(){
        if ( !$( this ).attr( 'checked' ) ) {
          d3.selectAll( '.lyr-' + self.content.id ).style( 'display', 'none' );
        } else {
          d3.selectAll( '.lyr-' + self.content.id ).style( 'display', 'block' );
        }
      });

      $('.layer-item:eq(' + self.contentIndex + ') .title').on('click', function(){
        console.log(self.content.id);
        //if ( !$('.layer-item .visible').attr('checked') ) {
        //$('.layer-item .visible').trigger('click');
      });
      

    }
  })
});
