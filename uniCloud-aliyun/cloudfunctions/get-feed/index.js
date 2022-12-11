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
	
	// 查 db 获取数据
	let n_waiting = 0;
	let my_tasks = (await db.collection('yj-task').where(`user_id == "${uid}"`).orderBy('create_time desc').get()).data;
	let result_imgs = [];
	for(let task of my_tasks){
		if(task.status === 'done'){
			//目前只考虑 result 里的 img_list
			console.log('curr task',task)
			for(let i=0; i < task.result.img_list.length; i++){
				result_imgs.push({
					id: `${task._id}_${i}`,
					url: task.result.img_list[i]
				});
			}
		}else{
			n_waiting += 1;
		}
	}
	console.log('result_imgs len', result_imgs.length);
	
	return {
		result_imgs,
		n_waiting,
		...newToken
	};
};
