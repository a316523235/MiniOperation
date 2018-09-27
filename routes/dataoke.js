var express = require('express');
var router = express.Router();
var Promise = require('promise');
var request = require('request');
var fs = require('fs');
var dataokeApi = require('./../dataokeApi.js');


router.get('/build/top100', function(req, res, next) {
	dataokeApi.getLastInfo().then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
	res.json({msg: '开始生成top100数据'});
});


router.get('/top100', function(req, res, next) {
	if(fs.existsSync('./data/top100_ok.json')) {
		var top100_ok = require('./../data/top100_ok.json');
		var okGoods = top100_ok.okGoods;
		if(req.query.start && req.query.count) {
			var datas = [];
			if(req.query.start >= okGoods.length) {
				datas = [];
			} else {
				var len = Math.min((req.query.start * 1 + req.query.count * 1), okGoods.length);
				for (var i = req.query.start; i < len; i++) {
					datas.push(okGoods[i]);
				}
			}

			res.json({
				count: datas.length,
				start: req.query.start,
				total: okGoods.length,
				subjects: datas
			});
			return;
		} else {
			res.json({msg: '请传入start和count'});
		}
	} else {
		res.json({msg: '不存在top100_ok.json'});
	}
});

router.get('/all', function(req, res, next) {
	var uri = 'https://api.douban.com/v2/movie/coming_soon?city=' + req.query.city + '&start=' + req.query.start + '&count=' + req.query.count;
	request.get(uri, function(err, res_1, body) {
		if(err) {
			res.json({"err": err});
		}
		res.json(JSON.parse(body));
	});
	//res.send("123s");
});


module.exports = router;