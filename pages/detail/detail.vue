<template>
	<view class="page">

		<view class="main-area">
			<view class="init-img-loading-info">
				<view class="init-img-container">
					<image class="init-img" :src="init_image_url" mode="aspectFit"></image>
				</view>
				<text class="est-time" ref="est-time">施法过程还有60秒</text>
				<!-- <button class="accelerate-btn" >消耗魔力即可加速</button> -->
			</view>

			<view class="result-imgs">

				<swiper class="swiper" :current="current_idx"  :disable-touch="true">
					<swiper-item v-for="(item, index) in result_imgs" :key="id" class="swiper-item">
						<image :src="item.url" class="swiper-item-img" mode="aspectFit"></image>
					</swiper-item>
				</swiper>
				
				<view class="swiper-touchmove-blocker" @click="previewImage"></view>

				<scroll-view scroll-x="true" scroll-y="false" class="horizontal-thumbnails">
					<!-- :scroll-into-view="`pos_${scroll_current_idx}`" -->
					
					<image v-for="(item, index) in result_imgs" :key="id" :id="`pos_${index}`" :src="item.url"
						:class="['thumbnail', {'not-first': index!==0 }, {'not-selected': index!==current_idx}]"
						@click="current_idx=index" mode="aspectFit" ></image>
						
				</scroll-view>


			</view>

			<view class="desc">
				<view class="pfp-container">
					<image class="pfp" src='../../static/main/bell.png' mode="aspectFit"></image>
				</view>
				
				<text class="username">魔法师1号</text>
				<text class="from">来自 小程序 一间AI绘画学院</text>
				<text class="create_time">生成时间：2022年11月27日</text>

			</view>
		</view>

		<view class="btns-container">
			<button class="btn share">分享配方</button>
			<button class="btn rerun">再画一次</button>
		</view>

		<!-- <view>{{current_idx}}</view> --> 
		<!-- <view>scrollLeft {{scroll_info.scrollLeft}}</view>
		<view>scrollWidth {{scroll_info.scrollWidth}}</view>
		<view>deltaX {{scroll_info.deltaX}}</view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_idx: 0,
				swiper_current_idx: 0,
				// scroll_current_idx: 0,
				
				
				task_id: null,
				n_images: null,
				init_image: null,
				
				done: false,
				est_time_in_secs: 60,
				timer: null, // 轮询定时器
				result_imgs: [],
			};
		},
		onLoad(option){
			console.log(option);
			let {task_id, n_images, init_image} = option;
			this.task_id = task_id;
			this.n_images = n_images;
			this.init_image = init_image;
			
		},
		onShow() {
			if(!this.done){
				this.timer = setInterval(this.pollResult, 1000);
			}
		},
		onUnload() {
			this.clearTimer();
		},
		onHide(){
			this.clearTimer();
		},
		destroyed() {
			this.clearTimer();
		},
		methods:{
			// swiper_change(e){
			// 	// DEPRECATED 目前不允许用户划动 swiper
				
			// 	console.log('swiper change')
			// 	console.log('source', e.detail.source)
				
			// 	if(e.detail.source === 'touch'){
			// 		// 仅在滑动  swiper 时才修改 scroll_current_idx
			// 		this.current_idx = e.detail.current;
			// 		// 假设一行最多显示4个缩略图
					
			// 		// TODO 因为暂无办法判断当前 scroll view 有没有显示当前图片，目前实现不太完美
			// 		// 另一种待测试的方法：判断元素是否在可视区域 
			// 		if(this.current_idx > this.scroll_current_idx+3){
			// 			this.scroll_current_idx = this.current_idx - 3;
			// 		}else if(this.current_idx < this.scroll_current_idx){
			// 			this.scroll_current_idx = this.current_idx;
			// 		}else{
			// 			this.scroll_current_idx = this.scroll_current_idx;
			// 		}
			// 	} 
			// 	console.log('current_idx', this.current_idx)
			// 	console.log('scroll_current_idx', this.scroll_current_idx)
			// },
			
			previewImage(){
				console.log('preview_image')
				console.log(this.result_imgs[this.current_idx].url)
				uni.previewImage({
					index: 0,
					urls: [this.result_imgs[this.current_idx].url],
					success(e){
						console.log('succ')
						console.log(e)
					},
					fail(e) {
						console.log('fail')
					}
				});
			},
			
			async pollResult(){
				console.log('pollResult');
				console.log(this.$refs['est-time'])
				let {done, result_imgs} = (await uniCloud.callFunction({
					name: 'poll-result',
					data:{
						task_id: this.task_id
					}
				})).result;
				console.log(done)
				
				if(done){
					this.done = done;
					this.clearTimer();
					this.result_imgs = result_imgs;
				}else{
					if(this.est_time_in_secs > 1){
						this.est_time_in_secs -= 1;

					}
					
				}
				
			},
			
			clearTimer(){
				if(this.timer){
					clearInterval(this.timer);
					this.timer = null;
				}
			}
		}
		
	}
