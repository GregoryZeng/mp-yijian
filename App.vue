<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	const uniIdCo = uniCloud.importObject('uni-id-co');
	// #ifdef H5
		openApp() //创建在h5端全局悬浮引导用户下载app的功能
	// #endif
	// import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js';
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	import check_if_login from '@/common/check-if-login.js'
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)
			
			initApp();
			uniIdPageInit()
			
			// #ifdef APP-PLUS
			//checkIsAgree(); APP端暂时先用原生默认生成的。目前，自定义方式启动vue界面时，原生层已经请求了部分权限这并不符合国家的法规
			// #endif

			// #ifdef H5
			// checkIsAgree(); // 默认不开启。目前全球，仅欧盟国家有网页端同意隐私权限的需要。如果需要可以自己去掉注视后生效
			// #endif

			// #ifdef APP-PLUS
			//idfa有需要的用户在应用首次启动时自己获取存储到storage中
			/*var idfa = '';
			var manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
			if(plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')){
				var identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
				idfa = plus.ios.invoke(identifier, 'UUIDString');
				plus.ios.deleteObject(identifier);
			}
			plus.ios.deleteObject(manager);
			console.log('idfa = '+idfa);*/
			// #endif
			
			
			// 隐藏 tabbar
			uni.hideTabBar({
				success() {
					console.log('hide tabbar succ');
				},
				fail() {
					console.log('hide tabbar fail');
				}
			});
			
			// 获取 systeminfo，并存起来
			this.globalData.systeminfo = uni.getSystemInfoSync();
			
			
			// 如果普通云函数调用返回包含 newToken，则取里面的 token 和 tokenExpired
			// https://zh.uniapp.dcloud.io/uniCloud/client-sdk.html#add-interceptor
			// https://zh.uniapp.dcloud.io/uniCloud/cf-functions.html#resformat
			uniCloud.addInterceptor('callFunction',{
				success(res){
					console.log('intercept callfunction', res);
					if('newToken' in res.result){
						let newToken = res.result.newToken;
						console.log('newToken updated', newToken);
						uni.setStorage({
							key: 'uni_id_token',
							data: newToken['token']
						});
						uni.setStorage({
							key: 'uni_id_token_expired',
							data: newToken['tokenExpired']
						});
					}
				}
			});
			
			// 注册/登录
			// https://uniapp.dcloud.net.cn/api/plugins/login.html
			if(!check_if_login()){
				uni.login({
					success(res){
						console.log('uni.login', res);
						uniIdCo.loginByWeixin({
							code: res.code
						}).then(res=>{
							console.log('uni loginByWeixin', res);
						});
					}
				});
			}
			
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
