Composer.MapView = Ember.ContainerView.extend({
  mapBinding: 'Composer.Map',
  projBinding: 'Composer.Map.projection',
  stylesBinding: 'Composer.Map.styles',
  featuresBinding: 'Composer.Map.features',
  panBinding: 'Composer.Map.dynamicPan',
  elementId: 'map',
  baseId: '#base',
  baseClass: 'base',
  // Observe the projection 
  projChange: (function(){
    this.updatePath( this.get('proj') );
    this.updateBase();
  }).observes('proj'),

  // Observe styles 
  stylesChange: (function(){
    this.updateBase();
  }).observes('styles'),

  // Observe features 
  featuresChange: (function(){
    //alert('features, changes');
    this.updateBase();
  }).observes('features'),

  panChange: (function(){
     this.updatePan();
  }).observes('pan'),

  childViews: [
    Ember.CollectionView.extend({
      //contentBinding: 'Composer.layersController.content',
      classNames: ['map-layers'],
      tagName: 'svg',
      itemViewClass: Ember.View.extend({
        tagName: 'g',
        didInsertElement: function(){
          $($(this.get('element'))[0]).addClass('layer-'+this.content.id);
        }
      })
    })
  ],

  didInsertElement: function() {
    var self = this;
    
    //d3 zoom binding
    this.layer_viz = d3.select( ".map-layers" )
      .call(d3.behavior.zoom()
        .scaleExtent([1 / 10, 10])
        .on("zoom", function() {
            self.zoom();
          })
        )
      .call(d3.behavior.drag()
        .on("drag", function() {
            if (self.dynamicPan) self.drag();
          })
        );

    //this.base_layer = this.layer_viz.append('g');

    this.updatePath();

    Composer.Map.on('setFeatures', function( features ){
      //self.features = features;
      self.updateBase(); 
    });
    
    /*Composer.Map.on('changePan', function(pan){
      self.dynamicPan = pan;
    });*/

    // a new layer is added to the map and this fires once we've loaded features 
    Composer.layersController.get('store').on('features', function( layer ){
      self.renderLayer(layer);
    });

  },

  updatePan: function( pan ){
    this.set('dynamicPan', pan);
  },

  updateBase: function( scale ){
    var self = this;
    
    if (!this.style) this.style = Composer.Map.style();
    
    this.layer_viz.selectAll('.'+this.baseClass+ '_path').remove();
    
    //var world = this.get('map').base_data;
    var world = Composer.Map.base_data;

    //console.log('world', world)

    //World boundaries
    if (this.features.world) {
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.ne_110m_land))
        .attr("id", "regions")
        .attr('class', this.baseClass + '_path')
        .attr("d", this.get('path'))
        .attr('fill', this.styles.fill.world )
        .attr('stroke-width', 0.5)
        .attr('stroke', this.styles.stroke.world );
    }
    
    //US States
    if (this.features.states) {
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.states))
        .attr("id", "states")
        .attr('class', this.baseClass + '_path')
        .attr("d", this.get('path'))
        .attr('fill', this.style.fill.states)
        .attr('stroke-width', 0.5)
        .attr('stroke', this.style.stroke.states );
    }
    
    if (this.features.counties) {
      this.layer_viz.insert("path")
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
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.ne_50m_lakes))
        .attr("id", "lakes")
        .attr('class', this.baseClass + '_path')
        .attr("d", this.get('path'))
        .attr('fill', this.style.fill.water)
        .attr('stroke-width', 0.5)
        .attr('stroke', this.style.stroke.water );
    }
  },


  updatePath: function(){
    var h  = document.height;
    var w  = document.width;

    this.projection = d3.geo[ Composer.Map.projection.name ]()
        .scale( Composer.Map.projection.scale )
        .translate([w / 2, h / 2])
        .rotate( Composer.Map.projection.rotate )
        .center( Composer.Map.projection.center )
        .precision( Composer.Map.projection.precision );

    this.path = d3.geo.path()
        .projection( this.projection );
  }, 

  zoom: function( view ) {
    /* show hide counties */
    /* change projections */
    /*
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
   
    if ( !this.dynamicPan ) { 
      this.layer_viz.selectAll("path")
        .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    } else {
      console.log('zoom')
      this.layer_viz.selectAll("path")
        .attr("transform", "scale(" + d3.event.scale + ")");
    }

  },
   
  drag: function() {
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
    this.projection.rotate( [ end.lon, end.lat ] )
    this.layer_viz.selectAll("path").attr( "d", view.path );
  },

  // render points of the raw svg tag
  // TODO make layers render to individual g tags 
  renderLayer: function( layer ){
    console.log('RENDER', layer);
    //var el = d3.select('.layer-' + layer.id);
      
    this.layer_viz.selectAll("path")
      .data(layer.features)
      .enter().append('path')
        .attr('class', 'lyr-' + layer.id)
        .attr("d", this.get('path').pointRadius(3))
        .style('fill', '#08C')
        .style('opacity', .65)
        //.style('stroke', '#fff')
        .style('stroke-width', .5);

    this.zoom();
  },

  layerStats: function( features ){
    var stats = {};
  }
        
});
