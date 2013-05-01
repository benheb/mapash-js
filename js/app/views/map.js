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
		return Ember.ContainerView.extend({
      mapBinding: 'controller.namespace.mapController',
			elementId: 'map',
			tagName: 'svg',
      classNames: [''],
      baseId: '#base',
      baseClass: 'base',
      childViews: [
        Ember.CollectionView.extend({
          contentBinding: 'Map.layersController.content',
          classNames: ['map-layers'],
          tagName: 'g',
          itemViewClass: Ember.View.extend({
            template: Ember.Handlebars.compile( "" ),
            tagName: 'g',
            classNames: ['layer'],
            //elementId: .get('content').id,
            didInsertElement: function(){
              console.log('map layer', this.content.id );
            }
          }) 
        }),
        Ember.View.extend({
          //template: Ember.Handlebars.compile( map_html )
        })
      ],
      
      updatePath: function( proj ) {
        var h  = document.height;
        var w  = document.width;
        
        this.projection = d3.geo[ proj.name ]()
            .scale( proj.scale )
            .translate([w / 2, h / 2])
            .rotate( proj.rotate )
            .center( proj.center )
            .precision( proj.precision );
        
        this.path = d3.geo.path()
            .projection( this.projection );
            
        this.λ = d3.scale.linear()
          .domain([0, w])
          .range([-180, 180]);
        
        this.φ = d3.scale.linear()
          .domain([0, h])
          .range([90, -90]);
      },

      updateBase: function( scale ){
        var self = this;
        //TODO fix race issue
        if (!this.style) return;
        
        this.base_layers.selectAll('.' + this.baseClass + '_path').remove();
        
        var world = this.get('map').base_data;
        
        console.log('world', world)
        //World boundaries
        if (this.features.world) {
          this.base_layers.insert("path")
            .datum(topojson.object(world, world.objects.ne_110m_land))
            .attr("id", "regions")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.world )
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.world );
        }
        
        //US States
        if (this.features.states) {
          this.base_layers.insert("path")
            .datum(topojson.object(world, world.objects.states))
            .attr("id", "states")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.states)
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.states );
        }
        
        /*
         * Detail
         * counties; higher res
         * 
         */
        if (this.features.counties) {
          this.base_layers.insert("path")
            .attr("id", "counties")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.counties)
            .attr('stroke-width', 0.2)
            .attr('stroke', this.style.stroke.counties );
        }
         
        //Lakes 
        if (this.features.lakes) { 
          this.base_layers.insert("path")
            .datum(topojson.object(world, world.objects.ne_50m_lakes))
            .attr("id", "lakes")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.water)
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.water );
        }
      },

      didInsertElement: function() {
        var view = self = this, 
          el = this.get('elementId'),
          down = false;
        
        //Bindings
        Map.mapController.on('style', function( style ) {
          view.style = style;
          self.updateBase();
        });
          
        Map.mapController.on('project', function( proj ) {
          self.updatePath( proj );
          self.updateBase();
        });
        
        Map.mapController.on('updateFeatures', function( features ){
          view.features = features;
          self.updateBase(); 
        });
        
        Map.mapController.on('update', function(){
          self.updateBase(); 
        });
       
        Map.mapController.on('changePan', function(pan){
          self.dynamicPan = pan;
        });

        Map.layersController.on('features', function( layer ){
          console.log('FEATURES', layer);
        });
        
        //d3 zoom binding
        view.base_layers = d3.select( "#" + el ).append("g")
          .call(d3.behavior.zoom()
            .scaleExtent([1 / 10, 10])
            .on("zoom", function() {
                view.zoom( view );
              })
            );
        
        //dynamic pann
        view.base_layers.on("mousedown", function() { down = true; });
        view.base_layers.on("mouseup", function() { down = false; });
        
        view.base_layers.on("mousemove", function() {
          if ( down === false || !view.dynamicPan ) return;
          
          var p = d3.mouse(this);
          view.projection.rotate( [ view.λ( p[0] ), view.φ( p[1] ) ] );
          view.base_layers.selectAll("path").attr( "d", view.path );
        });        
      },

      zoom: function( view ) {
        
        /* show hide counties */
        /* change projections */
        /* REMOVED FOR NOW
        if ( d3.event.scale <= 2.5 && self.get('map').projection.name !== "mollweide") {
          Map.mapController.setFeatures({counties: false});
          Map.mapController.project({name: "mollweide"});
          view.updateBase( d3.event.scale );
        
        } else if ( (d3.event.scale > 2.8 && d3.event.scale < 5.8 ) && self.get('map').projection.name !== "albers" ) {
          Map.mapController.setFeatures({counties: true});
          Map.mapController.project({name: 'albers'});
          view.updateBase( d3.event.scale );
        
        } else if ( d3.event.scale >= 5.8 && self.get('map').projection.name !== "mercator") {
          Map.mapController.setFeatures({counties: true});
          Map.mapController.project({name: 'mercator'});
          view.updateBase( d3.event.scale );
        } 
        */
       
        if ( !view.dynamicPan ) { 
          view.base_layers.selectAll("path")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        } else {
          view.base_layers.selectAll("path")
            .attr("transform", "scale(" + d3.event.scale + ")");
        }
        
      }

  

		})
	}
);
