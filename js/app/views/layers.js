define('app/views/layers', [
		'text!app/templates/layers.html',
		'text!app/templates/layer.html',
		'ember'
	],
	/**
	 * View to render layer lists
	 *
	 * @param String html, base html
	 * @returns Class
	 */
	function( html, layer_html ) {
		return Ember.CollectionView.extend({
      contentBinding: 'Map.layersController.content',
      classNames: [''],
			elementId: 'layers',
      //click: function(){
        //console.log(this.get('content'));
      //},
      itemViewClass: Ember.View.extend({
        template: Ember.Handlebars.compile( layer_html ),
        didInsertElement: function(){
          var self = this;
          $('.close').on('click', function(){
            console.log(self.content, this);
            Map.mapController.removeLayer( self.content.id );
          });  
        }
      })
		})
	}
);
