/*Composer.Router.map(function() {
  this.resource("map", {path: "/"}, function(){
    this.route("basemap", {path: "/"});
  });
});*/

Composer.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    // Set the IndexController's `title`
    controller.set('title', "My App");
  }
});
