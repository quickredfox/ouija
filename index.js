var Path         = require( 'path')
  , MAX_CHILDREN = 10
  , BUFFER_SIZE  = 20
  , TOKEN        = /^SPIRITSDATA\:/
  , children     = []
  , buffer       = []
  , invoke = function ( url, spirits, calback ) {
      var data     = []
        , error    = []
        , args     = [ Path.normalize( __dirname + "/invoke.coffee"), url ].concat( spirits )
        , child    = spawn('phantomjs', args )
        , stdout   = child.stdout
        , stderr   = child.stderr
        , expected = spirits.length
        , finalize = function () {
          if( finalize.called ) return false;
          child.kill();// kill fast!
          error = error.length ? new Error( error.join("\n")||'Unknown' ) : null;
          data  = data.length ? data : null;
          if( typeof callback === "function") callback(error, data);
          return finalize.called = true;
        };
        stdout.on( 'data', function ( buffer ) {
          var chunk = String( buffer );
          if( TOKEN.test( chunk ) ) data.push( chunk.replace( TOKEN, '') );
          if( data.length === expected ) return finalize(); 
        });
        stderr.on( 'data', function ( buffer ) {
          chunk = String( buffer )
          error.push( chunk );
        });
        // Make certain the children die with their parent!
        // AND ignore all whining!
        process.on('exit', function () {
          try{ return child.kill();
          }catch ( FailSilently ){
            // system *should* also be killing child processes, not a big issue here. 
          } 
        });
        child.on( exit, finalize );
        children.push(child);
        return child;
    };
    
module.exports = function ( url, spirits, callback ) {
  if( children.length > MAX_CHILDREN ){
    var message =  "MAX_CHILDREN set to "+ MAX_CHILDREN + ". Currently at " + children.length;
    callback( new Error( message ) );
  };
  invoke( url, spirits, callback );
};
module.exports.setMaxChildren = function ( n ) {
  MAX_CHILDREN = n;
};
module.exports.setBufferSize = function ( n ) {
  BUFFER_SIZE  = n;
};
