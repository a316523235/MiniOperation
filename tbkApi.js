var request = require('request');
var Promise = require('promise');
ApiClient = require('./taobaoSDK.js').ApiClient;

const client = new ApiClient({
    'appkey':'24770835',
    'appsecret':'d4ada29cd12178c7a671db37067258bc',
    'url':'http://gw.api.taobao.com/router/rest'
});

// function getTkl() {
// 	client.execute('taobao.tbk.tpwd.create',
//     {
//         'text':'优惠商品信息',
//         'url':'https://uland.taobao.com/coupon/edetail?e=I4r1v6MHasEGQASttHIRqVMGpsDWnkGJFxM9gJqbl20ujibHHIoHzCIfQrFfeguDSLljtHh26S8Qgx6SFRn59JQ5wfGz%2Fu%2BN8M3Y33hPSSQVF%2BLQAJXviHvlGh6jLO1J&traceId=0bba613b15161111527882166e',
//     }, function (error,response) {
//         if(!error)
//             console.log(response);
//         else
//             console.log(error);
//     });
// }

// function getPrice(mallProductID) {
// 	client.execute('taobao.tbk.item.info.get',
//     {
//         'fields':'reserve_price, zk_final_price, pic_url',
// 		'num_iids': mallProductID
//     }, function (error,response) {
//         if(!error) {
//         	console.log(response.results.n_tbk_item[0]);
//             console.log(response.results.n_tbk_item[0].zk_final_price);
//         }
//         else
//             console.log(error);
//     });
// }


var getYsdUrl = function(mallProductID, mmid) {
  pid = 'mm_119516089_19314614_312936238';
  var session = '70002101034190379705b87533b0744f93e68ea97edd3e1461b4430b423f5451b005c2c1598668909';
  //return 'http://api.yishoudan.com/newapi/gysq/taobao_user_id/409468254/num_iid/' + mallProductID + '/pid/' + mmid;
  //return 'http://api.yishoudan.com/newapi/gysq/taobao_user_id/1598668909/num_iid/' + mallProductID + '/pid/' + mmid;
  //return 'http://api.yishoudan.com/ysd_api.php?item_id=' + mallProductID + '&adzone_id=312936238&site_id=19314614&session=70002101150903585ce820156f1ed622f1f749a7cae395ebb98f8c4179993d1d62febfc1598668909';
  return 'http://gy.yishoudan.com/ysd_api.php?item_id=' + mallProductID + '&pid=' + pid + '&session=' + session;
}

var getThreeUrl = function(msg) {
	return new Promise(function(resolve, rej) {
		try {
			var isTipContent = msg.indexOf("http") > -1 && (msg.indexOf('手淘') > -1 || msg.indexOf('手机淘宝') > -1) && msg.indexOf('点击链接') > -1;
			if(isTipContent) {
				var threeUrl = msg.substring(msg.indexOf("http"), msg.indexOf("点击链接")).trim();
				if(threeUrl) {
					resolve({"threeUrl": threeUrl});
				} else {
					rej("【常规】获取微信消息中的链接失败");
				}
			} else {
				rej("【正常】该微信消息不是淘宝商品");
			}
		} catch(e) {
			rej("【常规】获取微信消息中的链接失败");
		}
	});    
    //console.log("(接口)第三方链接：" + threeUrl + ", 是否相等：" + (threeUrl == "http://m.tb.cn/h.ZZtFUer?cv=3Sw8GMsraA&sm=523d5e"));
    //return threeUrl;
}

var checkAndReturnTaoBaoShare = function(msg) {
	return new Promise(function(resolve, rej) {
		try {
			//msg = msg.replace(new RegExp("《","gm"), '￥');
			//var isTipContent = msg.indexOf('淘') > -1 &&  (msg.indexOf('￥') > -1 || msg.indexOf('《') > -1 || msg.indexOf('《') > -1  || msg.indexOf('€') > -1);
			var isTipContent = msg.indexOf('淘') > -1;
			if(isTipContent) {
				resolve({"taobaoShareMsg": msg});
			} else {
				rej("【正常】该微信消息不是淘宝商品");
			}
		} catch(e) {
			rej("【常规】判断微信消息不是淘宝商品失败");
		}
	});    
    //console.log("(接口)第三方链接：" + threeUrl + ", 是否相等：" + (threeUrl == "http://m.tb.cn/h.ZZtFUer?cv=3Sw8GMsraA&sm=523d5e"));
    //return threeUrl;
}

