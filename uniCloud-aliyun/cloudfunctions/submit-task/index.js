'use strict';
const AliMNS = require("ali-mns");

exports.main = async (event, context) => {

	let {task} = event;

	if(task == 'pet_humanoid'){
		
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
		method: 'img2img',
		args: {
			prompt: 'a cute cat',
			images: ["https://mp-yijian.oss-cn-hangzhou.aliyuncs.com/b3640648-26ae-424a-8585-7297e88f8e46.png"],
			override_settings: {
				sd_model_checkpoint: "Anything-V3.0-pruned.ckpt [2700c435]",
			}
		},
		notify_url: 'https://fc-mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.next.bspapp.com/recv-task-result',
		notify_info: {
			test: 'val'
		}
	});

	// 发送到消息队列
	let account = new AliMNS.Account("mp-yijian@1891807018239840", "LTAI5tLMzkNFwmWRskiVELsk", "Wcci3j5lLfkr0cilZ8MqBffRoc1Abr");
	let mq = new AliMNS.MQ("sd-task-queue", account, "beijing");
	mq.sendP(webui_args).then(console.log, console.error);
	
	return true;
};
