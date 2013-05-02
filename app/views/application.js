require('app/views/sidebar');
require('app/views/layers');
require('app/views/map');

Composer.Layerz =Composer.LayersView.create(); 

Composer.AppView = Ember.ContainerView.extend({
  elementId: 'app_container',
  childViews: [ 'headerView', 'mainView' ],
  headerView: Ember.ContainerView.create({
    childViews: [ 'titleView'],
    elementId: 'header',
    tagName: 'header',
    titleView: Ember.View.create({
      templateName: 'Header'//Ember.Handlebars.compile( "<div>HEADRE</div>")
    })
  }),
  mainView: Ember.ContainerView.create({
    template: Ember.Handlebars.compile("<div class='row'>{{yield}}</div>"),
    elementId: 'map_main',
    classNames: [''],
    childViews: [ 
      Composer.SidebarView.create(),
      Composer.Layerz,
      Ember.ContainerView.create({
        template: Ember.Handlebars.compile("<div>{{yield}}</div>"),
        childViews: [ Composer.MapView.create() ]
      })
    ]
  })
});





