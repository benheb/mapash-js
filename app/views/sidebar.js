 
require('app/views/add_data');
require('app/views/settings');
require('app/views/finder');

Composer.SidebarView = Ember.ContainerView.extend({
      childViews: [ 
        Composer.FinderView.create(), 
        Composer.AddDataView.create(),
        Composer.SettingsView.create(),
        Ember.CollectionView.extend({
        classNames: [''],
			  elementId: 'sidebar',
			  tagName: 'div',
        content: ['Find', 'Create', 'Settings'],
        didInsertElement: function() {
          $('.sidebar-panel .close').on('click', function(){
            $('.sidebar-panel').hide();
            $('.sidebar-item').removeClass('selected');
          });
        },
        itemViewClass: Ember.View.extend({
          classNames: ['sidebar-item'],
			    templateName: 'sidebar_item',
          click: function(){
            $('.sidebar-item').removeClass('selected');
            $('.sidebar-item:eq('+this.contentIndex+')').addClass('selected');
            $('.sidebar-panel').hide();
            $('.sidebar-panel#' + this.get('content').toLowerCase() ).show();
          } 
        })
      })]
    });
