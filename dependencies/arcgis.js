ArcGIS = function( options, callback ){

  options = options || {};

  var arcgis = {
    request: request,
    host: options.host || 'http://www.arcgis.com/sharing/rest/',
    login: login,
    search: search,
    createGroup: createGroup,
    User: User
  };

  function _base( fn, params, cb){
  }

  function request( params, cb ){
    //_base('request', params, cb);
    params = addToken( params );
    ArcGIS.request( params, cb );
  }


  function search( params, cb ){
    params = addToken( params );
    ArcGIS.search( params, cb );
  }


  function createGroup( params, cb ){
    params = addToken( params );
    ArcGIS.community.createGroup( params, cb );
  }

  function User( id, params, cb ){
    params = addToken( params );
    params.host = arcgis.host;
    return ArcGIS.User(id, params, cb);
  }

  function addToken( params ){
    if ( arcgis.token ) { 
      params.token = arcgis.token;
    }
    return params;
  }


  t = 0;
  function login( user, pass, callback ){
    function _internalCallback( err, data ){
      if (data) {
        console.log(t++, data.token);
        arcgis.token = data.token;
        callback(err, arcgis);
      }
    }
    
    var auth_params = {
      url: arcgis.host + '/generateToken',
      type: 'post',
      data: {
        username: user,
        password: pass,
        f:        "json",
        referer:  "http://arcgis.com"
      }
    };

    auth_params.url.replace('http://', 'https://');

    if (options && options.expiration) {
      auth_params.data.expiration = options.expiration;
    }
    request( auth_params, _internalCallback);
  }
  
  if ( options.auth ){
    login( options.auth.username, options.auth.password );
  }

  return arcgis;

};

ArcGIS.request = function( params, callback ){

    function querystring( p ){
      var qs = "";
      for( var key in p ) {
        var value = p[key];
        qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
      if ( qs.length ) {
        qs = qs.substring(0, qs.length - 1 );
      }
      return qs;
    }

    function requestHandler(){
      //console.log('rhandler', this);
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          try {
            var response = JSON.parse(this.responseText);
            callback(null, response);
          } catch (err) {
            callback("Invalid JSON on response");
          }
        }
      }
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = requestHandler; 
    //xhr.setDisableHeaderCheck(true);

    var _req = {
      get: function( p ){
        var url = p.url + '?' + querystring( p.data );
        xhr.open("GET", url);
        //xhr.setRequestHeader("Referer", "http://www.arcgis.com");
        xhr.send(null); 
      },

      post: function( p ){
        xhr.open("POST", p.url);
        //xhr.setRequestHeader("Referer", "http://www.arcgis.com");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send( querystring( p.data ) );
      }
    };

    _req[ params.type ]( params );

};


// base request pattern for most calls
// passes params to primary request method and augments data w/given API list  
ArcGIS.base = function( path, req_type, required, params, callback ){
    var _data = {
      url: path,
      type: req_type,
      data: {
        f: 'json' 
      }
    };

    // validate 
    required.forEach( function( option ){
      if ( !params[ option ] ) {
        _internalCB('Missing require parameter: ' + option, null);
      }
    });

    // add all passed in params to request object    
    for ( var param in params ) {
      _data.data[ param ] = params[ param ];
    }

    var _internalCB = function( err, data ){
      if (err || data.error ) {
        callback( err || data.error, null );
      } else {
        callback( null, data);
      }
    };

    ArcGIS.request( _data, _internalCB );
};

ArcGIS.search = function( params, callback ){
    var url = params.url || 'http://arcgis.com/sharing/rest';
    url += '/search';
    var required = [ 'q' ];
    ArcGIS.base( url, 'get', required, params, callback );
};


ArcGIS.community = {};

ArcGIS.community.createGroup = function( params, callback ){
    var url = params.url || 'http://arcgis.com/sharing/rest';
    url += '/community/createGroup';
    var api = ['title'];
    ArcGIS.base( url, 'post', api, params, callback );
};


ArcGIS.community.self = function( callback ){
    var url = params.url || 'http://arcgis.com/sharing/rest';
    url += '/community/self';
    ArcGIS.base( url, 'get', [], {}, callback );
};


ArcGIS.community.groups = function( params, callback ){
    var url = params.url || 'http://arcgis.com/sharing/rest';
    url += '/community/groups';
    var api = ['q'];
    ArcGIS.base( url, 'get', api, params, callback );
};


