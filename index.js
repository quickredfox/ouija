var Path         = require( 'path')
  , spawn        = require( 'child_process' ).spawn
  , MAX_CHILDREN = 100
  , BUFFER_SIZE  = 20
  , children     = []
  , buffer       = []
  , invoke = function ( url, spirits, callback ) {
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
          var errorvalue = error.length ? new Error( error.join("\n")||'Unknown' ) : null;
          var datavalue  = data.length ? data.join("") : null;
          if( typeof callback === "function") callback(errorvalue, datavalue);
          return finalize.called = true;
        };
        stdout.on( 'data', function ( buffer ) {
          if( error.length > 0) return finalize();
          var chunk = String( buffer );
          data.push( chunk );
        });
        stderr.on( 'data', function ( buffer ) {
          chunk = String( buffer )
          error.push( chunk );
        });
        child.on( 'exit', finalize );
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
// Make certain the children die with their parent!
// AND ignore all whining!
process.on('exit', function () {
  children.map(function () {
    try{ return child.kill();
    }catch ( FailSilently ){
      // system *should* also be killing child processes, not a big issue here. 
    }     
  }); 
});
