'use strict';
var AWS = require("aws-sdk");

var request = require('request');
var AWS = require("aws-sdk");
var moment = require('moment');


module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.s3postprocess = (event, context, callback) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;
    const msg = `.png object has been ${record.eventName}: ${filename} (${filesize} bytes)`
    console.log(record);
    var sns = new AWS.SNS();
    var params = {
        Message: msg,
        Subject: `S3 Object Alert: ${record.eventName}`,
        TopicArn: process.env.snsTopicArn
    };
    sns.publish(params, context.done);
  });
};

module.exports.watchdog = (event, context, callback) => {
  const url = "https://gmail.com";
  request(, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

        if(response.statusCode!=200){
              var sns = new AWS.SNS();
              var params = {
                  Message: `Your url is unreachable ${url}`,
                  Subject: `Watchdog alert`,
                  TopicArn: process.env.snsTopicArn
              };
              sns.publish(params, context.done);

        }else{
          console.log('Everything is fine!');
        }
        // callback(null, {
        //     statusCode: response && response.statusCode,
        //     headers: {
        //         "x-custom-header": "My Header Value"
        //     },
        //     body: JSON.stringify({ip:event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp,
        //         body: body})
        // });
    });




}