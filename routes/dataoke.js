var express = require('express');
var router = express.Router();
var Promise = require('promise');
var request = require('request');
var fs = require('fs');
var dataokeApi = require('./../dataokeApi.js');


router.get('/build/top100', function(req, res, next) {
	dataokeApi.getTop100().then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
	res.json({msg: '开始生成top100数据'});
});

router.get('/build/all', function(req, res, next) {
	dataokeApi.getTotal(req.query.page).then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
	res.json({msg: '开始生成total数据'});
});

router.get('/build', function(req, res, next) {
	if(!req.query.page) {
		req.query.page = 5;
	}

	dataokeApi.getTop100().then(function(data) {
		console.log(JSON.stringify(data, null, 2));
		return dataokeApi.getTotal(req.query.page);
	}).then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
	res.json({msg: '开始生成数据'});

});




router.get('/top100', function(req, res, next) {
	if(!fs.existsSync('./data/top100.json')) {
		res.json({msg: '不存在top100.json'});
		return;
	}

	var top100 = require('./../data/top100.json');
	var okGoods = top100.result;

	if(!req.query.start) {
		req.query.start = 0;
	}
	if(!req.query.count) {
		req.query.count = 10;
	}


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
});

router.get('/all', function(req, res, next) {
	if(!fs.existsSync('./data/total.json')) {
		res.json({msg: '不存在total.json'});
		return;
	}

	var total = require('./../data/total.json');
	var okGoods = total.result;

	if(!req.query.start) {
		req.query.start = 0;
	}
	if(!req.query.count) {
		req.query.count = 10;
	}

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
});


module.exports = router;