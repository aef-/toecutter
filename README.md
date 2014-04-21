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
  * fail
  * start.request

### Page
```page``` is passed to each event.
  * getRequest( )
  * isFetched( )
  * isRunning( )
  * getTimeToFinish( )
  * getUrl( )
  * getAttempts( )


## Examples
See [examples](https://github.com/aef-/toecutter/tree/develop/examples).

## TODO
  * Documentation!
  * Add queuing method which cleans/resolves the URL (checkout cheerio example).
  * Throttling system.
  * Tests!
  * Add support for robot.txt
  * Option to run synchronously up to N sites
  * Multi-core concurrency support
  * Add support for link depth
  * Better failure support options/handling of success/fails.
  * Ability to save and load links traversed and queue