var getMallProductID = function(shortUrl) {
	return new Promise(function(resolve, rej) {
		request.get(shortUrl, function(err, res, body) {
			if(err) {
				rej("【接口】获取真实链接失败" + err);
			} else {
				try {
					var mallProductID = body.match(/[\?&]id=(\d+)/g)[0].match(/\d+/)[0];
					//console.log("(接口)获取商品ID：" + mallProductID);
					resolve({"mallProductID": mallProductID});
				} catch(e) {
					//console.log(body);
					rej("【接口】获取商品ID失败");
				}
			}
		});
	});
}

var getMallProductIDByTkl = function(tklContent) {
	return new Promise(function(resolve, rej) {
		client.execute('taobao.wireless.share.tpwd.query', {
		    'password_content': tklContent
		}, function(error, response) {
		    if (error) {
		    	rej("【接口】请求解析淘口令失败, " + JSON.stringify(error));
		    } else {
		    	try {
	    			if(response && response.url) {
		    			var pattern = /[?&]id=(\d+)&?/i;
		    			var arr = response.url.match(pattern);
	    				if(arr == null || arr.length != 2) {
    						pattern = /i(\d+).htm/i;
							arr = response.url.match(pattern);
							if(arr == null || arr.length != 2) {
	    						rej("【接口】请求解析淘口令结果地址正则匹配失败, \n口令：" + tklContent + ", \n返回结果：" + JSON.stringify(response));
    						} else {
    							resolve({"mallProductID": arr[1]});
    						}
	    				} else {
	    					resolve({"mallProductID": arr[1]});
	    				}
			    	} else {
			    		rej("【接口】请求解析淘口令结果地址不存在: " + JSON.stringify(response));
			    	}
		    	} catch(e) {
					//console.log(body);
					rej("【接口】请求解析淘口令失败" + e);
				}
		    	
		    }
		})
	})

	
}


var getProductInfoBySdk = function(mallProductID) {
	return new Promise(function(resolve, rej) {
		client.execute('taobao.tbk.item.info.get',
	    {
	        'fields':'title, reserve_price, zk_final_price, pict_url',
			'num_iids': mallProductID
	    }, function (error,response) {
	    	if(error) {
	    		if(error.code == 15 && error.sub_code == '50001') {
	    			rej("【提示】该商品无优惠信息, 建议人工二次确认, 商品ID: + ' + mallProductID + ', ...... " + JSON.stringify(error, null, 2));
	    		} else {
	    			rej("【接口】请求商品信息SDK失败" + mallProductID);
	    		}
	    	} else {
	    		if(response.results.n_tbk_item && response.results.n_tbk_item.length > 0) {
	    			var item = response.results.n_tbk_item[0];
	    			//console.log("(接口)获取商品信息，价格：" + item.zk_final_price + "图片：" + item.pict_url);
	    			resolve({"title": item.title, "price": item.zk_final_price, "picUrl": item.pict_url});
	    		} else {
	    			rej("【提示】该商品无优惠信息");
	    		}
	    	}
	    });
	})
}

var getCommissionInfoByYsd = function(yishoudanUrl) {
	return new Promise(function(resolve, rej) {
		request.get(yishoudanUrl, function(err, res, body) {
			if(err) {
				rej("【接口】请求Ysd转链失败" + err);
			} else {
				var data = {};
				try {
					console.log('come here');
					data = JSON.parse(body).tbk_privilege_get_response.result.data;
					//if(data && data.url) {
					if(data && data.coupon_click_url) {
						//resolve({url: data.url, rate: data.max_commission_rate, canUsedPrice: data.info1, quanValue: data.quan});
						//{"category_id":50022517,"coupon_click_url":"https:\/\/uland.taobao.com\/coupon\/edetail?e=E2QcweLePzYGQASttHIRqbLXk8SFYQpP468essHalZhkrBtp0jqDEDOzByARy1khXiJ0CWofLpLkZct%2FkzjlML9fwBwwUiqluhHkHy0c%2F1f5P4Q5WAVSX27PVn13QcLNcISolD8QJ4oZ69MURWX%2F6Q%3D%3D&traceId=0bba16b415247584272712895","coupon_end_time":"2018-05-31","coupon_info":"满200元减50元","coupon_remain_count":83,"coupon_start_time":"2018-04-11","coupon_total_count":100,"coupon_type":3,"item_id":566682571042,"max_commission_rate":"5.00"}
						var canUsedPrice = null, quanValue = null;
						if(data.coupon_info)
						{
							var arr = data.coupon_info.match(/\d+/g);
							if(arr && arr.length == 2) {
								canUsedPrice = arr[0];
								quanValue = arr[1];
							}
						}
						resolve({url: data.coupon_click_url, rate: data.max_commission_rate, canUsedPrice: canUsedPrice, quanValue: quanValue});
					} else {
						rej("【接口】转链json信息中未包含链接地址，原始信息" + body);
					}
				} catch (e) {
					rej("【接口】转链信息转json失败，原始信息" + body);
				}

			}
		});
	});
}

