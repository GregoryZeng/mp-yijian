'use strict';
exports.main = async (event, context) => {
	let payload = JSON.parse(event.body);
	
	console.log('payload', payload);
	
	if(payload.errMsg){
		throw 'has errMsg';
	}
	
	let {notify_info, result} = payload;
	
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
	if(notify_info.task == 'pet-humanoid'){
		// 在 redis 保存 3h
		redis.set(`task_result:${notify_info.task_id}`, JSON.stringify(result.images), 'EX', 60*60*3, 'NX').then(res=>{
			if(res){
				db.collection('yj-task').doc(notify_info.task_id).update({
					status: 'done',
					result: {img_list: result.images},
				});
			}
		});

	}else{
		throw 'task unknown';
	}
	
	
	
	//返回数据给客户端
	return event
};
