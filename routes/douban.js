var express = require('express');
var router = express.Router();
var Promise = require('promise');
var request = require('request');

router.get('/movie/in_theaters', function(req, res, next) {
	var uri = 'https://api.douban.com/v2/movie/in_theaters?city=' + req.query.city + '&start=' + req.query.start + '&count=' + req.query.count;
	request.get(uri, function(err, res, body) {
		if(err) {
			res.send(err);
		}
		res.send(body);
	});
});

router.get('/movie/coming_soon', function(req, res, next) {
	var uri = 'https://api.douban.com/v2/movie/coming_soon?city=' + req.query.city + '&start=' + req.query.start + '&count=' + req.query.count;
	request.get(uri, function(err, res, body) {
		if(err) {
			res.send(err);
		}
		res.send(body);
	});
});

module.exports = router;