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
      baseClass: 'base',
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
        this.layers.selectAll('.' + this.baseClass + '_path').remove();
        
        var world = this.get('basedata').data;
        
        console.log('world', world)
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.ne_110m_land))
          .attr("id", "regions")
          .attr('class', this.baseClass + '_path')
          .attr("d", this.get('path'))
          .attr('fill', '#444' );
        
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.states))
          .attr("id", "states")
          .attr('class', this.baseClass + '_path')
          .attr("d", this.get('path'))
          .attr('fill', '#444')
          .attr('stroke-width', 0.5)
          .attr('stroke', '#777' );
        
        /*
         * Detail
         * counties; higher res
         * 
         */
        if ( scale > 3 ) {
          this.layers.insert("path")
            .datum(topojson.object(world, world.objects.counties))
            .attr("id", "counties")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', '#444')
            .attr('stroke-width', 0.2)
            .attr('stroke', '#777' );
          this._is_detail = true;
        } else {
          this._is_detail = false;
        };
          
        this.layers.insert("path")
          .datum(topojson.object(world, world.objects.ne_50m_lakes))
          .attr("id", "lakes")
          .attr('class', this.baseClass + '_path')
          .attr("d", this.get('path'))
          .attr('fill', '#99b3cc');
      },

      didInsertElement: function() {
        var view = self = this;

        Map.BaseData.on('update', function(){
          self.updateBase(); 
        });

        var el = this.get('elementId');
        view.path = view.get('path');
        
        view.layers = d3.select( "#" + el ).append("svg")
          .call(d3.behavior.zoom()
            .scaleExtent([1 / 5, 5])
            .on("zoom", function() {
                view.zoom( view );
              })
            );
        
      },

      zoom: function( view ) {
        
        /* show hide counties */
        if ( d3.event.scale > 3 && view._is_detail === false ) {
          view.updateBase( d3.event.scale );
        } else if ( d3.event.scale < 3 && view._is_detail === true ) {
          view.updateBase( d3.event.scale );
        }
        
        view.layers.selectAll("path")
          .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      
      }

  

		})
	}
);
