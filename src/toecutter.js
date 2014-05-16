var _       = require( 'lodash' ),
    helper  = require( './lib/helper' ),
    Page    = require( './lib/page' ),
    Q       = require( 'q' ),
    util    = require( 'util' ),
    debug   = require( 'debug' )( 'toecutter' ),
    EventEmitter = require( 'events' ).EventEmitter;

/**
 * @param options {object}
 * @param options.retries {number} Number of attempts to retry a site should the request fail (either through error, timeout or non-200 status).
 * @param options.timeBetweenRetry {number} Time in milliseconds between retry for failed requests.
 * @param options.timeBetweenRequests {number} Time in milliseconds between running queued items.
 * @param options.requestOptions {object} See [node-request](https://github.com/mikeal/request).
 * @public
 * @constructor
 */
function ToeCutter( options ) {
  this.options = {
    retries: 3,
    timeBetweenRetry: 5000, //ms
    timeBetweenRequests: 1000, //ms
    requestOptions: {
    }
  }; 

  _.assign( this.options, options );

  this._requestTimeoutId = null;

  this._pages = [ ];
  this._cache = { };
  this._queue = [ ];
};

_.extend( ToeCutter, helper );

util.inherits( ToeCutter, EventEmitter );

/**
 * Queue up a url or an array of urls. Provides *no* checks.
 * @param {(string|string[])} url
 * @public
 */
ToeCutter.prototype.queue = function( url ) {
  if( typeof url === "string" )
    this._queue.push( url );
  else if( util.isArray( url ) )
    this._queue.concat( url );
};

/**
 * Start crawling the queue.
 * @public
 */
ToeCutter.prototype.start = function( ) {
  var self = this;

  this.run( );
  this._requestTimeoutId = setInterval( function( ) {
    self.run( );
  }, this.options.timeBetweenRequests );
};

/**
 * Finish any requests and stop running.
 * @public
 */
ToeCutter.prototype.stop = function( ) {
  clearInterval( this._requestTimeoutId );
};

/**
 * Run either the passed URL or the next in queue.
 * @param {string} [url]
 * @public
 */
ToeCutter.prototype.run = function( url ) {
  var self = this,
      page;

  url = url || this._queue.shift( );

  if( !url )
    return;

  url = helper.formatUrl( helper.normalizeUrl( url ) );

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

/**
 * @emits ToeCutter#event:error
 * @private
 */
ToeCutter.prototype.onFetchFail = function( page, err ) {
  var self = this;

  this.emit( 'error', page, err );
  setTimeout( function( ) {
    self.run( page.getUrl( ) );
  }, this.options.timeBetweenRetry );
};

/**
 * @emits ToeCutter#event:fetch
 * @private
 */
ToeCutter.prototype.onFetchDone = function( page ) {
  var self = this;
  this.emit( 'fetch', page );
};

module.exports = ToeCutter;

