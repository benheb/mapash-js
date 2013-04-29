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
      basedataBinding: 'controller.namespace.BaseData',
			elementId: 'map',
      classNames: [''],
      baseId: '#base',
			template: Ember.Handlebars.compile( map_html ),
      
      path: function() {
        var h  = document.height;
        var w  = document.width;
        this.proj = projection = d3.geo.kavrayskiy7()
          .scale(570)
          .rotate([90, 1])
          .center([-20,39 ])
          .translate([ w / 2, h / 2])
          .precision(.1);
    
        return d3.geo.path().projection( this.proj );
      }.property(),

      updateBase: function(){
        var self = this;
        this.layers.selectAll(this.baseId +" path").remove();
        
        var world = this.get('basedata').data;
        
        console.log('world', world)
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.land))
          .attr("id", "regions")
          .attr("d", this.get('path'))
          .attr('fill',   '#444' );
        
        /*
        this.layers.selectAll( this.baseId +" path")
            .data(this.get('basedata').features)
          .enter().append("path")
            .attr("id", "regions")
            .attr("d", this.get('path'))
            .attr('stroke', '#ccc'  )
            .attr('fill',   'white' );
        */
      },

      didInsertElement: function() {
        var view = self = this;

        Map.BaseData.on('update', function(){
          self.updateBase(); 
        })

        var el = this.get('elementId');
        view.path = view.get('path');
        
        view.layers = d3.select( "#" + el ).append("svg")
          .call(d3.behavior.zoom()
            .translate(view.proj.translate())
            .scale(view.proj.scale())
            .on("zoom", function( z ) {
                view.redraw(view);
              })
            );
           
        //mousewheel zoom
        view.$().on('mousewheel', function( event, delta, deltaX, deltaY ) {
          view.zoom( event, delta, deltaX, deltaY, view )
        });

      },


      zoom: function( event, delta, deltaX, deltaY, view) {
        var s = view.proj.scale();
        if ( delta > 0 ) {
          view.proj.scale( s * 1.1 );
        } else {
          view.proj.scale( s * 0.9 );
        }
        
        view.layers.selectAll("path").attr("d", view.get('path'))
      },
      
      redraw: function( view ) {
        if (d3.event) {
          view.proj
            .translate(d3.event.translate)
            .scale(d3.event.scale);
        }
        view.layers.selectAll("path").attr("d", view.get('path'));
      }

  

		})
	}
);
