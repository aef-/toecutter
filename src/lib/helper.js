var parse    = require( 'url' ).parse,
    resolve = require( 'url' ).resolve,
    format  = require( 'url' ).format;


module.exports = {
  isUrl: function( url ) {
    var info = parse( url );
    return ( ( info.path || info.hostname ) && 
             ( info.protocol === "http:" ||
               info.protocol === "https:" ||
               !info.protocol ) );
  },
  normalizeUrl: function( url ) {
    if( typeof url === "string" )
      url = parse( url );

    if( url.pathname )
      url.pathname = resolve( '/', url.pathname );

    url = format( url );

    return url;
  }
}; 
