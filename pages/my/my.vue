<template>
	<view class="page" :style="{'height': page_height}">

		<scroll-view class="my-work-section" scroll-y="true" refresher-enabled="true" @refresherrefresh="pullDownRefresher" :refresher-triggered="pullDownRefreshTriggered">
			<view class="user-info-section">
				<view class="pfp-container">
					<image class="pfp" src="../../static/main/template.png"></image>
				</view>
				<view class="username">魔法师xx号</view>
				<view class="level">等级：初级魔法师</view>
			</view>


			<view class="section-name">我的画作</view>

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
				page_height: 'auto',
				result_imgs: [],
				
				pullDownRefreshTriggered: false,
			};
		},
		async onLoad() {
			console.log('my onload')
			this.update();
		},
		onReady() {
			this.page_height = getApp().globalData.systeminfo.windowHeight + 'px';
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
				let result_imgs = (await uniCloud.callFunction({
					name: 'get-feed',
					data: {}
				})).result.result_imgs;
				console.log('result_imgs', result_imgs.length);
				this.result_imgs.splice(0, this.result_imgs.length, ...result_imgs);
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

			margin: 40rpx 0 30rpx;

			.pfp-container {
				grid-column: 1;
				grid-row: 1 / 3;

				display: flex;

				aspect-ratio: 1;

				.pfp {

					width: 100%;
					height: 100%;
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
			margin-bottom: 20rpx;

			font-weight: bold;
		}

		.image_grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));

			gap: 15rpx;

			.image-container {
				aspect-ratio: 1;

				border: solid;
				border-radius: 15rpx;

				image {
					height: 100%;
					width: 100%;
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
