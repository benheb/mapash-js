Composer.MapView = Ember.ContainerView.extend({
  mapBinding: 'Composer.map',
  elementId: 'map',
  tagName: 'svg',
  childViews: [
    Ember.CollectionView.extend({
      contentBinding: 'Composer.layersController.content',
      classNames: ['map-layers'],
      tagName: 'g',
      itemViewClass: Ember.View.extend({
        //template: Ember.Handlebars.compile( layer_html ),
        tagName: 'g',
        //classNames: ['layer'],
        //elementId: //content.id,
        didInsertElement: function(){
          //console.log('AFTER layer', this) 
          $($(this.get('element'))[0]).addClass('layer-'+this.content.id);
          //$($(this.get('element'))[0]).id(this.content.id+'-layer');
          //$(this.get('element')).addClass(this.content.id);
          //this.set('classNames', ['layer', this.content.id]);
        }
      })
    })
  ]
});
