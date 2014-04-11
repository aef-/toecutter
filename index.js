/*var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork( );
  }
    
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  } );
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer( function( req, res ) {
    res.writeHead( 200 );
    res.end("hello world\n");
  } ).listen( 8000 );
}
*/

ToeCutter = require( './src/toecutter' );

var tc = new ToeCutter( {
  requestOpts: { },
  timeBetweenRequests: 1000
} );

tc.queue( [ 'http://www.buzzfeed.com' ] );

tc.on( 'fetch', function( page ) {
  console.log( "Fetched:", page.getUrl( ), page.getTimeElapsed( ) );
} );
tc.on( 'start.request', function( page ) {
  //console.log( 'Start request', page.getUrl( ) );
} );

tc.on( 'end.request', function( page ) {
  //console.log( 'End request', page.getUrl( ) );
} );

tc.start( );
