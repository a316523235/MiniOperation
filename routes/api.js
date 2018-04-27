var express = require('express');
var router = express.Router();
var Promise = require('promise');
var tbkApi = require('./../tbkApi.js');
var mmApi = require('./../mmApi.js');
var dingTalkApi = require('./../dingTalkApi.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/tkl', function(req, res, next) {
  console.log(req.body);
  var body = req.body;
  var sourceContent = body.content;
  var mm = mmApi.getSelf();
  var result = { status: false, msg: "", content: "" };
  
  tbkApi.getLastInfo(sourceContent, mm.mmid)
  .then(function(data) {
	result.status = true;
	result.content = data.lastSelfMsg;
	res.json(result);
    dingTalkApi.sendText("from小程序：" + data.lastSelfMsg);
  })
  .catch(function(errMsg) {
    if(errMsg.indexOf("【提示】") > -1) {
	  result.status = false;
	  result.msg = data.lastSelfMsg;
	  res.json(result);
      dingTalkApi.sendText("from小程序：提示：" + errMsg);
    } else {
	  result.status = false;
	  result.msg = "未查询到优惠信息";
	  res.json(result);
      console.log(errMsg);
    }
  });
});

module.exports = router;
