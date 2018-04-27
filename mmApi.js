var Promise = require('promise');
var mmConfig = require('./mm.json');
var fs = require('fs');

// const mms = [
// 	{ name: "API1.0__自己", weixinName: "---冰---", weixinUsers: ["冰"], weixinGroups: ["臭傻逼", "亲情聊天","亲情自家群"], mmid: "mm_25794195_41744417_186800375"},
// 	{ name: "API1.0__吴豆子", weixinName: "吴豆子", weixinUsers: ["吴豆子"], weixinGroups: ["一点都不黑","2018桔柚"], mmid: "mm_25794195_41744417_197688880"}
// ];

var getMmByWeixinName = function(weixinName) {
	for(var i = 0; i < mmConfig.mms.length; i++) {
		var mm = mmConfig.mms[i];
		if(mm.weixinUsers.includes(weixinName)) {
			return mm;
		}
	}
	return null;
}

// var getMmByWeixinMsg = function(weixinMsg) {
// 	for(var i = 0; i < mmConfig.mms.length; i++) {
// 		var mm = mmConfig.mms[i];
// 		if(weixinMsg.indexOf("@" + mm.weixinName + " ") > -1) {
// 			return mm;
// 		}
// 	}
// 	return null;
// }

var getSelf = function() {
	return mmConfig.mms[0];
}

var getMmByWeixinGroup = function(weixinGroup) {
	for(var i = 0; i < mmConfig.mms.length; i++) {
		var mm = mmConfig.mms[i];
		if(mm.weixinGroups.includes(weixinGroup)) {
			return mm;
		}
	}
	return null;
}

var addGroupByMsg = function(weixinMsg, weixinGroup) {
	if(weixinMsg == "我要买东西") {
		return addGroup(weixinGroup);
	}
	return null;
}

var addGroup = function(weixinGroup) {
	var mm = getMmByWeixinGroup(weixinGroup);
	if(mm) {
		return "该群已存在";
	}
	
	try {
		mm = getSelf();
		mm.weixinGroups.push(weixinGroup);
		fs.writeFileSync('./mm.json', JSON.stringify(mmConfig, null, 2));
		return "加入成功";
	} catch(e) {
		return "加入失败";
	}
}

var addUserByMsg = function(weixinMsg, weixinName) {
	if(weixinMsg == "我要买东西") {
		return addUser(weixinName);
	}
	return null;
}

var addUser = function(weixinName) {
	var mm = getMmByWeixinName(weixinName);
	if(mm) {
		return "您已存在";
	}
	
	try {
		mm = getSelf();
		mm.weixinUsers.push(weixinName);
		fs.writeFileSync('./mm.json', JSON.stringify(mmConfig, null, 2));
		return "加入成功";
	} catch(e) {
		return "加入失败" + e;
	}
}

var removeGroup = function(weixinGroup) {
	var mm = getMmByWeixinGroup(weixinGroup);
	if(mm) {
		for(var i = 0; i < mm.weixinGroups.length; i++) {
			if(mm.weixinGroups[i] == weixinGroup) {
				try {
					mm.weixinGroups.splice(i, 1);
					fs.writeFileSync('./mm.json', JSON.stringify(mmConfig, null, 2));
					return "退出成功";
				} catch(e) {
					return "加入失败" + e;
				}
			}
		}
	} else {
		return "群不存在";
	}
}

module.exports = {
    getMmByWeixinName: getMmByWeixinName,
    getMmByWeixinGroup: getMmByWeixinGroup,
    getSelf: getSelf,
    addGroup: addGroup,
    addGroupByMsg: addGroupByMsg,
    addUser: addUser,
    addUserByMsg: addUserByMsg,
    removeGroup: removeGroup
};
