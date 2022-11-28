<template>
	<view class="page">
		<v-tabs v-model="current" :tabs="tabs" @change="changeTab" fontSize="35rpx" color="#585657"
			activeColor="#000000" lineColor="#000000"></v-tabs>


		<scroll-view class="scrollable_view" scroll-y="true" scroll-x="false">
			<uni-notice-bar scrollable single backgroundColor="#ffffff" text="公告:上了新模板，给大家送100瓶魔法药水"></uni-notice-bar>

			<view class="template_grid">
				<view class="template_item">
					<image class="template_thumbnail" src="@/static/templates/template.png" mode="aspectFit"></image>
					<view class="template_desc">
						<text>萌宠大变身</text>
						<image class="palm" src="@/static/templates/palm.png" mode="aspectFit"></image>
					</view>

				</view>

				<view class="template_item">
					<image class="template_thumbnail" src="@/static/templates/template.png" mode="aspectFit"></image>
					<view class="template_desc">
						<text>迪士尼公主</text>
						<image class="palm" src="@/static/templates/palm.png" mode="aspectFit"></image>
					</view>
				</view>

				<view class="template_item">
					<image class="template_thumbnail" src="@/static/templates/template.png" mode="aspectFit"></image>
					<view class="template_desc">
						<text>萌宠大变身</text>
						<image class="palm" src="@/static/templates/palm.png" mode="aspectFit"></image>
					</view>

				</view>

				<view class="template_item">
					<image class="template_thumbnail" src="@/static/templates/template.png" mode="aspectFit"></image>
					<view class="template_desc">
						<text>迪士尼公主</text>
						<image class="palm" src="@/static/templates/palm.png" mode="aspectFit"></image>
					</view>

				</view>
			</view>

			<view class="scrollable_bottom"><text>··· 更多配方敬请期待 ···</text></view>

		</scroll-view>


		<view class="tabbar">
			<button class="tabbar_elem tabbar_elem_selected">创作+</button>
			<button class="tabbar_elem">我的</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabs: ['AI配方', '实验室']
			};
		},
		methods: {
			changeTab(index) {
				console.log('当前选中的项：' + index)
			}
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
	}

	.scrollable_view {
		// 可滑动页高度、宽度
		height: 1100rpx;
		width: 700rpx;

		// 可滑动页水平居中
		// top horizontal bottom
		margin: 20rpx auto 10rpx;

		border: 5rpx solid #000000;
		border-radius: 30rpx;

		.template_grid {
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

					text {
						display: inline-block;

						padding: 10rpx 30rpx 10rpx 30rpx;

						color: #000000;
						background: #eda91d;
						border: 5rpx solid #000000;
						border-radius: 20rpx;
					}

					.palm {
						max-width: 85rpx;
						position: absolute;
						bottom: 10rpx;
						left: 5rpx;
						top: -205rpx;
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
		gap: 20rpx;
	}

	.tabbar_elem {
		flex-basis: 0;
		flex-grow: 1;

		color: #000000;
		background: #f8dbe2;
		border: 5rpx solid #000000;
		border-radius: 30rpx;

	}

	.tabbar_elem_selected {
		background: #f397a7;
	}
</style>
