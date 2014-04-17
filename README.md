toecutter
=========

A little Node spider.

## Configuration
```
  //Defaults are listed
  ToeCutter( {
    retires: 3 //times to retry a site should it not return 200,
    timeBetweenRetry: 5000, //time in ms between retry for failed requests
    timeBetweenRequests: 5000, //time in ms between running the next link queued
    goOutside: false, //follow outgoing links
    requestOpts: { } //see [[node-request]](https://github.com/mikeal/request)
  } );
```

## API
### ToeCutter
  * queue( url | url[ ] )
  * start( )
  * stop( )
  * run( url )
#### Events
  * fetch
  * start.request
  * end.request

### Page
```page``` is passed to each event.
  * getRequest( )
  * isFetched( )
  * isRunning( )
  * getTimeToFinish( )
  * getLinks( )
  * getUrl( )
  * getAttempts( )
  * $ - instance of [[Cheerio]](https://github.com/cheeriojs/cheerio) for DOM manipulation


## Examples
```
var tc = new ToeCutter( {
  timeBetweenRequests: 1000
} );

tc.queue( [ 'http://yahoo.com' ] );

tc.on( 'fetch', function( page ) {
  console.info( "Title: %s", page.$( 'title' ) );
  console.info( "Page took %d seconds to finish", page.getTimeToFinish( ) / 1000 );
} );

//You can also use something like trumpet to parse streams...
tc.on( 'start.request', function( page ) {
  var length = 0;
  page.getRequest( ).pipe( through( function( data ) {
    length += data.length;
    if( length >= 3000 )
      page.getRequest( ).abort( );
  } ) );
} );


## TODO
  * Make url finding more configurable.
  * Maybe remove cheerio and link finding.
  * Throttling system.
  * Tests!
  * Add support for robot.txt
  * Option to run synchronously up to N sites
  * Concurrency support
  * Add support for link depth
  * Better failure support options/handling of success/fails.
  * Ability to save and load links traversed and queue
