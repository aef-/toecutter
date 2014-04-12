var _       = require( 'lodash' ),
    helper  = require( './helper' ),
    $       = helper.$,
    parse   = require( 'url' ).parse,
    Q       = require( 'q' ),
    request = require( 'request' );


var Page = function( opts ) {
  this.options = { 
    goOutside: false
  };

  _.assign( this.options, opts );

  this._attempts = 0;
  this._stepsFromRoot = 0;
  this._isRunning = false;
  this._isFetched = false;
  this._startTime = null;
  this._endTime = null;

  this._request = null;

  this._url = parse( this.resolveUrl( this.options.url ) );
 
  this._links = null; //array of links
  this.$ = null;
};

Page.prototype.fetch = function( ) {
  var self = this, req, dfd = Q.defer( );

  this._attempts += 1;
  this._isRunning = true;
  this._startTime = Date.now( );

  this._request = request( this._url.href, this.options, function( err, resp, body ) {
    self._endTime = Date.now( );
    if( err ) {
      dfd.reject( new Error( err ), self );
    }
    else {
      if( resp.statusCode == 200 || resp.statusCode == 201 ) {
        self.$ = $( body );
        dfd.resolve( self );
      }
      else {
        dfd.reject( new Error( 404 ), self );
      }
      self._isFetched = true
    }
    self._isRunning = false;
  } );

  return dfd.promise;
};

Page.prototype.getRequest = function( ) {
  return this._request;
};

Page.prototype.isFetched = function( ) {
  return this._isFetched;
};

Page.prototype.isRunning = function( ) {
  return this._isRunning;
};

Page.prototype.getTimeElapsed = function( ) {
  if( this._startTime && this._endTime )
    return this._endTime - this._startTime;
  return null;
};

Page.prototype.getLinks = function( ) {
  var links = [ ], $links, fullUrl, href;

  if( this._links )
    return this._links

  this._links = [ ];

  if( !this.$ )
    return this._links;

  $links = this.$( 'a' );

  _.each( $links, function( link ) {
    href = this.$( link ).attr( 'href' );
    if( !href || !helper.isUrl( href ) )
      return;

    href = this.resolveUrl( href );

    if( this.options.goOutside ||
        ( !this.options.goOutside && 
          parse( href ).hostname === this._url.hostname ) )
      links.push( href );
  }, this );

  this._links = links;

  return this._links;
};

Page.prototype.getUrl = function( url ) {
  return this._url.href;
};

Page.prototype.getAttempts = function( ) {
  return this._attempts;
};

Page.prototype.resolveUrl = function( url ) {
  var info = parse( url );
  if( !info.hostname )
    info.hostname = this._url.hostname;
  if( !info.protocol )
    info.protocol = this._url.protocol;

  return helper.normalizeUrl( info );
};

module.exports = Page;
