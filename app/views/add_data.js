Composer.AddDataView = Ember.View.extend({
  classNames: ['sidebar-panel'],
  elementId: 'create',
  templateName: 'add_data',
  didInsertElement: function() {

    function feature( headers, data ) {
      var f = { type: 'Feature', properties: {}, geometry: {} };
      var lat, lon;

      headers.forEach(function(h,i){
        f.properties[h] = data[i];  
        if (h.toLowerCase() == 'latitude') lat = data[i];
        if (h.toLowerCase() == 'longitude') lon = data[i];
      });
      if (lat && lon && (typeof(lat) == 'number' && typeof(lon) == 'number')) {
        console.log(lat, lon)
        f.geometry.coordinates = [lon, lat];
        f.geometry.type = 'Point';
      }
      return f;
    }

    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.

      // files is a FileList of File objects. List some properties.
      var output = [];
      for (var j = 0, f; f = files[j]; j++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ')','</li>');
        //f.size, ' bytes, last modified: ',
        //f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',

        var fileJSON = { title: f.name, features: []};

        var reader = new FileReader();

        // parse the file - reader is async
        reader.onload = function(theFile) {  
            
            str = theFile.target.result;   
            var lines = str.split(/[\r\n|\n]+/);
            for (i=0; i < lines.length; i++) {
            
                lines[i]  = lines[i].replace(/(\r\n|\n|\r|)/gm,"").split(/[,;]+/);
                //lines[i]  = lines[i].filter( function(x){ if( x!= "" )return true; } );
                
                if ( lines[i] && lines[i][0] && lines[i][0][0] != "#" ) {
                    for(x = 0; x < lines[i].length; x++ ) {
                        var result = parseFloat( lines[i][x] );
                        if( !isNaN(result) )
                            lines[i][x] = result;
                    }
                    if (i > 0) fileJSON.features.push( feature(lines[0], lines[i]) );
                }
            }       
            console.log( fileJSON );
            Composer.layersController.add( fileJSON );
        }
        reader.onerror = function() { console.log('Error reading file');} 
        reader.readAsText( f );


        // Closure to capture the file information.
        /*reader.onload = (function(theFile) {
          return function(e) {
            // Render thumbnail.
            //var span = document.createElement('span');
            //span.innerHTML = ['<img class="thumb" src="', e.target.result,
            //                '" title="', escape(f.name), '"/>'].join('');
            //document.getElementById('list').insertBefore(span, null);
          };
        })(f);*/

        // Read in the image file as a data URL.
        //reader.readAsDataURL(f);

      }
      //console.log('FILES', output);
      $('#upload_list').html('<ul>' + output.join('') + '</ul>');
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('upload_drop');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  
  }
});
