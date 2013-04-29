define('app/views/layers', [
		'text!app/templates/layers.html',
		'ember'
	],
	/**
	 * View to render layer lists
	 *
	 * @param String html, base html
	 * @returns Class
	 */
	function( html ) {
		return Ember.CollectionView.extend({
      contentBinding: 'controller.Layers',
      classNames: [''],
			elementId: 'layers',
			template: Ember.Handlebars.compile( html ),
      /*itemViewClass: Ember.View.extend({
        //template: Ember.Handlebars.compile("the letter: {{view.content}}")
        template: Ember.Handlebars.compile( html )
      })*/
		})
	}
);
