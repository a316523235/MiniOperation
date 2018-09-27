var Promise = require('promise');
var request = require('request');
var fs = require('fs');
var tbkApi = require('./tbkApi.js');

/*{
    "data": {
        "api_type": "领券优惠v1.4",
        "update_time": "2018/09/27 15:05:49",
        "total_num": 100,
        "update_content": "全站接口已升级为分页模式，每页200条数据，分页参数：&page"
    },
    "result": [
    	{
            "ID": "16516296",
            "GoodsID": "575221061696",
            "Title": "卡帝乐鳄鱼男士袜子秋冬纯棉中筒防臭薄款吸汗商务全棉短袜男夏季",
            "D_title": "国际大牌！【卡帝乐鳄鱼】纯棉男女袜子3双",
            "Pic": "https://img.alicdn.com/imgextra/i3/3242363773/O1CN011dk4okNvK27EI7P-3242363773.jpg",
            "Cid": "10",
            "Org_Price": "25.90",
            "Price": 5.9,
            "IsTmall": "1",
            "Sales_num": "40050",
            "Dsr": "4.8",
            "SellerID": "2881038408",
            "Commission": "30.00",
            "Commission_jihua": "30.00",
            "Commission_queqiao": "0.00",
            "Jihua_link": "",
            "Que_siteid": "0",
            "Jihua_shenhe": "0",
            "Introduce": "【拍前2个选项】成本超高中筒袜，非船袜！经典品牌卡帝乐鳄鱼，线下2000多件连锁店~100%纯棉吸湿排汗速干面料，国家颁发专利！真正舒适透气防臭，穿做舒服，远离脚臭！【赠运费险】",
            "Quan_id": "531202f40e724c8983fe87794cd98c5c",
            "Quan_price": "20.00",
            "Quan_time": "2018-09-29 23:59:59",
            "Quan_surplus": "19800",
            "Quan_receive": "70200",
            "Quan_condition": "25",
            "Quan_m_link": null,
            "Yongjin_type": "3",
            "Quan_link": "https://uland.taobao.com/quan/detail?sellerId=2881038408&activityId=531202f40e724c8983fe87794cd98c5c"
        }
    ]
 */
var getTop100 = function() {
	return new Promise(function(resolve, rej) {
		var uri = 'http://api.dataoke.com/index.php?r=Port/index&type=top100&appkey=d48df20312&v=2';
		request.get(uri, function(err, res, body) {
			if(err) {
				rej({msg: "获取大淘客top100失败"});
				return;
			}

			try{
				var jsn = JSON.parse(body);
				fs.writeFileSync('./data/top100.json', JSON.stringify(jsn, null, 2));
				resolve(jsn);
			}
			catch(e) {
				rej("大淘客top100结果json序列化失败, 原因" + e);
			}
			
		});
	});
}


//{okGoods: okGoods, errors: allError}
var changeTop100 = function(products) {
	return new Promise(function(resolve, rej) {
		try {
			var i = -1;
			var okGoods = [];
			var allError = [];
			var t = setInterval(function() {
				i++;
				if(i >= products.length) {
					clearInterval(t);
					resolve({okGoods: okGoods, errors: allError});
					return;
				}
				var product = products[i];

				console.log('商品ID: ' + product.GoodsID);

				tbkApi.getLastInfoByID(product.GoodsID).then(function(data) {
					data.sortTitle = product.D_title;
					data.pic = product.Pic;
					data.updateTime_ts = new Date().getTime();
					data.updateTime = new Date().toLocaleString();
					console.log(data);
					okGoods.push(data);
				}).catch(function(msg) {
					allError.push(msg);
					console.log('出错:' + msg);
				});
			}, 10000)

		} catch(e) {
			rej('转链100个失败');
		}
		
	})
}


var getLastInfo = function() {
	return new Promise(function(resolve, rej) {
		getTop100()
		.then(function(data) {
			var products = [];
			for(var i = 0; i < Math.min(1, data.result.length); i++) {
				products.push(data.result[i]);
			}

			var okProducts = [];
			var i = 0;
			return changeTop100(products, okProducts, i);
		})
		.then(function(data) {
			fs.writeFileSync('./data/top100_ok.json', JSON.stringify(data, null, 2));
			resolve(data);
		})
		.catch(function(msg) {
			rej(msg);
		})
	});
}

module.exports = {
    getLastInfo: getLastInfo
};

