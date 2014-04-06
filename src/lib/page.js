var _       = require( 'lodash' ),
    helper  = require( './helper' ),
    parse   = require( 'url' ).parse,
    Q       = require( 'q' ),
    cheerio = require( 'cheerio' ),
    request = require( 'request' );

var Page = function( params ) {
  this.options = { 
    goOutside: false
  };
  this.attempts = 0;
  /*
  _.defaults( {
    url: null,
    body: null,
    headers: null,
    redirectTo: null,
    error: null,
    data: null,
    responseCode: null,
    visited: false,
    referer: null,
    responseTime: null
  }, params );
  */

  this.url = parse( this.resolveUrl( params.url ) );
 
  this.links = null; //array of links
  this.$doc = null; //
};

Page.prototype.fetch = function( ) {
  var self = this, req, dfd = Q.defer( );

  this.attempts += 1;

  request( this.url.href, function( err, resp, body ) {
    if( !err && resp.status == 200 ) {
      self.$doc = cheerio.load( body );
      dfd.resolve( self );
    }
    else {
      dfd.reject( new Error( err || "Bad status" ), self );
    }
  } );

  return dfd.promise;
};

Page.prototype.getLinks = function( ) {
  var links = [ ], $links, fullUrl, href;

  if( this.links )
    return this.links

  this.links = [ ];
  
  if( !this.$doc )
    return this.links;

  $links = this.$doc( 'a' );
  
  _.each( $links, function( link ) {
    href = this.$doc( link ).attr( 'href' );
    if( !href || !helper.isUrl( href ) )
      return;

    href = this.resolveUrl( href );

    if( this.options.goOutside ||
        ( !this.options.goOutside && 
          parse( href ).hostname === this.url.hostname ) )
      links.push( href );
  }, this );

  this.links = links;

  return this.links;
};

Page.prototype.getUrl = function( url ) {
  return this.url.href;
};

Page.prototype.getAttempts = function( ) {
  return this.attempts;
};

Page.prototype.resolveUrl = function( url ) {
  var info = parse( url );
  if( !info.hostname )
    info.hostname = this.url.hostname;
  if( !info.protocol )
    info.protocol = this.url.protocol;

  return helper.normalizeUrl( info );
};

module.exports = Page;
