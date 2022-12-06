'use strict';
const AliMNS = require("ali-mns");
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

	// 判断 task 类型；在扣 credit 之后不再检查 form_data 内参数的合法性，依赖 consumer 处理异常
	let method = null;
	let args = null;
	let notify_info = null;
	let task_id = null;
	if (event.task == 'pet_humanoid') { //萌宠大变身
		let {
			init_image,
			become,
			n_images
		} = event.form_data;

		task_id = (await db.collection("yj-task").add({
			task: event.task,
			form_data: event.form_data,
		})).id;
		console.log('task_id', task_id)

		method = 'img2img';
		args = {
			prompt: 'a cute cat',
			images: [
				init_image
			],
			batch_size: n_images,
			cfg_scale: 7,
			denoising_strength: 0.75,
			override_settings: {
				sd_model_checkpoint: "Anything-V3.0-pruned.ckpt [2700c435]",
			}
		};
		notify_info = {
			task: event.task,
			task_id: task_id
		};
	} else if (event.task == 'test') {
		method = 'txt2img';
		args = {
			prompt: 'a cute cat',
			batch_size: 2,
			override_settings: {
				sd_model_checkpoint: "Anything-V3.0-pruned.ckpt [2700c435]",
			}
		};
		notify_info = {
			task_id: 'test123',
		};
	} else {
		throw 'task not found';
	}

	// WebUI API 接收的参数：
	// 	支持的 API 见 https://github.com/mix1009/sdwebuiapi/blob/main/webuiapi.py 里的 WebUIApi 类
	// 	更详细的 API 说明见文档 https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API
	// 		https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/master/modules/api/api.py
	//
	// method (string): WebUIApi 类里非下划线开头的成员函数，如 txt2img | img2img | extra_single_image 等
	// args (object): 该 method 下的传参，如果某个参数是图片或者图片的列表（webuiapi.py 里写着 PIL Image 类型的），那么需要先把图片上传到云存储，把 url 传进来（见下面的例子）
	// notify_url (string): 任务计算结果将被 POST 到该 URL 地址；结果 WebUIApiResult 放在 JSON payload 下的 result 字段
	// notify_info (object): 该字段会在请求 notify_url 时原样转发到 payload 里，可以存类似于 task_id 的字段；payload 的形式将会是 {'result': {...}, 'notify_info': {...}}
	const webui_args = JSON.stringify({
		method,
		args,
		notify_url: 'https://fc-mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.next.bspapp.com/recv-task-result',
		notify_info
	});

	// 发送到消息队列
	let account = new AliMNS.Account("mp-yijian@1891807018239840", "LTAI5tLMzkNFwmWRskiVELsk",
		"Wcci3j5lLfkr0cilZ8MqBffRoc1Abr");
	let mq = new AliMNS.MQ("sd-task-queue", account, "beijing");
	mq.sendP(webui_args).then(console.log, console.error);

	return {
		task_id,
		...newToken
	};
};
