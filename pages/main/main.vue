<template>
	<view class="page" :style="{'height': page_height}">
		<!-- 上方的 tab：AI配方/实验室 -->
		<yj-main-tabs v-model="current_tab" :tabs="tabs" @change="changeTab" fontSize="35rpx" color="#585657"
			activeColor="#000000" lineColor="#000000" field="name" @clickDisabled="clickDisabled"></yj-main-tabs>

		<!-- 中间的模板列表 -->
		<scroll-view class="scrollable_view" scroll-y="true" scroll-x="false">
			<view :class="noticebar_classlist">
				<!-- <image class="noticebar_img" src="@/static/main/noticebar.png" mode="aspectFit"></image> -->
				<yj-notice-bar class="noticebar_text" scrollable single backgroundColor="rgb(0,0,0,0)"
					text="公告: 欢迎大家的使用~ " ref="noticebar" :showIcon="true" color="#000000" showClose="true">
				</yj-notice-bar>
			</view>

			<view class="template_grid">
				<view class="template_item" v-for="(item,index) in templates" :key="title"
					@click="click_template(index)">
					<image class="template_thumbnail" :src="item.image_url" mode="aspectFit"></image>
					<view class="template_desc">
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>

			<view class="scrollable_bottom"><text>··· 更多配方敬请期待 ···</text></view>

			

		</scroll-view>

		<!-- 下方 tabbar -->
		<view class="tabbar">
			<view class="tabbar_elem tabbar_elem_selected">创作+</view>
			<view class="tabbar_elem" @click="switchToMyPage">我的</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_tab: 0,
				tabs: [{
						id: 1,
						name: 'AI配方',
						disabled: false
					},
					{
						id: 2,
						name: '实验室',
						disabled: true
					},
				],
				noticebar_classlist: ['noticebar'],
				page_height: 'auto',

				templates: [{
						image_url: "https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bfaef5df-9470-4e7a-8feb-c651f0e5078c.png",
						title: '萌宠大变身',
						page: "/pages/templates/pet_humanoid"
					},
					// {
					// 	image_url: "https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bfaef5df-9470-4e7a-8feb-c651f0e5078c.png",
					// 	title: '圣诞变装',
					// 	page: "/pages/templates/christmas"
					// },

				],
			};
		},
		onShow() {
			uni.getSystemInfo({
				success: function(res) {
					console.log("屏幕宽度 screenWidth：" + res.screenWidth);
					console.log("屏幕高度 screenHeight：" + res.screenHeight);
					console.log("可使用窗口宽度 windowWidth：" + res.windowWidth);
					console.log("可使用窗口高度 windowHeight：" + res.windowHeight);
				}
			});
		},

		onReady() {
			this.page_height = getApp().globalData.systeminfo.windowHeight + 'px';
		},

		methods: {
			rpx2px(rpx) {
				let w = getApp().globalData.systeminfo.screenWidth;
				console.log('screenwidth', w)
				return w / 750 * rpx;
			},

			changeTab(index) {
				console.log('当前选中的项：' + index)
			},

			clickDisabled(index) {
				uni.showToast({
					title: '实验室正在施工中...',
					icon: 'none'
				})
			},

			clickClose() {
				console.log('clickClose');
				this.noticebar_classlist.push('transition');
				setTimeout(this.$refs.noticebar.close, 1000)

			},

			click_template(index) {
				// 不知道为啥传 item 就不行
				console.log('click_template', index)

				uni.navigateTo({
					url: this.templates[index].page
				})
			},

			switchToMyPage() {
				uni.switchTab({
					url: '/pages/my/my',
				});
			}
		}
	}
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {
		display: none;
	}

	.page {
		// 控制
		padding: 0 20rpx 0;

		display: flex;
		flex-direction: column;
	}

	.scrollable_view {


		// 可滑动页高度
		// TODO: 应该根据实际机型动态计算
		width: auto;
		// height: 1170rpx;
		flex: 1;

		// 可滑动页水平居中
		// top horizontal bottom
		margin: 20rpx auto 10rpx;

		border: 5rpx solid #000000;
		border-radius: 30rpx;

		// corner 超出的地方也要隐藏
		// 参考 https://developers.weixin.qq.com/community/develop/doc/0004e87a8508e81b958662b0e5bc00
		overflow: hidden;
		transform: translateY(0);

		.noticebar {
			// 公告栏（包括图片、滚动文字、关闭按钮）

			margin-top: 20rpx;

			.noticebar_img {
				// 图片水平居中
				display: block;
				margin: 0 auto 0;

				height: 70rpx; // TODO 目前需显式设置高度，暂时不知道有没有自适应的办法

			}




		}


		.template_grid {
			// margin-top: -30rpx;

			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

			column-gap: 10rpx;
			row-gap: 20rpx;

			.template_item {

				.template_thumbnail {
					max-width: 100%;
				}

				.template_desc {
					display: block;
					text-align: center;
					position: relative;

					// 猫爪子按钮
					background-image: url("@/static/main/paw-btn.png");
					background-repeat: no-repeat;
					background-size: contain;
					padding: 16rpx 0 16rpx;
					background-position: center;

					text {
						font-weight: bold;

						display: inline-block;
						translate: 10%;
					}
				}
			}
		}

		.scrollable_bottom {
			// 滑到底部的敬请期待，上下留白
			padding-top: 60rpx;
			padding-bottom: 40rpx;

			text-align: center;
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