</script>

<style lang="scss">
	.page {
		padding: 0 20rpx 0;
	}


	.main-area {
		border: 5rpx solid #000000;
		border-radius: 30rpx;
		padding: 20rpx;

		.init-img-loading-info {
			// 上半部分：初始图片、等待时间、加速按钮
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-template-rows: repeat(2, minmax(0, 1fr));
			
			column-gap: 40rpx;

			.init-img-container{
				// 必须要在 image 外加一层 view，否则 aspect-ratio 不工作
				aspect-ratio: 1;

				box-sizing: border-box;
				grid-column: 1;
				grid-row: 1 / 3;
				
				border: solid;
				.init-img {
					height: 100%;
					width: 100%;					
				}
			}
			

			.est-time {
				display: flex;
				align-items: center;
				
				grid-column: 2 / 4;
				grid-row: 1;
			}

			.accelerate-btn {
				grid-column: 2 / 4;
				grid-row: 2;

				margin: 0;
				
				background-color: #F293A5;
				border: solid;
				border-radius: 30rpx;
			}
		}


		.result-imgs {

			// 中间的 swiper 和 scroll-view
			
			position: relative;
			
			margin-top: 20rpx;
			
			.swiper {
				// swiper 组件的高度不是自适应的
				height: 600rpx;
				width: 100%;
				box-sizing: border-box;


				// 居中，上下间距
				margin: 20rpx auto 20rpx;

				// aspect-ratio: 1 / 1;

				border: solid;

				.swiper-item {

					.swiper-item-img {
						// 高和宽与 parent 匹配
						width: 100%;
						height: 100%;

					}
				}
			}

			.swiper-touchmove-blocker{
				// 禁止对 swiper 的划动操作
				height: 600rpx;
				width: 100%;
				
				position: absolute;
				top: 0;
				left: 0;
			}

			.horizontal-thumbnails {
				// 横向滚动的图片列表

				// scroll-view 的 flex 似乎有点问题，flex-wrap nowrap 不能工作；只能用 white-space 的 nowrap 
				white-space: nowrap;

				.thumbnail {
					display: inline-block;
					
					// TODO 自适应
					height: 150rpx; 
					width: 150rpx;
					flex: 0 0 auto;

					border: solid;



					&.not-first {
						margin-left: 10rpx;
					}

					&.not-selected {
						filter: brightness(30%);
					}
				}
			}
		}

		.desc {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-template-rows: repeat(3, minmax(0, 1fr));

			margin: 40rpx 0 30rpx;

			.pfp-container{
				grid-column: 1;
				grid-row: 1 / 4;
				
				display: flex;
				
				.pfp {
					margin: auto;
					width: 120rpx;
					height: 120rpx;
				}
			}

			

			.username {
				grid-column: 2 / 5;
				grid-row: 1;
			}

			.from {
				grid-column: 2 / 5;
				grid-row: 2;
			}

			.create_time {
				grid-column: 2 / 5;
				grid-row: 3;
			}
		}


	}

	.btns-container {
		display: flex;
		gap: 25rpx;
		.btn {
			display: inline-block;
			flex: 1;
			margin: 0;
			padding: 0;
			
			border: solid;
			border-radius: 25rpx;
			
			
			
			&.share{
				background-color: #F7DAE0;
			}
			
			&.rerun{
				background-color: #F293A5;
			}
		}

	}
</style>
