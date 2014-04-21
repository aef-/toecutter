var parse   = require( 'url' ).parse,
    resolve = require( 'url' ).resolve,
    format  = require( 'url' ).format;


module.exports = {
  /**
   * @param url {String|URL}
   * @return {Boolean}
   */
  isUrl: function( url ) {
    if( !url )
      return false;

    if( typeof url === "string" )
      url = parse( url );
    return ( ( url.path || url.hostname ) && 
             ( url.protocol === "http:" ||
               url.protocol === "https:" ||
               !url.protocol ) );
  },

  /**
   * normalizes the a URN (resolves path/to/../) 
   * @param url {String|URL}
   * @return {URL}
   */
  normalizeUrl: function( url ) {
    if( typeof url === "string" )
      url = parse( url );

    if( url.pathname )
      url.pathname = resolve( '/', url.pathname );

    return url;
  },

  formatUrl: function( url ) {
    return format( url );
  },

  /**
   * Checks whether a URL is just a URN and adds missing properties if so.
   * @param url {String|URL}
   * @return {URL}
   */
  relativeTo: function( protocol, hostname, url ) {
    if( typeof url === "string" )
      url = parse( url );
    if( !url.hostname )
      url.hostname = hostname;
    if( !url.protocol )
      url.protocol = protocol;

    return this.normalizeUrl( url );
  }
};
