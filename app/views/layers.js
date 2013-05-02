Composer.LayersView = Ember.CollectionView.extend({
  //contentBinding: 'controller.namespace.layersController',
  layersBinding: 'Composer.layersController',
  contentBinding: 'Composer.layersController.content',
  classNames: [''],
  elementId: 'layers',
  //content: ['a','b'],
  layerChanged: (function(){
    alert('what the fuck');
  }).observes('layers.content'),
  itemViewClass: Ember.View.extend({
    //templateName: 'layer-item', //Ember.Handlebars.compile( layer_html ),
    template: Ember.Handlebars.compile("the letter: {{view.content}}"),
    didInsertElement: function(){
      var self = this;
      console.log(self.content, this);
      $('.layer-item:eq('+self.contentIndex+') .close').on('click', function(){
        Map.mapController.removeLayer( self.content.id );
        //console.log('post removal', self.get('content'))
        //self.remove();
      });
    }
  })
});
