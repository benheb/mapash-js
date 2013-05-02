define('app/views/map', [
		'text!app/templates/map.html',
		'text!app/templates/layer.html',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( map_html, layer_html ) {
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
            .datum(topojson.object(world, world.objects.counties))
            .attr("id", "counties")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.counties )
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.counties );
        }
         
        //Lakes 
        if (this.features.water) { 
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

        Map.layersController.get('store').on('features', function( layer ){
          view.renderLayer(layer);
        });
        
        //d3 zoom binding
        view.base_layers = d3.select( "#" + el )
          .call(d3.behavior.zoom()
            .scaleExtent([1 / 10, 10])
            .on("zoom", function() {
                view.zoom( view );
              })
            )
          .call(d3.behavior.drag()
            .on("drag", function() {
                if (view.dynamicPan) view.drag( view );
              })
            );
               
      },
      
      
      drag: function( view ) {
        var start = { 
          lon: view.projection.rotate()[0], 
          lat: view.projection.rotate()[1]
        },
        
        delta = { x: d3.event.dx, y: d3.event.dy },
        scaling = 0.15,
        end = { 
          lon: start.lon + delta.x * scaling, 
          lat: start.lat - delta.y * scaling 
        };
        
        // clamp latitudinal rotation to 30 degrees N or S
        end.lat = end.lat >  30 ?  30 :
                  end.lat < -30 ? -30 :
                  end.lat;
        
        // change the projection settings to new rotation
        view.projection.rotate( [ end.lon, end.lat ] )
        view.base_layers.selectAll("path").attr( "d", view.path );
      },

      zoom: function( view ) {
        
        /* show hide counties */
        /* change projections */
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
       
        if ( !view.dynamicPan ) { 
          view.base_layers.selectAll("path")
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        } else {
          view.base_layers.selectAll("path")
            .attr("transform", "scale(" + d3.event.scale + ")");
        }

      },

      renderLayer: function( layer ){
        var self = this;
        console.log( 'FEATURES', layer.features );
        //console.log( d3.select('.layer-' + layer.id).selectAll('path'))
        var el = d3.select('.layer-' + layer.id);
      
        el.call(d3.behavior.zoom()
            .scaleExtent([1 / 10, 10])
            .on("zoom", function() {
                self.zoom( self );
              })
            )

        el.selectAll("path")
        //this.base_layers.selectAll('path')
            .data(layer.features)
            .enter().append('path')
              //.attr("id", "")
              //.attr('class', this.baseClass + '_path')
              .attr("d", this.get('path'))
              .attr('fill', '#3F3');
      }

  

		})
	}
);
