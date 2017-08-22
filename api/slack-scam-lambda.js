const AWS = require('aws-sdk');
const https = require('https'),
    querystring = require('querystring'),
    qs = require('querystring'),
    VERIFICATION_TOKEN = 'IEFmpKgW2s13eAACJ2cEz66X',
    ACCESS_TOKEN = 'xoxp-106440521393-204004691232-229833719734-caeb81a4f5c34f240692354aecfc6257';

console.log('Loading function');

// Verify Url - https://api.slack.com/events/url_verification
function verify(data, callback) {
    if (data.token === VERIFICATION_TOKEN) callback(null, data.challenge);
    else callback("verification failed");
}

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function process(event, callback) {
    // test the message for a match and not a bot
    console.log("event data : " + JSON.stringify(event));

    //make POST request to delete the chat 
    if (event && event.type === 'message' && (event.subtype === 'bot_message' || (event.bot_id && event.bot_id !== ''))) {
        var postData = {
            token: ACCESS_TOKEN,
            channel: event.channel,
            ts: event.ts,
            as_user: 'false'
        };

        slackPost('chat.delete', postData);
    }

    callback(null);
}

function slackPost(methodName, postData) {
    var jsonObject = querystring.stringify(postData);

    var reqPath = '/api/' + methodName;

    console.log("Request path: " + reqPath + " , with data: " + jsonObject);

    // the post options
    var optionspost = {
        host: 'slack.com',
        path: reqPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': jsonObject.length
        }
    };

    var reqPost = https.request(optionspost, function(res) {
        console.log(reqPath + " , statusCode: ", res.statusCode);
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(`BODY: ${chunk}`);
        });
        //context.succeed('Blah');
    });

    reqPost.write(jsonObject);
    reqPost.end();
}

// Lambda handler
exports.handler = (data, context, callback) => {
    console.log('Event Received: ' + data.type);
    switch (data.type) {
        case "url_verification":
            verify(data, callback);
            break;
        case "event_callback":
            process(data.event, callback);
            break;
        default:
            callback(null);
    }
};