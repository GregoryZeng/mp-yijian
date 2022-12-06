// 检查是否是登录的,以及 token 是否过期
function check_if_login(){
	try {
		// const value = uni.getStorageSync('sessionid');
		// 或者用客户端API https://zh.uniapp.dcloud.io/uniCloud/client-sdk.html#client-getcurrentuserinfo
		const token = uni.getStorageSync('uni_id_token');
		const expire_time = uni.getStorageSync('uni_id_token_expired');
		if (token && expire_time) {
			console.log('check_if_login token expire', token, expire_time);
			if (Date.now() > expire_time){
				console.log('now timestamp', Date.now());
				return false;
			}
			return true;
		}
	} catch (e) {
		// error
		console.log('check_if_login exception', e);
	}
	return false;
}

export default check_if_login;