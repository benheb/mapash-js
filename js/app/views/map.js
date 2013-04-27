define('app/views/map', [
		'text!app/templates/map.html',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( map_html ) {
		return Ember.View.extend({
			//layersBinding: 'controller.namespace.layerController',
			elementId: 'map',
      classNames: ['column-20 map'],
			tagName: 'main',
			template: Ember.Handlebars.compile( map_html ),

      path: function() {
        var h  = this.$().height();
        var w  = this.$().width();
        this.proj = d3.geo.albersUsa().scale(1000).translate( [ w/2, h/3 ] );
    
        return d3.geo.path().projection( this.proj );
      }.property(),

      didInsertElement: function() {
        var view = this;
        var el = this.get('elementId');
        setTimeout(function(){
          view.features = Map.BaseData.features;
          view.path = view.get('path');
          
          view.regions = d3.select( "#" + el ).append("svg")
            .call(d3.behavior.zoom()
              .translate(view.proj.translate())
              .scale(view.proj.scale())
              .on("zoom", function( z ) {
                  view.redraw(view);
                })
              );
             
          view.regions.selectAll("#regions path")
            .data(view.features)
          .enter().append("path")
            .attr("id", "regions")
            .attr("d", view.get('path'))
            .attr('stroke', '#ccc'  )
            .attr('fill',   'white' );
          
          //mousewheel zoom
          view.$().on('mousewheel', function( event, delta, deltaX, deltaY ) {
            view.zoom( event, delta, deltaX, deltaY, view )
          });
        }, 500);
    
      },

      zoom: function( event, delta, deltaX, deltaY, view) {
        var s = view.proj.scale();
        if ( delta > 0 ) {
          view.proj.scale( s * 1.1 );
        } else {
          view.proj.scale( s * 0.9 );
        }
        
        view.regions.selectAll("path").attr("d", view.get('path'))
      },
      
      redraw: function( view ) {
        if (d3.event) {
          view.proj
            .translate(d3.event.translate)
            .scale(d3.event.scale);
        }
        view.regions.selectAll("path").attr("d", view.get('path'));
      }

  

		})
	}
);
