var parse   = require( 'url' ).parse,
    resolve = require( 'url' ).resolve,
    format  = require( 'url' ).format;


module.exports = {
  /**
   * Will check a string or a URL object if it's a fully formed URL.
   * @param {string|urlObj} url
   * @return {boolean}
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
   * normalizes the a URL (resolves path/to/../) 
   * @param {string|urlObj} url
   * @return {urlObj}
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
   * Checks whether a URL is just pathname and adds missing properties if so.
   * @param {string|urlObj} url
   * @return {urlObj}
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
