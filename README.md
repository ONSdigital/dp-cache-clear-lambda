dp-cache-clear-lambda
=====================

An AWS lambda function which clears the CloudFlare cache and sends a notification to Slack.

### Getting started

* Deploy lambda function to AWS
* Setup CloudWatch event to trigger the function on a timer

### Configuration

| Environment variable | Default | Description
| -------------------- | ------- | -----------
| CF_ZONE              |         | The CloudFlare zone ID
| CF_TOKEN             |         | The CloudFlare API token
| CF_EMAIL             |         | The CloudFlare account email address
| SLACK_TOKEN          |         | A Slack bot user token

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

### License

Copyright © 2016-2017, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
