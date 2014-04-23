var ToeCutter = require( '../../src/lib/page' );

describe( "Page", function( ) {
  var tc;
  beforeEach( function( ) {
    var tc = new ToeCutter( {
    } );
  } );

  it( "should get request", function( ) {
    tc.queue( [ 'http://localhost:3000' ] );
    tc.start( );
  } );

  it( "should return whether it's been fetched", function( ) {
  } );

  it( "should return whether it's running", function( ) {
  } );

  it( "should return time it took to finish fetching", function( ) {
  } );

  it( "should return url", function( ) {
  } );

  it( "should keep track of attempts", function( ) {
  } );
} );
