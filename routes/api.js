var express = require('express');
var router = express.Router();
var Promise = require('promise');
var tbkApi = require('./../tbkApi.js');
var mmApi = require('./../mmApi.js');
var dingTalkApi = require('./../dingTalkApi.js');
var redisApi = require('./../redisApi.js');

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


router.post('/tkltoid', function(req, res, next) {
  console.log(req.body);
  var body = req.body;
  var sourceContent = body.content;
  var result = { status: false, msg: "", content: "" };

  tbkApi.checkAndReturnTaoBaoShare(sourceContent)
  .then(function(data) {
    //{"taobaoShareMsg": msg}
    console.log(data);
    console.log("1");
    return tbkApi.getMallProductIDByTkl(data.taobaoShareMsg);
  })
  .then(function(data) {
    console.log("2");
    //{"mallProductID": mallProductID}
    result.status = true;
    result.content = data.mallProductID;
    res.json(result);
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
  })
});



router.get('/info', function(req, res, nex) {
  if(req.query.id) {
    redisApi.getProduct(req.query.id).then(function(data) {
      if(data) {
        res.json({status:true, content: data});
      } else {
        tbkApi.getLastInfoByID(req.query.id).then(function(data) {
          redisApi.setProduct(req.query.id, data);
          res.json({status: true, content: data});
        }).catch(function(err) {
          res.json({status: false, content: null, msg: '未查询到优惠信息'});
        });
      }
    })
  } else {
    res.json({status: true, content: null, msg: '请传入id'})
  }
});

router.get('/protocol', function(req, res, nex) {
  res.json({status: true, content: req.protocol, msg: '协议'})
});

module.exports = router;
