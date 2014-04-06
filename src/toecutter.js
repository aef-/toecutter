var _       = require( 'lodash' ),
    helper  = require( './lib/helper' ),
    Page    = require( './lib/page' ),
    Q       = require( 'q' ),
    debug   = require( 'debug' )( 'toecutter' );

var DEFAULTS = {
  threads: 4,
  userAgent: "ToeCutter coming to getcha",
  delay: 100, //ms
  obeyRobots: false,
  goOutside: false //traverse outgoing links
};

// TOECUTTER RUNNER
function ToeCutter( opts ) {
  this.options = {
    retries: 3,
    timeBetweenRetry: 5000, //ms
    urls: opts
  }; 

  this._pages = [ ];
  this._cache = { };
  this._queue = this.options.urls;
};


ToeCutter.prototype.queue = function( url ) {
  if( typeof url === "string" )
    this._queue.push( url );
  else
    _.each( url, this.queue, this );
};

ToeCutter.prototype.run = function( ) {
  var self = this, 
      runners = [ ],
      url;

  while( url = this._queue.pop( ) ) {
    runners.push( this._runSingle( url ) )
  }

  Q.all( runners ).done( function( ) {
    console.info( "Done running" );
  } );
};

ToeCutter.prototype._runSingle = function( url ) {
  var self = this, fetch, page;

  url = helper.normalizeUrl( url );

  console.info( "Running" );
  if( !this._cache[ url ] )
    this._cache[ url ] = page = new Page( {
      url: url
    } );
  else
    page = this._cache[ url ];

  if( page.getAttempts( ) < this.options.retries ) {
    fetch = page.fetch( )
    .done( _.bind( this.onFetchDone, this ), 
           _.bind( this.onFetchFail, this, page ) );
  }

  return fetch;
};

ToeCutter.prototype.onFetchFail = function( page, err ) {
  var self = this;
  console.info( "fail" );
  setTimeout( function( ) {
    self._runSingle( page.getUrl( ) );
  }, this.options.timeBetweenRetry );
};

ToeCutter.prototype.onFetchDone = function( page ) {
  console.info( "done" );
  this.queue( page.getLinks( ) );
  this.run( );
};

module.exports = ToeCutter;

