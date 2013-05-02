Composer.MapView = Ember.ContainerView.extend({
  mapBinding: 'Composer.map',
  elementId: 'map',
  tagName: 'svg',
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
    this.layer_vis = d3.select( "#" + el )
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

    Composer.layersController.get('store').on('features', function( layer ){
      self.renderLayer(layer);
    });

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
      this.layer_vis.selectAll("path")
        .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    } else {
      this.layer_vis.selectAll("path")
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

    el.selectAll("path")
      //this.base_layers.selectAll('path')
        .data(layer.features)
        .enter().append('path')
          //.attr("id", "")
          //.attr('class', this.baseClass + '_path')
          .attr("d", this.get('path'))
          .attr('fill', '#08C');
  }
        
});
