var ToeCutter = require( '../src/toecutter' ),
    _         = require( 'lodash' ),
    parse     = require( 'url' ).parse,
    cheerio   = require( 'cheerio' );

var tc = new ToeCutter( {
} );

//Starting URLs
tc.queue( [ 'http://www.buzzfeed.com' ] );

tc.on( 'fetch', function( page ) {
  console.info( "Fetched: ", page.getUrl( ).href );

  /* Search for URLs and queue them up */
  try {
    var $ = cheerio.load( page.getBody( ) ),
        $links = $( 'a' ),
        url  = page.getUrl( );

    _.each( $links, function( link ) {
      link = $( link ).attr( 'href' );
      if( ToeCutter.isUrl( link ) ) {
        /* make sure the URL is not just the path.
         * e.g. /foo becomes http://bar.com/foo
         * this method will not overwrite protocol or hostname if it
         * already exists
         */
        link = ToeCutter.relativeTo( url.protocol, url.hostname, link );

        /* ignore outgoing URLs */
        if( link.hostname === url.hostname )
          tc.queue( ToeCutter.formatUrl( link ) );
      }
    }, this );
  } catch( e ) {
    console.error( e.stack );
  }
} );

tc.on( 'start.request', function( page ) {
  console.info( "Started: ", page.getUrl( ).href );
} );

tc.on( 'end.request', function( page ) {
  console.info( "Ended: ", page.getUrl( ).href );
} );

tc.start( );
