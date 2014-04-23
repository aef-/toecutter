toecutter
=========

A little Node spider.

## API

### ToeCutter(options)

* `retries` - Number of attempts to retry a site should the request fail (either through error, timeout or non-200 status).
* `timeBetweenRetry` - Time in milliseconds between retry for failed requests.
* `timeBetweenRequests` - Time in milliseconds between running queued items.
* `requestOptions` - See [node-request](https://github.com/mikeal/request).

#### queue(url)

Queue up a url or an array of urls. Provides *no* checks.

* `url` - *string|string[]* Can be array or string, must be proper URL.

#### start()
#### stop()
#### run(url)

### Page(options)

#### getRequest()
#### isFetched()
#### isRunning
#### getTimeToFinish()
#### getUrl()
#### getAttempts()

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
