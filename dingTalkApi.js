var request = require('request');

var sendPicture = function(picUrl) {
	console.log(picUrl);
    // return;
    var options = {
        method: 'post',
        url: 'https://oapi.dingtalk.com/robot/send?access_token=c88befc4e1bc5ef9e289fd6e5891d37bf6f402f3d2aafdb8d0519f46786d23e7',
        json: true,
        headers: {
            'content-type': 'application/json'
        },
        body: {
            "msgtype": "link", 
            "link": {
                "text": "weixin",
                "title": "weixin", 
                "picUrl": picUrl,
                "messageUrl": picUrl
            }
        }
    };

    var r = request(options, function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });
}

var sendText = function(text) {
    //console.log(qrcode);
    //return;
    var options = {
        method: 'post',
        url: 'https://oapi.dingtalk.com/robot/send?access_token=c88befc4e1bc5ef9e289fd6e5891d37bf6f402f3d2aafdb8d0519f46786d23e7',
        json: true,
        headers: {
            'content-type': 'application/json'
        },
        body: {
            "msgtype": "text", 
            "text": {
              "content": text
            },
            "at": {} 
        }
    };

    var r = request(options, function (error, response, body) {
        if (!error) {
            //console.log(body);
        }
    });
};

module.exports = {
	sendPicture: sendPicture,
	sendText: sendText
};