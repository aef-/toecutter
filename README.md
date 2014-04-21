toecutter
=========

A little Node spider.

## Configuration
```
  //Defaults are listed
  ToeCutter( {
    retries: 3 //times to retry a site should it not return 200,
    timeBetweenRetry: 5000, //time in ms between retry for failed requests
    timeBetweenRequests: 1000, //time in ms between running the next link queued
    requestOpts: { } //see [node-request](https://github.com/mikeal/request)
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
  * $ - instance of [Cheerio](https://github.com/cheeriojs/cheerio) for DOM manipulation


## Examples
See [examples](https://github.com/aef-/toecutter/tree/develop/examples).

## TODO
  * Make url finding more configurable.
  * Throttling system.
  * Tests!
  * Add support for robot.txt
  * Option to run synchronously up to N sites
  * Concurrency support
  * Add support for link depth
  * Better failure support options/handling of success/fails.
  * Ability to save and load links traversed and queue
