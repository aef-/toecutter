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

* `url` - *string|string[]* Can be array or string, must
