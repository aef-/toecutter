/* This code is being used in [ToeCutter](https://github.com/aef-/toecutter) */

var _       = require( 'lodash' ),
    helper  = require( './helper' ),
    Q       = require( 'q' ),
    request = require( 'request' ),
    util    = require( 'util' ),
    EventEmitter = require( 'events' ).EventEmitter;


/**
 * @param {object} opts
 * @param {string} opts.throttle
 * @param {string} opts.url 
 * @param {object} opts.requestOpts See [node-request](https://github.com/mikeal/request).
 * @constructor
 * @private
 */
var Page = function( opts ) {
  this.options = {
    requestOpts: { }
  };

  _.assign( this.options, opts );

  this._body;
  this._attempts = 0;
  this._stepsFromRoot = 0;
  this._isRunning = false;
  this._isFetched = false;
  this._startTime;
  this._endTime;
  this._bytesReceived = 0;
  this._throttleTimeout;

  this._request;

  this._url = helper.normalizeUrl( this.options.url );
};

util.inherits( Page, EventEmitter );

/**
 * @returns {promise}
 * @private
 */
Page.prototype.fetch = function( ) {
  var self = this, req, dfd = Q.defer( );

  this._attempts += 1;
  this._isRunning = true;
  this._startTime = new Date( );

  this._request = request( this._url.href, this.options.requestOpts, function( err, resp, body ) {
    self._endTime = new Date( );
    if( err )
      dfd.reject( new Error( err ), self );
    else {
      if( resp.statusCode == 200 || resp.statusCode == 201 ) {
        self._body = body;
        dfd.resolve( self );
      }
      else
        dfd.reject( new Error( resp.statusCode ), self );
      self._isFetched = true
    }
    self._isRunning = false;
  } )
  .on('response', this._onResponse.bind( self ) )
  .on('data', this._onDataReceived.bind( self ) ); 

  return dfd.promise;
};

/**
 * @returns {request}
 * @public
 */
Page.prototype.getRequest = function( ) {
  return this._request;
};

/**
 * @returns {string}
 * @public
 */
Page.prototype.getBody = function( ) {
  return this._body;
};

/**
 * @returns {boolean}
 * @public
 */
Page.prototype.isFetched = function( ) {
  return this._isFetched;
};

/**
 * @returns {boolean}
 * @public
 */
Page.prototype.isRunning = function( ) {
  return this._isRunning;
};

/**
 * @returns {number} Time it took to finish the request in milliseconds.
 * @public
 */
Page.prototype.getTimeToFinish = function( ) {
  if( this._startTime && this._endTime )
    return this._endTime - this._startTime;
  return -1;
};

/**
 * @returns {urlObj}
 * @public
 */
Page.prototype.getUrl = function( ) {
  return this._url;
};

/**
 * @returns {number} Number of fetches that's been called.
 * @public
 */
Page.prototype.getAttempts = function( ) {
  return this._attempts;
};

/**
 * @returns {number} Returns number of bytes downloaded per second
 * @public
 */
Page.prototype.getBytesPerSecond = function( ) {
  var elapsedTime = (new Date( ).getTime( ) - this._startTime.getTime( )) / 1000;
  return this._bytesReceived / elapsedTime;
};

/**
 * @returns {number} Returns number of bytes downloaded
 * @public
 */
Page.prototype.getBytesReceived = function( ) {
  return this._bytesReceived;
};


/**
 * @private
 */
Page.prototype._onResponse = function( response ) {
  response.on( 'data', this._onDataReceived.bind( this ) );
};

/**
 * @private
 */
Page.prototype._onDataReceived = function( data ) {
  this._bytesDownloaded += data.length || 0;
  this.emit( 'data.page', data );
};

module.exports = Page;
