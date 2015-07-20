var ToeCutter = require( '../../src/toecutter' ),
    _ = require( 'lodash' );

describe( "ToeCutter", function( ) {
  var tc;

  beforeEach( function( ) {
    tc = new ToeCutter( {
    } );
  } );

  it( "should start", function( ) {
    tc.queue( [ 'http://localhost:3000' ] );
    tc.start( );
  } );

  it( "should stop", function( ) {
  } );

  it( "should run URL passed", function( ) {
  } );

  it( "should run next in queue", function( ) {
  } );

  it( "should queue", function( ) {
  } );

  it( "should wait 5 seconds on fail before retrying", function( ) {
  } );

  it( "should retry up to 3 times", function( ) {
  } );

  it( "should have helper as properties", function( ) {
    assert( _.isFunction( ToeCutter.isUrl ) );
    assert( _.isFunction( ToeCutter.resolveUrl ) );
    assert( _.isFunction( ToeCutter.normalizeUrl ) );
  } );
} );
