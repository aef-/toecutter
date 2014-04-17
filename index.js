var ToeCutter = require( './src/toecutter' ),
    through = require( 'through' );

var tc = new ToeCutter( {
  requestOpts: { },
  timeBetweenRequests: 1000
} );

tc.queue( [ 'http://www.buzzfeed.com' ] );

tc.on( 'fetch', function( page ) {
} );
tc.on( 'start.request', function( page ) {
  page.getRequest( ).pipe( through( function( data ) {
    console.log( data.length );
  } ) );
} );
tc.on( 'end.request', function( page ) {
  //console.log( 'End request', page.getUrl( ) );
} );

tc.start( );
