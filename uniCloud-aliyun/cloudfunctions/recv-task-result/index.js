'use strict';

const signer = require('./signer');
const https = require("https");

async function checkImageModeration(img_url){
	let sig = new signer.Signer();
	sig.Key = "MCLUOIXHXTEPDWMZWMT8";
	sig.Secret = "7mL9j9P5yAZOtlwa1TOHwJiHSj0VawqRX1fxVWSj";
	let r = new signer.HttpRequest("POST", "moderation.cn-east-3.myhuaweicloud.com/v3/7945883cf9a4481f8a24ef1df4540789/moderation/image");
	r.headers = {"Content-Type": "application/json"};
	let content = JSON.stringify({
	    event_type: 'album',
	    categories:['porn'],
	    url: img_url
	});	
	r.body = content;
	let opt = sig.Sign(r);
	console.log('opt',opt)
	console.log('X-Sdk-Date', opt.headers["X-Sdk-Date"]);
	console.log('Authorization', opt.headers["Authorization"]);
	let req = uniCloud.httpclient.request(
		'https://moderation.cn-east-3.myhuaweicloud.com/v3/7945883cf9a4481f8a24ef1df4540789/moderation/image',
		{
			method: 'POST',
			content: content,
			headers: opt.headers,
			dataType: 'json'
		}
	); //data.result.suggestion;
	return req
}

exports.main = async (event, context) => {
	let payload = JSON.parse(event.body);


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
	if (['pet_humanoid', 'christmas'].includes(notify_info.task)) {
		// 在 redis 保存 3h
		let safe_images = [];
		console.log('notify_info.task', notify_info.task)
		for (let url of result.images) {
			let safety_check_res = (await checkImageModeration(url)).data.result;
			console.log('safety_check', url, safety_check_res)
			if(safety_check_res.suggestion === 'pass'){
				safe_images.push(url);
			}else{
				// TODO 删除图片
			}
		}

		let res = await redis.set(`task_result:${notify_info.task_id}`, JSON.stringify(safe_images), 'EX',
			60 * 60 * 3, 'NX');
		if (res) {
			await db.collection('yj-task').doc(notify_info.task_id).update({
				status: 'done',
				result: {
					img_list: safe_images
				},
			});
		}
	} else {
		throw 'task unknown';
	}



	//返回数据给客户端
	return event
};
