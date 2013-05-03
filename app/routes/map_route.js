require('app/routes/base_map_route');

Composer.MapRoute = Ember.Route.extend({
  /* 
    The data used to render the 
    outer dashboard parts of the application.

    This hook should be implemented on all routes,
    where the default model implementation doesn't suffice

    See http://emberjs.com/guides/routing/specifying-a-routes-model/
    for what that behavior is.

    Here, I'm returning an array-like object of all todos in the store 
  */
  model: function(){
    return Composer.Map;
  }
});
