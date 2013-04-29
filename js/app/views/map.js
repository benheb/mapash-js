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

      updateBase: function( scale ){
        var self = this;
        this.layers.selectAll(this.baseId +" path").remove();
        
        var world = this.get('basedata').data;
        
        console.log('world', world)
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.ne_110m_land))
          .attr("id", "regions")
          .attr("d", this.get('path'))
          .attr('fill', '#444' );
        
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.states))
          .attr("id", "regions")
          .attr("d", this.get('path'))
          .attr('fill', '#444')
          .attr('stroke', '#777' );
        
        /*
         * Detail
         * counties; higher res
         * 
         */
        if ( scale > 1500 ) {
          /*
          this.layers.insert("path")
            .datum(topojson.object(world, world.objects.counties))
            .attr("id", "regions")
            .attr("d", this.get('path'))
            .attr('fill', '#444')
            .attr('stroke', '#777' );
          */
          this._is_detail = true;
        } else {
          this._is_detail = false;
        };
        
        /*
         * lakes
         * 
         */
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.ne_50m_lakes))
          .attr("id", "regions")
          .attr("d", this.get('path'))
          .attr('fill', '#99b3cc');
          
      },

      didInsertElement: function() {
        var view = self = this;

        Map.BaseData.on('update', function(){
          self.updateBase( view.proj.scale() ); 
        });

        var el = this.get('elementId');
        view.path = view.get('path');
        
        view.layers = d3.select( "#" + el ).append("svg")
          .call(d3.behavior.zoom()
            .translate(view.proj.translate())
            .scale(view.proj.scale())
            .on("zoom", function( z ) {
                view.zoom( view );
              })
            );
        
      },

      zoom: function( view ) {
        view.proj.translate(d3.event.translate)
        view.proj.scale(d3.event.scale);
        
        if ( d3.event.scale > 1500 && this._is_detail === false ) {
          view.updateBase( view.proj.scale() );
        } else if ( d3.event.scale < 1500 && this._is_detail === true ) {
          view.updateBase( view.proj.scale() );
        }
          
        view.layers.selectAll("path").attr("d", view.get('path'));
      }

  

		})
	}
);
