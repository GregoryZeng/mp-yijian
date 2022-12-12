'use strict';
let uobc = require('uni-open-bridge-common');

// function qiniu_sign(method, path, rawQuery, host, contentType, bodyStr){
// 	// https://developer.qiniu.com/kodo/3702/QiniuToken
// 	let data = method + ' ' + path;
// 	if(rawQuery != ''){
// 		data += `?${rawQuery}`;
// 	}
// 	data += '\nHost: ' + host;
// 	if(contentType != "") {
// 	        data += `\nContent-Type: ${contentType}`;
// 	}
// 	data += "\n\n";
// 	if(bodyStr!='' && contentType != '' && contentType != "application/octet-stream"){
// 		data += bodyStr;
// 	}
// 	return data;
// }
const signer = require('./signer');
const https = require("https");
async function CheckImageModeration(img_url){
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
	);
	return req
}

exports.main = async (event, context) => {
	console.log('context', context)
	
	var sig = new signer.Signer();
	sig.Key = "MCLUOIXHXTEPDWMZWMT8";
	sig.Secret = "7mL9j9P5yAZOtlwa1TOHwJiHSj0VawqRX1fxVWSj";
	var r = new signer.HttpRequest("POST", "moderation.cn-east-3.myhuaweicloud.com/v3/7945883cf9a4481f8a24ef1df4540789/moderation/image");
	r.headers = {"Content-Type": "application/json"};
	let content = JSON.stringify({
	    event_type: 'album',
	    categories:['porn'],
	    url: 'https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bea3e18e-04e6-4d99-9abc-6f15168f617b.jpg'
	});	
	r.body = content;
	var opt = sig.Sign(r);
	console.log('opt',opt)
	console.log('X-Sdk-Date', opt.headers["X-Sdk-Date"]);
	console.log('Authorization', opt.headers["Authorization"]);
	
	// var req = https.request(opt, function (res) {
	//     console.log(res.statusCode);
	//     console.log('headers:', JSON.stringify(res.headers));
	//     res.on("data", function (chunk) {
	//         console.log(chunk.toString())
	//     })
	// });
	
	// req.on("error", function (err) {
	//     console.log(err.message)
	// });
	// req.write(r.body);
	// req.end();
	
	let res = (await uniCloud.httpclient.request(
		'https://moderation.cn-east-3.myhuaweicloud.com/v3/7945883cf9a4481f8a24ef1df4540789/moderation/image',
		{
			method: 'POST',
			content: content,
			headers: opt.headers,
			dataType: 'json'
		}
	)).data.result.suggestion;
	console.log('res', res)
	
	
	// let {access_token} = await uobc.getAccessToken({
	//   dcloudAppid: '__UNI__4BA206D', // DCloud Appid
	//   platform: 'weixin-mp' // 指定凭据所属平台，解释见上
	// })
	// console.log('access_token', access_token);

	// let openid = 'oOw8s5fX5PbnO7AWsXIYV6VZ984s';

	
	
};
