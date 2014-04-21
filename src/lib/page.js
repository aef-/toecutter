var _       = require( 'lodash' ),
    helper  = require( './helper' ),
    Q       = require( 'q' ),
    request = require( 'request' );


var Page = function( opts ) {
  this.options = { 
    goOutside: false
  };

  _.assign( this.options, opts );

  this._body = null;
  this._attempts = 0;
  this._stepsFromRoot = 0;
  this._isRunning = false;
  this._isFetched = false;
  this._startTime = null;
  this._endTime = null;

  this._request = null;

  this._url = helper.normalizeUrl( this.options.url );
};

Page.prototype.fetch = function( ) {
  var self = this, req, dfd = Q.defer( );

  this._attempts += 1;
  this._isRunning = true;
  this._startTime = Date.now( );

  this._request = request( this._url.href, this.options, function( err, resp, body ) {
    self._endTime = Date.now( );
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
  } );

  return dfd.promise;
};

Page.prototype.getRequest = function( ) {
  return this._request;
};

Page.prototype.getBody = function( ) {
  return this._body;
};

Page.prototype.isFetched = function( ) {
  return this._isFetched;
};

Page.prototype.isRunning = function( ) {
  return this._isRunning;
};

Page.prototype.getTimeToFinish = function( ) {
  if( this._startTime && this._endTime )
    return this._endTime - this._startTime;
  return null;
};

Page.prototype.getUrl = function( ) {
  return this._url;
};

Page.prototype.getAttempts = function( ) {
  return this._attempts;
};

module.exports = Page;