ArcGIS.community.users = function( params, callback ){
    var url = params.url || 'http://arcgis.com/sharing/rest';
    url += '/community/users';
    var api = ['q'];
    ArcGIS.base( url, 'get', api, params, callback );
};

ArcGIS.User = function( id, options, callback ){

  var _user = {
    update: update,
    content: content,
    createFolder: createFolder,
    deleteFolder: deleteFolder,
    item: item 
  };

  // if we have an id GET the user object 
  if ( id ){
    var _data = {
      url: options.host || 'http://arcgis.com/sharing/rest',
      type: 'get',
      data: {
        f: 'json'
      }
    };

    _data.url += '/community/users/' + id;
    ArcGIS.request( _data, _internalCB );
    return _user; 
  } else {
    // no ID return empty // should throw an exception
    if ( callback ) { 
      callback('No user ID/Name given', null);
    }
    return null;
  }

  function _internalCB( err, data ){
    if ( err ) { 
      if ( callback ) { 
        callback('Could not find user', null);
      }
      return null;
    }

    // adds user data to the _user
    // will append data to returned object as well (sync mode)
    for (var key in data){
      _user[ key ] = data[key];
    }

    if ( callback ) {
      callback( err, _user );
    }
  }

  // adds current auth token to request params 
  function addToken( params ){
    if ( options.token ){
      params.token = options.token;
    }
    return params; 
  }

  // update the user info on the server 
  function update( params, cb ){
    var url = options.host || 'https://arcgis.com/sharing/rest';
    url += '/community/users/' + _user.username + '/update';

    // keep local user data up to date
    for (var key in params){
      _user[ key ] = params[key];
    }

    params = addToken( params );
    //console.log('UPDATE', url, params, _user);
    ArcGIS.base( url, 'post', [], params, cb );
  }


  // gets all the users content 
  function content( params, cb){
    var url = options.host || 'https://arcgis.com/sharing/rest';
    url += '/content/users/' + id + (( params.folder ) ? '/'+params.folder : '');
    delete params.folder; 
    params = addToken( params );
    //console.log('content-url', url, params);
    ArcGIS.base( url, 'get', [ ], params, cb );
  }

  // create a folder for grouping items 
  function createFolder( folder, cb ){

  }

  // delete a folder
  function deleteFolder( folder, cb ){

  }

  // defines user item operations 
  var item = {

    add: function( itemId, cb ){

    },
    publish: function( itemId, cb ){

    },
    exports: function( itemId, cb ){

    },
    deletes: function( itemId, cb ){

    },
    share: function( itemId, cb ){

    }
  };
};

ArcGIS.Group = function( id, options, callback ){

  var _group = {
  };

  // if we have an id GET the user object 
  if ( id ){
    var _data = {
      url: options.host || 'http://arcgis.com/sharing/rest',
      type: 'get',
      data: {
        f: 'json'
      }
    };

    _data.url += '/community/groups/' + id;
    ArcGIS.request( _data, _internalCB );
    return _group; 
  } else {
    // no ID return empty // should throw an exception
    if ( callback ) { 
      callback('No group ID/Name given', null);
    }
    return null;
  }

  function _internalCB( err, data ){
    if ( err ) { 
      if ( callback ) { 
        callback('Could not find group', null);
      }
      return null;
    }

    // adds user data to the _user
    // will append data to returned object as well (sync mode)
    for (var key in data){
      _group[ key ] = data[key];
    }

    if ( callback ) {
      callback( err, _group );
    }
  }

  // adds current auth token to request params 
  function addToken( params ){
    if ( options.token ){
      params.token = options.token;
    }
    return params; 
  }

};

ArcGIS.Item = function( id, options, callback ){

  var _item = {
  };

  // if we have an id GET the object 
  if ( id ){
    var _data = {
      url: options.host || 'http://arcgis.com/sharing/rest',
      type: 'get',
      data: {
        f: 'json'
      }
    };

    _data.url += '/community/groups/' + id;
    ArcGIS.request( _data, _internalCB );
    return _item; 
  } else {
    // no ID, return empty 
    if ( callback ) { 
      callback('No item ID given', null);
    }
    return null;
  }

  function _internalCB( err, data ){
    if ( err ) { 
      if ( callback ) { 
        callback('Could not find item', null);
      }
      return null;
    }

    // append data to returned object 
    for (var key in data){
      _item[ key ] = data[key];
    }

    if ( callback ) {
      callback( err, _item );
    }
  }

  // adds current auth token to request params 
  function addToken( params ){
    if ( options.token ){
      params.token = options.token;
    }
    return params; 
  }

};
