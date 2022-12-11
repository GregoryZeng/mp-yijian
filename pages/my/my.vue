<template>
	<view class="page" :style="{'height': page_height}">

		<scroll-view class="my-work-section" scroll-y="true" refresher-enabled="true" @refresherrefresh="pullDownRefresher" :refresher-triggered="pullDownRefreshTriggered">
			<view class="user-info-section">
				<view class="pfp-container">
					<image class="pfp" src="https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/e31bbf5a-987c-4e67-ad14-0819e43a1f1f.png"></image>
				</view>
				<view class="username">{{username}}</view>
				<view class="level">等级：初级魔法师</view>
			</view>


			<view class="section-name">我的画作({{result_imgs.length}})</view>
			<view class="waiting" v-if="n_waiting>0">有{{n_waiting}}个正在排队任务，下拉页面以刷新进度...</view>

			<view class="image_grid">
				<view class="image-container" v-for="(item,index) in result_imgs" :key="id"
					@click="previewImage(index)">
					<image :src="item.url" mode="aspectFit"></image>
				</view>
			</view>
		</scroll-view>

		<!-- 下方 tabbar -->
		<view class="tabbar">
			<view class="tabbar_elem" @click="switchToMain">创作+</view>
			<view class="tabbar_elem tabbar_elem_selected">我的</view>

		</view>

	</view>
</template>

<script>
	import Vue from 'vue';

	export default {
		data() {
			return {
				username: '魔法师',
				
				page_height: 'auto',
				result_imgs: [],
				n_waiting: 0,
				
				pullDownRefreshTriggered: false,
			};
		},
		async onLoad() {
			console.log('my onload')
			this.update();
			
			let uid = uniCloud.getCurrentUserInfo().uid;
			this.username = `魔法师${uid.substr(-3)}号`; 
			
		},
		onReady() {
			this.page_height = getApp().globalData.systeminfo.windowHeight + 'px';
		},
		async onShow(){
			console.log('onShow')
			const db = uniCloud.databaseForJQL();
			const uid = uniCloud.getCurrentUserInfo().uid;
			console.log('uid',uid)
			let n_waiting = (await db.collection("yj-task").where(`user_id == "${uid}" && status == "waiting" `).count()).total;
			console.log('n_waiting', n_waiting);
			this.n_waiting = n_waiting;
		},
		methods: {
			switchToMain() {
				uni.switchTab({
					url: '/pages/main/main',
					success() {
						console.log('succ')
					},
					fail() {
						console.log('fail')
					},
					complete() {
						console.log('complete')
					}
				});
			},

			previewImage(index) {
				console.log('preview_image')
				console.log(this.result_imgs[index].url)
				uni.previewImage({
					index: 0,
					urls: [this.result_imgs[index].url],
					success(e) {
						console.log('succ')
						console.log(e)
					},
					fail(e) {
						console.log('fail')
					}
				});
			},
			async update(){
				console.log('my update');
				let {result_imgs, n_waiting} = (await uniCloud.callFunction({
					name: 'get-feed',
					data: {}
				})).result;
				console.log('result_imgs', result_imgs.length);
				this.result_imgs.splice(0, this.result_imgs.length, ...result_imgs);
				this.n_waiting = n_waiting;
			},

			async pullDownRefresher(){
				console.log('pullDownRefresher')
				this.pullDownRefreshTriggered = true;
				await this.update();
				this.pullDownRefreshTriggered = false;
			}
		},

	}
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {
		display: none;
	}
	
	.page {
		padding: 0 20rpx 0;

		display: flex;
		flex-direction: column;
	}



	.my-work-section {

		flex: 1;

		overflow: hidden;
		transform: translateY(0);

		.user-info-section {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-template-rows: repeat(2, minmax(0, 1fr));

			column-gap: 20rpx; 

			margin: 40rpx 0 30rpx;

			.pfp-container {
				grid-column: 1;
				grid-row: 1 / 3;

				display: flex;

				aspect-ratio: 1;

				position: relative;
				.pfp {

					width: 100%;
					height: 100%;
					
					position: absolute;
					left: 0;
					top: 0;
				}
			}

			.username {
				grid-column: 2 / 5;
				grid-row: 1;

				display: flex;
				align-items: center;
			}

			.level {
				grid-column: 2 / 5;
				grid-row: 2;

				display: flex;
				align-items: center;
			}
		}

		.section-name {
			margin-bottom: 10rpx;

			font-weight: bold;
		}
		
		.waiting{
			margin-bottom: 20rpx;
			
			font-size: 25rpx;
		}

		.image_grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			// grid-auto-rows: 200rpx;

			gap: 15rpx;

			.image-container {
				aspect-ratio: 1;

				border: solid;
				border-radius: 15rpx;

				position: relative;

				image {
					height: 100%;
					width: 100%;
					
					// TODO: 不知道为啥改用 absolute positioning 之后就没有各种奇怪的问题了
					position: absolute;
					left: 0;
					top: 0;  
				}
			}
		}
	}


	.tabbar {
		display: flex;

		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.tabbar_elem {
			display: inline-block;
			flex-basis: 0;
			flex-grow: 1;

			text-align: center;

			font-size: 40rpx;
			padding: 16rpx 0 16rpx 10rpx;

			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;

			font-weight: bold;

			// 未选中态按钮图片
			background-image: url("@/static/main/tabbar-unselected.png");

			&.tabbar_elem_selected {
				//选中态按钮图片	
				background-image: url("@/static/main/tabbar-selected.png");
			}
		}
	}
</style>
