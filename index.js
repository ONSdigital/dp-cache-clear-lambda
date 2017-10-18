exports.handler = (event, context, callback) => {
    const https = require('https');
    
    const cloudflare_body = {
        purge_everything: true  
    };
    const cloudflare_payload = JSON.stringify(cloudflare_body);
    const cloudflare_options = {
        host: 'api.cloudflare.com',
        path: '/client/v4/zones/' + process.env.CF_ZONE + '/purge_cache',
        port: '443',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(cloudflare_payload),
            'X-Auth-Email': process.env.CF_EMAIL,
            'X-Auth-Key': process.env.CF_TOKEN
        }
    };
    
    const slack_payload_ok = "token=" + process.env.SLACK_TOKEN + "&as_user=true&channel=#support&text=The cache has been cleared automatically.";
    const slack_payload_err = "token=" + process.env.SLACK_TOKEN + "&as_user=true&channel=#support&text=An error occurred while automatically clearing the cache: ";
    const slack_options = {
        host: 'slack.com',
        path: '/api/chat.postMessage',
        port: '443',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    
    var request = https.request(cloudflare_options, (res) => {
        console.log('cloudflare statusCode: ', res.statusCode);

        let payload = slack_payload_ok;
        if(res.statusCode != 200) {
            payload = slack_payload_err;
        }

        // Send a notification to Slack
        const slack_request = https.request(slack_options, (res) => {
            console.log('slack statusCode: ', res.statusCode);
            res.on('data', (d) => {
                console.log(new Buffer(d).toString('ascii'));
            })
        });
        slack_request.on('error', (e) => {
            callback(e, null);
        })
        slack_request.write(payload);
        slack_request.end();
    });
    
    request.on('error', (e) => {
        // Send a error notification to Slack
        const slack_request = https.request(slack_options, (res) => {
            console.log('slack statusCode: ', res.statusCode);
            res.on('data', (d) => {
                console.log(new Buffer(d).toString('ascii'));
            })
        });
        slack_request.on('error', (e) => {
            callback(e, null);
        })
        slack_request.write(slack_payload_err + e);
        slack_request.end();

        // Return the CloudFlare error
        callback(e, null);
    });
    
    request.write(cloudflare_payload);
    request.end();
};