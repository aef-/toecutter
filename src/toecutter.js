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
 * @param options.throttle {object} Throttle download rate at bytes/second. Defaults to 500000.
 * @public
 * @constructor
 */
function ToeCutter( options ) {
  this.options = {
    retries: 3,
    timeBetweenRetry: 5000, //ms
    timeBetweenRequests: 1000, //ms
    throttle: 500000, //bytes/s
    cachePageObjects: true,

    requestOptions: {
    }
  }; 

  _.assign( this.options, options );

  this._requestTimeout;
  this._throttleTimeout;
  this._bytesReceived = 0;
  this._isPaused = false;
  this._timeElapse; //s
  this._startTime; //s
  this._endTime; //s

  this._pages = { };
  this._pagesRunning = { };
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
  else if( url.hasOwnProperty( "url" ) )
    this._queue.push( url );
  else if( util.isArray( url ) )
    this._queue = this._queue.concat( url );
};

/**
 * Start crawling the queue.
 * @public
 */
ToeCutter.prototype.start = function( ) {
  this._startTime = new Date( );
  this.run( );

  this._throttleTimeout = setTimeout( this._checkThrottle.bind( this ), 100 );

  this.startAuto( );
};

/**
 * Finish any requests and stop running.
 * @public
 */
ToeCutter.prototype.stop = function( ) {
  this._endTime = new Date( );
  clearTimeout( this._throttleTimeout );
  this._bytesDownloaded = 0;
  clearTimeout( this._requestTimeout );
};

/**
 * Pauses all requests and crawl
 * @public
 */
ToeCutter.prototype.pause = function( ) {
  clearTimeout( this._requestTimeout);
  if( this.isPaused( ) )
    return;

  this._isPaused = true;

  for( i in this._pagesRunning ) {
    if( !this._pagesRunning.hasOwnProperty( i ) )
      continue;

    page = this._pagesRunning[ i ];
    page.getRequest( ).pause( );
  }

};

/**
 * @public
 */
ToeCutter.prototype.isPaused = function( ) {
  return this._isPaused;
};

/**
 * Resumes all requests and crawl
 * @public
 */
ToeCutter.prototype.resume = function( ) {
  if( !this.isPaused( ) )
    return;

  this._isPaused = false;

  for( i in this._pagesRunning ) {
    if( !this._pagesRunning.hasOwnProperty( i ) )
      continue;

    page = this._pagesRunning[ i ];
    page.getRequest( ).resume( );
  }

  this.startAuto( );
};

ToeCutter.prototype.startAuto = function( ) {
  clearTimeout( this._requestTimeout );
  this._requestTimeout = setTimeout( this.run.bind( this ), 
                                    this.options.timeBetweenRequests );

};


/**
 * Run either the passed URL or the next in queue.
 * @param {string} [url]
 * @public
 */
ToeCutter.prototype.run = function( url ) {
  var self = this,
      page, passedArgs;

  url = url || this._queue.shift( );

  if( !url )
    return;

  if( typeof url === "string" )
    url = helper.formatUrl( helper.normalizeUrl( url ) );
  else if( url.hasOwnProperty( "url" ) ) {
    url = helper.formatUrl( helper.normalizeUrl( url.url ) );
    passedArgs = url.passedArgs;
  }

  if( !this._pages[ url ] ) {
    page =  new Page( _.merge( { url: url }, 
                this.options.pageOptions ) );

    page.on( "data.page", this._onPageData.bind( this ) );
  }
  else if( this.options.cachePageObjects )
    page = this._pages[ url ];

  if( !page.isRunning( ) && !page.isFetched( ) ) {
    if( page.getAttempts( ) < this.options.retries ) {
      this._pagesRunning[ url ] = page;
      page.fetch( )
          .then( this.onFetchDone.bind( this, page, passedArgs ), 
                 this.onFetchFail.bind( this, page, passedArgs ) );
      this.emit( 'start.request', page );
    }
  }

  this.startAuto( );
};

/**
 * @emits ToeCutter#event:error
 * @private
 */
ToeCutter.prototype.onFetchFail = function( page, passedArgs, err ) {
  var self = this;

  delete this._pagesRunning[ page.getUrl( ) ];

  ToeCutter.prototype.emit.apply( this, [ 'error', page ].concat( passedArgs, err ) );
  setTimeout( function( ) {
    self.run( page.getUrl( ) );
  }, this.options.timeBetweenRetry );
};

/**
 * @emits ToeCutter#event:fetch
 * @private
 */
ToeCutter.prototype.onFetchDone = function( page, passedArgs ) {
  var self = this;
  delete this._pagesRunning[ page.getUrl( ) ];
  ToeCutter.prototype.emit.apply( this, [ 'fetch', page ].concat( passedArgs ) );
};

/**
 * @private
 */
ToeCutter.prototype._checkThrottle = function( ) {
  var elapsedTime = (new Date( ).getTime( ) - this._startTime.getTime( )) / 1000,
      i, pagesLength = 0, page;

  if( this.options.throttle < this._bytesReceived / elapsedTime )
    this.pause( );
  else
    this.resume( );

  this._throttleTimeout = setTimeout( this._checkThrottle.bind( this ), 100 );
};

/**
 * @private
 */
ToeCutter.prototype._onPageData = function( data ) {
  this._bytesReceived += data.length;
};

module.exports = ToeCutter;