var getTklBySdk = function (url, picUrl) {
	return new Promise(function(resolve, rej) {
		client.execute('taobao.tbk.tpwd.create',
	    {
	        'text':'优惠商品信息',
	        'url': url,
	        'logo': picUrl
	    }, function (error,response) {
	    	if(error) {
	    		rej("【接口】请求淘口令SDK失败" + error);
	    	} else {
	    		try {
	    			var tkl = response.data.model;
	    			resolve({"tkl": tkl});
	    		} catch(e) {
	    			rej("【接口】获取淘口令失败, 原始信息" + JSON.stringify(response));
	    		}
	    	}
	    });
	});
}

//var lastData = { "title": title, "price": price, "quanValue": quanValue, "tkl": tkl, "rate": rate, "canUsedPrice": canUsedPrice };
var getLastResponMsg = function(data) {
	try {
		var lastInfo = { "lastMsg": "", "lastSelfMsg": "" };
		lastInfo.lastMsg = data.title + "\n";
		lastInfo.lastSelfMsg = data.title + "\n";

		lastInfo.lastMsg += "【在售价】 " + data.price + "元\n";
		lastInfo.lastSelfMsg += "【在售价】 " + data.price + "元\n";

		if(data.quanValue) {
			var lastPrice = (data.price - data.quanValue).toFixed(2);
			if(lastPrice >= 0) {
				lastInfo.lastMsg += "【券后价】 " + lastPrice + "元\n";
				lastInfo.lastSelfMsg += "【券后价】 " + lastPrice + "元\n";
			} else {
				console.log("【常规】券后价小于0");
			}
		}


		//完整提示(仅自己)
		if(data.quanValue > 0) {
			lastInfo.lastSelfMsg += "【券面值】 " + data.quanValue + "元\n";
			lastInfo.lastSelfMsg += "【起用价】 " + data.canUsedPrice + "元\n";
		}
		lastInfo.lastSelfMsg += "【佣比例】 " + data.rate + "%\n";


		lastInfo.lastMsg += "------------\n";
		lastInfo.lastSelfMsg += "------------\n";

		lastInfo.lastMsg += "复制这条信息，" + data.tkl + " 打开【手机淘宝】即可查看";
		lastInfo.lastSelfMsg += "复制这条信息，" + data.tkl + " 打开【手机淘宝】即可查看";

		return lastInfo;
	} catch(e) {
		console.log("【常规】数据转换为微信答复信息失败");
	}
}

var getLastInfo = function(weixinMsg, mmid) {
	return new Promise(function(resolve, rej) {
		var mallProductID = "";
		var yishoudanUrl = "";
		var picUrl = "";
		var title = "", price = "", quanValue = "", tkl = "", canUsedPrice = "", rate = "";
		// getThreeUrl(weixinMsg).then(function(data) {
		// 	//{"threeUrl": threeUrl}
		// 	console.log("提取微信消息：" + JSON.stringify(data));
		// 	console.log("\n");
		// 	return getMallProductID(data.threeUrl)
		// })
		checkAndReturnTaoBaoShare(weixinMsg).then(function(data) {
			//{"taobaoShareMsg": msg}
			console.log("提取微信消息：" + JSON.stringify(data));
			console.log("\n");
			return getMallProductIDByTkl(data.taobaoShareMsg);
		})
		.then(function(data) {
			console.log("微信信息：" + weixinMsg + "\n");
			//{"mallProductID": mallProductID}
			console.log("商品ID：" + JSON.stringify(data));
			console.log("\n");
			mallProductID = data.mallProductID;
			yishoudanUrl = getYsdUrl(mallProductID, mmid);
			console.log("yishoudan链接：" + yishoudanUrl);
			console.log("\n");
			return getProductInfoBySdk(mallProductID);
		})
		.then(function(data) {
			//{"title": item.title, "price": item.zk_final_price, "picUrl": item.pict_url}
			console.log("商品信息" + JSON.stringify(data));
			console.log("\n");
			title = data.title;
			price = data.price;
			picUrl = data.picUrl;
			return getCommissionInfoByYsd(yishoudanUrl);
		})
		.then(function(data) {
			//{url: data.url, rate: data.max_commission_rate, canUsedPrice: data.info1, quanValue: data.quan}
			console.log("佣金信息" + JSON.stringify(data));
			console.log("\n");
			quanValue = data.quanValue;
			canUsedPrice = data.canUsedPrice;
			var newRate = Math.floor((data.rate.replace("%", "") * 0.5) * 10) / 10;
		    //rate = data.rate;
			rate = newRate;
			return getTklBySdk(data.url, picUrl);
		})
		.then(function(data) {
			//{"tkl": tkl})
			console.log("淘口令信息：" + JSON.stringify(data));
			console.log("\n");
			tkl = data.tkl;

			var lastData = { "title": title, "price": price, "quanValue": quanValue, "tkl": tkl, "rate": rate, "canUsedPrice": canUsedPrice };
			var lastInfo = getLastResponMsg(lastData);
			//{ "lastMsg": "", "lastSelfMsg": "" }
			//console.log(lastMsg);
			//console.log("\n");
			resolve({"lastMsg": lastInfo.lastMsg, "lastSelfMsg": lastInfo.lastSelfMsg});
		})
		.catch(function(msg) {
			rej(msg);
		})
	});
}

