var _       = require( 'lodash' ),
    helper  = require( './lib/helper' ),
    Page    = require( './lib/page' ),
    Q       = require( 'q' ),
    util    = require( 'util' ),
    debug   = require( 'debug' )( 'toecutter' ),
    EventEmitter = require( 'events' ).EventEmitter;

// TOECUTTER RUNNER
function ToeCutter( opts ) {
  this.options = {
    retries: 3,
    timeBetweenRetry: 5000, //ms
    timeBetweenRequests: 5000, //ms
    depth: null,
    goOutside: false, //traverse outgoing links
    obeyRobots: false,
    requestOpts: {

    }
  }; 

  _.assign( this.options, opts );

  this._requestTimeoutId = null;

  this._pages = [ ];
  this._cache = { };
  this._queue = [ ];
};

util.inherits( ToeCutter, EventEmitter );

ToeCutter.prototype.queue = function( url ) {
  if( typeof url === "string" )
    this._queue.push( url );
  else
    _.each( url, this.queue, this );
};

ToeCutter.prototype.start = function( ) {
  var self = this;

  this.run( );
  this._requestTimeoutId = setInterval( function( ) {
    self.run( );
  }, this.options.timeBetweenRequests );
};
 
ToeCutter.prototype.stop = function( ) {
  clearInterval( this._requestTimeoutId );
};

ToeCutter.prototype.run = function( url ) {
  var self = this,
      page;

  url = url || this._queue.shift( );

  if( !url )
    return;

  url = helper.normalizeUrl( url );

  if( !this._cache[ url ] )
    page = this._cache[ url ] = new Page( { url: url } );
  else
    page = this._cache[ url ];

  if( !page.isRunning( ) && !page.isFetched( ) ) {
    if( page.getAttempts( ) < this.options.retries ) {
      page.fetch( )
          .then( _.bind( this.onFetchDone, this ), 
                 _.bind( this.onFetchFail, this, page ) );
      this.emit( 'start.request', page );
    }
  }
};

ToeCutter.prototype.onFetchFail = function( page, err ) {
  var self = this;
  this.emit( 'fail', page );
  this.emit( 'end.request', page );
  setTimeout( function( ) {
    self.run( page.getUrl( ) );
  }, this.options.timeBetweenRetry );
};

ToeCutter.prototype.onFetchDone = function( page ) {
  var self = this;
  this.emit( 'fetch', page );
  this.queue( page.getLinks( ) );
  this.emit( 'end.request', page );
};

module.exports = ToeCutter;

