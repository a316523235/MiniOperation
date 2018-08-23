var express = require('express');
var router = express.Router();
var Promise = require('promise');
var request = require('request');

router.get('/movie/in_theaters', function(req, res, next) {
	var uri = 'https://api.douban.com/v2/movie/in_theaters?city=' + req.query.city + '&start=' + req.query.start + '&count=' + req.query.count;
	request.get(uri, function(err, res_1, body) {
		if(err) {
			res.json({"err": err});
		}
		res.json(JSON.parse(body));
	});
});

router.get('/movie/coming_soon', function(req, res, next) {
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