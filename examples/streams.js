var ToeCutter = require( '../src/toecutter' ),
    trumpet   = require( 'trumpet' ),
    through   = require( 'through' );

//TODO need to be completed...
var tc = new ToeCutter( {
} );

var tr = trumpet( );
tr.selectAll( 'a', function( link ) {
  link.getAttribute( 'href', function( href ) {
    tc.queue( href );
  } );
} );

tc.queue( [ 'http://www.buzzfeed.com' ] );
tc.on( 'start.request', function( page ) {
  console.log( 'Start request', page.getUrl( ) );

  page.getRequest( ).pipe( tr );
} );

tc.on( 'end.request', function( page ) {
  console.log( 'End request', page.getUrl( ) );
} );

tc.start( );
