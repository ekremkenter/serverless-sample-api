var maxmind = require('maxmind');
var cityLookup = maxmind.openSync('GeoLite2-City.mmdb');

module.exports.getIp = (event, context, callback) => {

    var ip;
    if(event.input && event.input.queryStringParameters.ip){
        ip = event.input.queryStringParameters.ip;
    }else{
        ip = event.input.requestContext.identity.sourceIp;
    }

    var city = cityLookup.get(ip);
    console.log('City:', city);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            ip: ip,
            city: city
        })
    };

    callback(null, response);


}