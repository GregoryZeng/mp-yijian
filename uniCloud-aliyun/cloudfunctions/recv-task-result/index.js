'use strict';
exports.main = async (event, context) => {
	let payload = JSON.parse(event.body);

	// console.log('payload', payload);

	if (payload.errMsg) {
		throw 'has errMsg';
	}

	let {
		notify_info,
		result
	} = payload;

	// 初始化中间件接口
	const db = uniCloud.databaseForJQL({
		event,
		context
	});
	db.setUser({
		uid: 'admin',
		role: ['admin']
	});
	const db2 = uniCloud.database();
	const dbCmd = db2.command;
	const redis = uniCloud.redis();

	// 暂时分 task 处理
	console.log('notify_info', notify_info)
	if (notify_info.task == 'pet_humanoid') {
		// 在 redis 保存 3h
		console.log('notify_info.task', notify_info.task)
		let res = await redis.set(`task_result:${notify_info.task_id}`, JSON.stringify(result.images), 'EX',
			60 * 60 * 3, 'NX');
		console.log('res', res)
		if (res) {
			await db.collection('yj-task').doc(notify_info.task_id).update({
				status: 'done',
				result: {
					img_list: result.images
				},
			});
		}


	} else {
		throw 'task unknown';
	}



	//返回数据给客户端
	return event
};
