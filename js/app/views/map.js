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
      mapBinding: 'controller.namespace.mapController',
			elementId: 'map',
      classNames: [''],
      baseId: '#base',
      baseClass: 'base',
			template: Ember.Handlebars.compile( map_html ),
      
      updatePath: function( proj ) {
        var h  = document.height;
        var w  = document.width;
        
        this.projection = d3.geo[ proj ]()
            .scale(500)
            .translate([w / 2, h / 2])
            .rotate([90])
            .center([-20, 39])
            .precision(.1);
        
        this.path = d3.geo.path()
            .projection( this.projection );
      },

      updateBase: function( scale ){
        var self = this;
        this.layers.selectAll('.' + this.baseClass + '_path').remove();
        
        var world = this.get('map').base_data;
        
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
        if ( scale > 2.8 ) {
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
          .attr('fill', '#FEFEFE');
      },

      didInsertElement: function() {
        var view = self = this;
        var proj = this.get('map').projection;
        this.updatePath( proj );
          
        Map.mapController.on('project', function() {
          var proj = self.get('map').projection;
          self.updatePath( proj );
          self.updateBase();
        });
        
        Map.mapController.on('update', function(){
          self.updateBase(); 
        });
        
        var el = this.get('elementId');
        view.path = view.get('path');
        
        view.layers = d3.select( "#" + el ).append("svg")
          .call(d3.behavior.zoom()
            .scaleExtent([1 / 10, 10])
            .on("zoom", function() {
                view.zoom( view );
              })
            );
        
      },

      zoom: function( view ) {
        
        /* show hide counties */
        /* change projections */
        if ( d3.event.scale <= 2.5 && self.get('map').projection !== "kavrayskiy7") {
          Map.mapController.project( "kavrayskiy7" );
          view.updateBase( d3.event.scale );
        } else if ( (d3.event.scale > 2.8 && d3.event.scale < 5.8 ) && self.get('map').projection !== "albers" ) {
          Map.mapController.project('albers')
          view.updateBase( d3.event.scale );
        } else if ( d3.event.scale >= 5.8 && self.get('map').projection !== "mercator") {
          Map.mapController.project('mercator')
          view.updateBase( d3.event.scale );
        } 
        
        view.layers.selectAll("path")
          .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      
      }

  

		})
	}
);
