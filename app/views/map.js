Composer.MapView = Ember.ContainerView.extend({
  mapBinding: 'Composer.Map',
  elementId: 'map',
  tagName: 'svg',
  baseId: '#base',
  baseClass: 'base',
  childViews: [
    Ember.CollectionView.extend({
      contentBinding: 'Composer.layersController.content',
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
    })
  ],

  didInsertElement: function() {
    var self = this;
    var el = this.get('elementId');
    //d3 zoom binding
    this.layer_viz = d3.select( "#"+el )
      .call(d3.behavior.zoom()
        .scaleExtent([1 / 10, 10])
        .on("zoom", function() {
          self.zoom( self );
        })
      );

    var h  = document.height;
    var w  = document.width;
       
    this.λ = d3.scale.linear()
      .domain([0, w])
      .range([-180, 180]);
    
    this.φ = d3.scale.linear()
      .domain([0, h])
      .range([90, -90]);

    this.updatePath();

    //Bindings
    /*Map.mapController.on('style', function( style ) {
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
    
    
    Map.mapController.on('changePan', function(pan){
      self.dynamicPan = pan;
    });*/
    Composer.Map.on('updateFeatures', function(){
      self.updateBase(); 
    });

    Composer.layersController.get('store').on('features', function( layer ){
      self.renderLayer(layer);
    });

  },

  updateBase: function( scale ){
        var self = this;
        //TODO fix race issue
        //if (!this.style) return;

        this.style = Composer.Map.style();
        
        this.layer_viz.selectAll('.' + this.baseClass + '_path').remove();
        
        //var world = this.get('map').base_data;
        window.world = Composer.Map.base_data;
        
        console.log('world', world)
        //World boundaries
        //if (this.features.world) {
          this.layer_viz.insert("path")
            .datum(topojson.object(world, world.objects.ne_110m_land))
            .attr("id", "regions")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', '#000' )
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.world );
        //}
        
        /*//US States
        //if (this.features.states) {
          this.layers_viz.insert("path")
            .datum(topojson.object(world, world.objects.states))
            .attr("id", "states")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.states)
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.states );
        }
        
        //if (this.features.counties) {
          this.layer_viz.insert("path")
            .datum(topojson.object(world, world.objects.counties))
            .attr("id", "counties")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.counties )
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.counties );
        //}
         
        //Lakes 
        //if (this.features.lakes) { 
          this.layer_viz.insert("path")
            .datum(topojson.object(world, world.objects.ne_50m_lakes))
            .attr("id", "lakes")
            .attr('class', this.baseClass + '_path')
            .attr("d", this.get('path'))
            .attr('fill', this.style.fill.water)
            .attr('stroke-width', 0.5)
            .attr('stroke', this.style.stroke.water );
        //}*/
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
    console.log('zooom');   
    if ( !this.dynamicPan ) { 
      this.layer_viz.selectAll("path")
        .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    } else {
      this.layer_viz.selectAll("path")
        .attr("transform", "scale(" + d3.event.scale + ")");
    }

   },


  renderLayer: function( layer ){
    console.log('RENDER', layer);
    var el = d3.select('.layer-' + layer.id);
      
    /*el.call(d3.behavior.zoom()
        .scaleExtent([1 / 10, 10])
        .on("zoom", function() {
            self.zoom( self );
          })
        )*/

    this.layer_viz.selectAll("path")
      //this.base_layers.selectAll('path')
        .data(layer.features)
        .enter().append('path')
          //.attr("id", "")
          //.attr('class', this.baseClass + '_path')
          .attr("d", this.get('path'))
          .style('fill', '#08C')
          .style('stroke', '#fff');
  }
        
});
