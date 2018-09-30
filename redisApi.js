var redis = require('redis');
var Promise = require('promise');

var client = redis.createClient({
	host: '123.207.227.87',
	password: '@GGcyw2015'
});

client.on("error", function (err) {
    console.log("Error " + err);
});

var test = function() {
	client.set("testkey", "test is ok");
	client.get('testkey', function(err, res) {
		console.log(res);
	});
}

var setProduct = function(id, product) {
	var key = 'miniOperation:product:changed:' + id;
	var value = JSON.stringify(product);
	client.set(key, value, 'EX', 60 * 60 * 24);
}

var getProduct = function(id) {
	return new Promise(function(resolve, rej) {
		var key = 'miniOperation:product:changed:' + id;
		client.get(key, function(err, res) {
			var product = JSON.parse(res);
			resolve(product);
		});
	});
}

module.exports = {
	defautClient: client,
	setProduct: setProduct,
	getProduct: getProduct,
	test: test
};