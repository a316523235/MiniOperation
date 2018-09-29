var Promise = require('promise');
var tbkApi = require('./tbkApi.js');
var mmApi = require('./mmApi.js');
var dingTalkApi = require('./dingTalkApi.js');
	var dataokeApi = require('./dataokeApi.js');

function testTbkApi() {
	//var weixinMsg = " 【我剁手都要买的宝贝（LED吸顶灯长方形遥控大气客厅灯具现代简约卧室灯阳台灯餐厅灯饰），快来和我一起瓜分红I包】http://www.dwntme.com/h.Z0XJr6x 点击链接，再选择浏览器打开；或复制这条信息￥efM20lqldSe￥后打开👉手淘👈";
	//var weixinMsg = "【我剁手都要买的宝贝（bebivita婴儿床实木无漆宝宝bb床摇篮床多功能儿童新生儿拼接大床），快来和我一起瓜分红I包】，复制这条信息￥zjHn0ofLJFg￥后打开👉手淘👈";
	//var weixinMsg = "【多功能衣架子挂衣架家用折叠抖音收纳神器防滑省空间魔术晾衣服架】，復·制这段描述€EA6Qb2SGJMs€后到👉淘♂寳♀👈";
	var weixinMsg = "【【三只松鼠_乳酸菌小伴侣面包520gx2箱】营养早餐口袋蛋糕零食】，復·制这段描述￥VjgcbfSI3pr￥后到👉淘♂寳♀👈";
	var mmid = "mm_119516089_19314614_312936238";
	//getLastInfo(weixinMsg, "mm_25794195_41744417_186800375");
	//test1(weixinMsg, "mm_25794195_41744417_186800375");
	tbkApi.getLastInfo(weixinMsg, mmid).then(function(data) {
		//{"lastMsg": lastMsg}
		//console.log("最终消息：" + JSON.stringify(data));
		console.log("最终消息：" + data.lastMsg);
		console.log("\n\n");
		console.log("最终自己消息：" + data.lastSelfMsg);
		console.log("\n");
	}).catch(function(msg) {
		console.log(msg);
	})
}

function testTbkApi2() {
	var productID = '576041569648';
	tbkApi.getLastInfoByID(productID).then(function(data) {
		//{"lastData": lastData}
		console.log("最终消息：" + JSON.stringify(data.lastData, null, 2));
		console.log("\n");
	}).catch(function(msg) {
		console.log(msg);
	})
}

function testMmApi() {
	console.log(mmApi.getMmByWeixinName("冰"));
	//console.log(mmApi.getMmByWeixinMsg("@吴豆子 【我剁手都要买的宝"));
	console.log(mmApi.getMmByWeixinGroup("一点都不黑"));
	console.log(mmApi.addUserByMsg("我要买东西", "testUser1"));
	console.log(mmApi.addGroupByMsg("我要买东西","testGroup1"));
	//console.log(mmApi.addGroup("我要买东西", "testGroup2"));
	//console.log(mmApi.removeGroup("testGroup1"));
}

function testDingTalk() {
	dingTalkApi.sendText("测试");
}

function testDataokeApi_top100() {
	dataokeApi.getLastInfo_top100(3).then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
}

function testDataokeApi_total() {
	dataokeApi.getLastInfo_total(1).then(function(data) {
		console.log(JSON.stringify(data, null, 2));
	}).catch(function(msg) {
		console.log(msg);
	})
}




function testTime(argument) {
	setTimeout(function() {
		console.log(1);
	}, 5000)
}

function  testRequire() {
	var t = require.resolve('./dataokeApi.js');
	console.log(t);
	delete require.cache[t];
	console.log(require);
}

//testWeixinApi();
//testTbkApi();
// testTbkApi2();
// testDataokeApi_top100();
testDataokeApi_total();
// testTime();
//testDingTalk();
//testMmApi();
//testRequire();