<template>
	<view class="page">
		<view class="user-info-section">
			<view class="pfp-container">
				<image class="pfp" src="../../static/main/template.png"></image>
			</view>
			<view class="username">魔法师xx号</view>
			<view class="level">等级：初级魔法师</view>
		</view>


		<view class="my-work-section">
			<view class="section-name">我的画作</view>

			<view class="image_grid">
				<view class="image-container" v-for="(item,index) in my_work_list" :key="id">
					<image :src="item.img_url" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<!-- 下方 tabbar -->
		<view class="tabbar">
			<view class="tabbar_elem" @click="switchToMain">创作+</view>
			<view class="tabbar_elem tabbar_elem_selected">我的</view>
		
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				my_work_list: [{
						id: 0,
						img_url: '../../static/main/template.png'
					},
					{
						id: 1,
						img_url: '../../static/main/bell.png'
					},
					{
						id: 2,
						img_url: '../../static/main/board.png'
					},
					{
						id: 3,
						img_url: '../../static/main/close.png'
					},
					{
						id: 4,
						img_url: '../../static/main/noticebar.png'
					},
					{
						id: 5,
						img_url: '../../static/main/paw-btn.png'
					},
					{
						id: 6,
						img_url: '../../static/main/tabbar-selected.png'
					},
					{
						id: 7,
						img_url: '../../static/main/tabbar-unselected.png'
					}
				],

			};
		},
		methods:{
			switchToMain(){
				uni.switchTab({
					url: '/pages/main/main',
					success() {
						console.log('succ')
					},
					fail() {
						console.log('fail')
					},
					complete(){
						console.log('complete')
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		padding: 0 20rpx 0;
	}

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

	.my-work-section {
		.section-name{
			margin-bottom: 20rpx;
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
