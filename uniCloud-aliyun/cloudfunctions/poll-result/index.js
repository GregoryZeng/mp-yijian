'use strict';

const uniID = require('uni-id-common');
exports.main = async (event, context) => {
	// uni-id 检查 token 是否合法，属于哪个用户
	let {
		uniIdToken
	} = context;
	const uniIDIns = uniID.createInstance({
		context: context
	});
	const {
		errCode,
		message,
		uid,
		token,
		tokenExpired
	} = await uniIDIns.checkToken(uniIdToken);
	if (errCode) {
		return {
			errCode,
			message
		};
	}
	console.log('uid', uid);
	let newToken = {};
	if (token) {
		newToken = {
			token,
			tokenExpired
		};
	}

	// 初始化中间件接口
	const db = uniCloud.databaseForJQL({
		event,
		context
	});
	db.setUser({
		uid: uid,
		role: ['admin']
	});
	const db2 = uniCloud.database();
	const dbCmd = db2.command;
	const redis = uniCloud.redis();

	// 获取 task_result
	let {
		task_id
	} = event;
	console.log('task_id', task_id)
	let r = await redis.get(`task_result:${task_id}`);
	console.log(r)
	if (r) {
		let result_imgs = JSON.parse(r);
		console.log('result_imgs', result_imgs)
		return {
			done: true,
			result_imgs
		};
	} else {
		return {
			done: false
		};
	}

};
