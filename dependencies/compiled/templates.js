Ember.TEMPLATES["add_data"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<div class=\"section-title\"><span>Create New Dataset</span></div>\n<div class=\"close\">&times;</div>\n\n<div id=\"upload_drop\">\n  <span id=\"drag-tip\">Drag file here</span>\n  <div id=\"upload_list\"></div>\n  <div id=\"upload-option\">\n    <p>Or choose a file to upload:</p>\n    <span class=\"btn tertiary\" type=\"file\" id=\"file_upload\" multiple=\"true\" >Upload</span>\n  </div>\n</div>\n\n");
  
});

Ember.TEMPLATES["finder"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<div class=\"section-title\"><span>Find Data</span></div>\n<div class=\"close\">&times;</div>\n\n<h5>Search</h5>\n<div class=\"ui-section\">\n  <input type=\"text\" id=\"search-agol\" placeholder=\"Search ArcGIS\" />\n  <ul id=\"search-items\"></ul>\n</div>\n\n<h5>Test Data</h5>\n<div class=\"ui-section\">\n  <button class=\"btn\" id=\"add\">CO Snow Totals</button>\n</div> \n\n");
  
});

Ember.TEMPLATES["header"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<header id=\"header\">\n  <div class=\"\">\n    <div class=\"row\">\n      <div class=\"column-24\">\n        <a href=\"/\">\n          <h2 id=\"site-logo\">Arc<span>GIS</span> Composer</h2>\n        </a>\n        <nav>\n          <ul>\n            <li><a href=\"#\">Home</a></li>\n            <li><a href=\"#\">About</a></li>\n          </ul>\n        </nav>\n        <div id=\"esri-logo\">Esri</div>\n      </div>\n    </div>\n  </div>\n</header>\n");
  
});

Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Composer.AppView", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["layer-item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"layer-item\">\n  <div class=\"title\"><input class=\"visible\" type=\"checkbox\" checked><h4>");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content.title", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h4></div>\n  <div class=\"close\">&times;</div>\n  <div class=\"style\">Style</div>\n  <div class=\"options\">Options</div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["settings"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  


  data.buffer.push("<div class=\"section-title\"><span>Settings</span></div>\n<div class=\"close\">&times;</div>\n\n<div class=\"ui-section\" id=\"settings-projection\">\n  <span class=\"item-title\">Projections</span>\n  <div class=\"projections settings-button\" >Albers</div>\n  <div class=\"projections settings-button\" >Mercator</div>\n  <div class=\"projections settings-button\" >Mollweide</div>\n  <div class=\"projections settings-button selected\" >Eckert1</div>\n</div>\n\n<div class=\"ui-section\" id=\"settings-styles\">\n  <span class=\"item-title\">Style Basemap</span>\n  <div class=\"styles settings-button\">Randomizer!</div>\n</div>\n\n<div class=\"ui-section\" id=\"settings-features\">\n  <div class=\"settings-button\" id=\"world\"><span class=\"features\" id=\"world\">World</span> <span class=\"edit\">edit</span></div>\n  <div class=\"settings-button\" id=states\"><span class=\"features\" id=\"states\">States</span> <span class=\"edit\">edit</span></div>\n  <div class=\"settings-button\" id=\"water\"><span class=\"features\" id=\"water\">Lakes</span> <span class=\"edit\">edit</span></div>\n  <div class=\"settings-button\" id=\"counties\"><span class=\"features\" id=\"counties\">Counties</span> <span class=\"edit\">edit</span></div>\n</div>\n\n<div class=\"ui-section\" id=\"settings-panning\">\n  <span class=\"item-title\">Map Controls</span>\n  <input type=\"checkbox\" id=\"dynamic-panning\" /> Dynamic Panning\n</div>\n");
  
});

Ember.TEMPLATES["sidebar_item"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', hashTypes, escapeExpression=this.escapeExpression;


  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.content", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});