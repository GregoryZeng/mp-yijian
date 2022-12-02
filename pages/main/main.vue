<template>
	<view class="page">
		<!-- 上方的 tab：AI配方/实验室 -->
		<yj-main-tabs v-model="current_tab" :tabs="tabs" @change="changeTab" fontSize="35rpx" color="#585657"
			activeColor="#000000" lineColor="#000000" field="name" @clickDisabled="clickDisabled"></yj-main-tabs>

		<!-- 中间的模板列表 -->
		<scroll-view class="scrollable_view" scroll-y="true" scroll-x="false">
			<view :class="noticebar_classlist">
				<!-- <image class="noticebar_img" src="@/static/main/noticebar.png" mode="aspectFit"></image> -->
				<yj-notice-bar class="noticebar_text" scrollable single backgroundColor="rgb(0,0,0,0)"
					text="公告:上了新模板，给大家送100瓶魔法药水" ref="noticebar" :showIcon="true" color="#000000" showClose="true">
				</yj-notice-bar>
			</view>

			<!-- <button @click="clickClose">close</button> -->
			<view class="template_grid">
				<view class="template_item" v-for="(item,index) in templates" :key="title">
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
			<view class="tabbar_elem">我的</view>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_tab: 0,
				tabs: [
					{id:1, name: 'AI配方', disabled: false},
					{id:2, name: '实验室', disabled: true},
				],
				noticebar_classlist: ['noticebar'],
				
				templates: [
					{
						image_url: "../../static/main/template.png",
						title: '萌宠大变身'
					},
					{
						image_url: "../../static/main/template.png",
						title: '迪士尼公主'
					},
				]
			};
		},
		methods: {
			changeTab(index) {
				console.log('当前选中的项：' + index)
			},

			clickDisabled(index){
				uni.showToast({
					title:'实验室正在施工中~',
					icon:'none'
				})
			},

			clickClose() {
				console.log('clickClose');
				this.noticebar_classlist.push('transition');
				setTimeout(this.$refs.noticebar.close, 1000)

			},
			
			
		}
	}
</script>

<style lang="scss">
	.page {
		// 控制
		padding: 0 20rpx 0;
	}

	.scrollable_view {
		
		
		// 可滑动页高度
		// TODO: 应该根据实际机型动态计算
		width: auto;
		height: 1170rpx;

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
			
			.noticebar_img {
				// 图片水平居中
				display: block;
				margin: 0 auto 0;

				height: 70rpx; // TODO 目前需显式设置高度，暂时不知道有没有自适应的办法

			}

			.noticebar_text {
				// position: absolute;
				// width: 50%; // TODO 不显式设置宽度的话，absolute 下会看不到

				// bottom: 0;
				// left: 120rpx;
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

			// 未选中态按钮图片
			background-image: url("@/static/main/tabbar-unselected.png");

			&.tabbar_elem_selected {
				//选中态按钮图片	
				background-image: url("@/static/main/tabbar-selected.png");
			}
		}
	}
</style>
