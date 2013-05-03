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
    this.project();
  }).observes('proj'),

  // Observe base styles 
  stylesChange: (function(){
    this.style();
  }).observes('styles'),

  // Observe features 
  featuresChange: (function(){
    this.changeFeatures();
  }).observes('features'),

  panChange: (function(){
    this.set('dynamicPan', this.get('pan'));
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
      /*.call(d3.behavior.zoom()
        .scaleExtent([1 / 10, 10])
        .on("zoom", function() {
            self.zoom();
          })
        )
      .call(d3.behavior.drag()
        .on("drag", function() {
            if (self.dynamicPan) self.drag();
          })
        );*/
    var zoom = d3.behavior.zoom()
        .on("zoom",function() {
          self.zoom();
        });

    this.layer_viz.call(zoom);

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

  project: function(){
    this.layer_viz.selectAll('path')
      .attr("d", this.get('path'));
  },

  style: function(){
    for ( var type in this.features ){
      if (this.features[type]) {
        this.layer_viz.selectAll('.'+ type)
          .style('fill', this.styles.fill[ type ] )
          .style('stroke-width', 0.5)
          .style('stroke', this.styles.stroke[ type ]);
      }    
    }
  },

  changeFeatures: function(){
    for ( var type in this.features ){
      var paths = this.layer_viz.selectAll('.'+ type);
      if (this.features[type]) {
        paths.style('display', 'block');
      } else {
        paths.style('display', 'none');
      }
    }
  },

  updateBase: function( scale ){
    var self = this;
    
    this.layer_viz.selectAll('.'+this.baseClass+ '_path').remove();
    var world = Composer.Map.base_data;

    //World boundaries
    //if (this.features.world) {
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.ne_110m_land))
        .attr("id", "regions")
        .attr('class', this.baseClass + '_path world')
        .attr("d", this.get('path'))
        .attr('fill', this.styles.fill.world )
        .attr('stroke-width', 0.5)
        .attr('stroke', this.styles.stroke.world )
        .style('display', (this.features.world) ? 'block' : 'none' );
    //}
    
    //US States
    //if (this.features.states) {
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.states))
        .attr("id", "states")
        .attr('class', this.baseClass + '_path states')
        .attr("d", this.get('path'))
        .style('fill', this.styles.fill.states)
        .style('stroke-width', 0.5)
        .style('stroke', this.styles.stroke.states )
        .style('display', (this.features.states) ? 'block' : 'none' );
    //}
    
    //if (this.features.counties) {
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.counties))
        .attr("id", "counties")
        .attr('class', this.baseClass + '_path counties')
        .attr("d", this.get('path'))
        .style('fill', this.styles.fill.counties )
        .style('stroke-width', 0.5)
        .style('stroke', this.styles.stroke.counties )
        .style('display', (this.features.counties) ? 'block' : 'none' );
    //}
     
    //Lakes 
    //if (this.features.water) { 
      this.layer_viz.insert("path")
        .datum(topojson.object(world, world.objects.ne_50m_lakes))
        .attr("id", "lakes")
        .attr('class', this.baseClass + '_path water')
        .attr("d", this.get('path'))
        .style('fill', this.styles.fill.water)
        .style('stroke-width', 0.5)
        .style('stroke', this.styles.stroke.water )
        .style('display', (this.features.water) ? 'block' : 'none' );
    //}
  },


  updatePath: function(){
    var h  = document.height;
    var w  = document.width;
  
    var p = this.get('proj');

    this.projection = d3.geo[ p.name ]() //Composer.Map.projection.name ]()
        .scale( p.scale ) //Composer.Map.projection.scale )
        .translate([w / 2, h / 2])
        .rotate( p.rotate )
        .center( p.center )
        .precision( p.precision );

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
    if (d3.event){
      if ( !this.dynamicPan ) { 
        this.layer_viz.selectAll("path")
          .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      } else {
        this.layer_viz.selectAll("path")
          .attr("transform", "scale(" + d3.event.scale + ")");
      }
    }

  },
   
  drag: function() {
    var start = { 
      lon: this.projection.rotate()[0], 
      lat: this.projection.rotate()[1]
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
    this.layer_viz.selectAll("path").attr( "d", this.get('path') );
  },

  // render points of the raw svg tag
  // TODO make layers render to individual g tags 
  renderLayer: function( layer ){
    console.log('RENDER', d3.geo.bounds(layer.features)[0][0], layer);
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

    //this.zoom();
  },

  layerStats: function( features ){
    var stats = {};
  }
        
});
