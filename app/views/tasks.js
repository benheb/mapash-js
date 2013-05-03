Composer.TasksView = Ember.ContainerView.extend({
  template: Ember.Handlebars.compile("<div class='row'>{{yield}}</div>"),
  elementId: 'tasks',
  childViews: [
    Ember.View.extend({
      elementId:'share',
      //templateName: 'share'
      template: Ember.Handlebars.compile('<div class="btn tertiary">Share</div>') 
    })
  ]
});

