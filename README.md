toecutter
=========

A little Node spider.

## API

### ToeCutter(options)

* `options` - {object}
* `options.retries` - {number} Number of attempts to retry a site should the request fail (either through error, timeout or non-200 status).
* `options.timeBetweenRetry` - {number} Time in milliseconds between retry for failed requests.
* `options.timeBetweenRequests` - {number} Time in milliseconds between running queued items.
* `options.requestOptions` - {object} See [node-request](https://github.com/request/request).
* `options.throttle` - {object} Throttle download rate at bytes/second. Defaults to 500000.

#### queue(url)

Queue up a url or an array of urls. Provides *no* checks.

* `url`

#### start()

Start crawling the queue.

#### stop()

Finish any requests and stop running.

#### pause()

Pauses all requests and crawl

#### isPaused()

#### resume()

Resumes all requests and crawl

#### run(url)

Run either the passed URL or the next in queue.

#### onFetchFail(page, err)

#### onFetchDone(page)

#### Events

* "fetch" (page) - on successful fetch
* "error" (page, err) - on error (either thrown or status)
* "start.request" (page) - when the request is started

  
### Page(opts)

* `opts`
* `opts.throttle`
* `opts.url`
* `opts.requestOpts` - See [node-request](https://github.com/mikeal/request).

#### fetch()

#### getRequest()

#### getBody()

#### isFetched()

#### isRunning()

#### getTimeToFinish()

#### getUrl()

#### getAttempts()

#### getBytesPerSecond()

#### getBytesReceived()


## Examples
See [examples](https://github.com/aef-/toecutter/tree/develop/examples).

## TODO
* Documentation!
* Add queuing method which cleans/resolves the URL (checkout cheerio example).
* Tests!
* Add support for robot.txt
* Option to run synchronously up to N sites
* Multi-core concurrency support
* Add support for link depth
* Better failure support options/handling of success/fails.
* Ability to save and load links traversed and queue