var getLastInfoByID = function(mallProductID,  baseInfo) {
	return new Promise(function(resolve, rej) {
		var yishoudanUrl = "";
		var picUrl = "";
		var title = "", price = "", quanValue = "", tkl = "", canUsedPrice = "", rate = "";

		yishoudanUrl = getYsdUrl(mallProductID, '');
		console.log(yishoudanUrl);

		var getInfoFnc;
		if(baseInfo && baseInfo.title && baseInfo.price && baseInfo.picUrl) {
			getInfoFnc = function(param) { return new Promise(function(resolve, rej) { resolve(baseInfo); }) }
		} else {
			getInfoFnc = getProductInfoBySdk;
		}
		
		getInfoFnc(mallProductID)
		.then(function(data) {
				//{"title": item.title, "price": item.zk_final_price, "picUrl": item.pict_url}
				console.log("商品信息" + JSON.stringify(data));
				console.log("\n");
				title = data.title;
				price = data.price;
				picUrl = data.picUrl;
				return getCommissionInfoByYsd(yishoudanUrl);
		})
		.then(function(data) {
			//{url: data.url, rate: data.max_commission_rate, canUsedPrice: data.info1, quanValue: data.quan}
			console.log("佣金信息" + JSON.stringify(data));
			console.log("\n");
			quanValue = data.quanValue;
			canUsedPrice = data.canUsedPrice;
			var newRate = Math.floor(data.rate.replace("%", "") * 10) / 10;
		    //rate = data.rate;
			rate = newRate;
			return getTklBySdk(data.url, picUrl);
		})
		.then(function(data) {
			//{"tkl": tkl})
			console.log("淘口令信息：" + JSON.stringify(data));
			console.log("\n");
			tkl = data.tkl;

			var lastData = {
		      "title": title,
		      "price": price,
		      "quanValue": quanValue,
		      "tkl": tkl,
		      "rate": rate,
		      "canUsedPrice": canUsedPrice,
		      "sortTitle": (baseInfo && baseInfo.sortTitle) ? baseInfo.sortTitle : "",
		      "pic": picUrl,
		      "introduce": (baseInfo && baseInfo.introduce) ? baseInfo.introduce : ""
		    };

			resolve(lastData);
		})
		.catch(function(msg) {
			rej(msg);
		})
	});
}

function test1(weixinMsg, mmid) {
	getLastInfo(weixinMsg, mmid).then(function(data) {
		//{"lastMsg": lastMsg}
		console.log("最终消息：" + JSON.stringify(data.lastMsg));
		console.log("\n");
	}).catch(function(msg) {
		console.log(msg);
	})
}

module.exports = {
    getLastInfo: getLastInfo,
    getLastInfoByID: getLastInfoByID,
    checkAndReturnTaoBaoShare: checkAndReturnTaoBaoShare,
    getMallProductIDByTkl: getMallProductIDByTkl

};


//getRidrectUrl("http://m.tb.cn/h.BxTYnx");
//getTkl();
//getPrice('562873272057');
//getPrice('525922860993');

//var weixinMsg = "@吴豆子 @吴豆子 我剁手都要买的宝贝（小鹿叮叮超柔婴儿纸尿裤L120片男女宝宝透气干爽尿不湿批发包邮），";
//weixinMsg +=  "快来和我一起瓜分红包】http://m.tb.cn/h.ZZtFUer?cv=3Sw8GMsraA&sm=523d5e 点击链接，再选择浏览器打开；或复制这条信息，打开👉手机淘宝👈￥3Sw8GMsraA￥";
//getLastInfo(weixinMsg, "mm_25794195_41744417_186800375");
//test1(weixinMsg, "mm_25794195_41744417_186800375");