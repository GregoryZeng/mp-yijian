<template>
	<view class="page">
		<view class="file-picker-section">
			<text>上传参考图片</text>
			<view class="file-picker-boxed">
				<yj-file-picker limit="1" fileMediatype="image" @success="form_data.init_image = $event.tempFilePaths"
					@delete="form_data.init_image = ''"
					:init_img="'../../static/templates/pet-humanoid-upload-img.jpg'">
				</yj-file-picker>
				<image src="@/static/common/paw.png" class="deco-paw"></image>
			</view>

		</view>

		<view class="become-section">
			<text>主人想要我变成？</text>
			<radio-group @change="(evt) => form_data.become = evt.detail.value">
				<label v-for="(item, index) in become_options" :key="item"
					:class="[{'selected': item === form_data.become}]">
					<radio :value="item" :checked="item === form_data.become"></radio>
					{{item}}
				</label>
			</radio-group>
		</view>

		<view class="n-images-section">
			<text>生成张数</text>
			<view class="slider-container">
				<!-- 原生 slider 不好看 -->
				<!-- <slider class="slider" min="1" max="8" value="1" step="1"
					@change="(evt) => form_data.n_images = evt.detail.value" block-color="#eda721" show-value="true"
					block-size="28" /> -->

				<!-- 改造的 slider 稳定性不好 -->
				<!-- <yj-slider :min="1" :max="8" @changing="form_data.n_images = $event.value" block-size="130"
					activeColor="#d8d8d8" blockColor="#eda721" blockOuterColor="rgba(0,0,0,0)" lineSize="20" >
				</yj-slider> -->
				
				<radio-group @change="(evt) => form_data.n_images = +(evt.detail.value)">
					<label v-for="(item, index) in n_images_options" :key="item"
						:class="[{'selected': item === form_data.n_images}]">
						<radio :value="item" :checked="item === form_data.n_images"></radio>
						{{item}}
					</label>
				</radio-group>
			</view>
		</view>

		<button class="submit-btn" @click="submit" :disabled="!form_data.init_image">马上变身吧！</button>

		<!-- <view>{{form_data.init_image}}</view>
		<view>{{form_data.become}}</view>
		<view>{{form_data.n_images}}</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				become_options: ['碰碰运气', '正太', '萝莉', '御姐', '总裁', '宝宝'],
				n_images_options: [1,2,4],
				form_data: {
					init_image: "",
					become: '碰碰运气',
					n_images: 1,
				},
			};
		},
		methods: {
			submit(e) {
				console.log('submit');
				console.log(typeof this.form_data.n_images)
				// uniCloud.callFunction({
				// 	name: 'submit-task',
				// 	data: {
				// 		task: 'pet-humanoid',
				// 		form_data: form_data
				// 	}
				// });

				uni.navigateTo({
					url: '/pages/detail/detail',
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

			}
		}
	}
</script>

<style lang="scss">
	.page {
		padding: 0 20rpx 200rpx;

		// 让提交按钮可以用 fixed position
		position: relative;
	}

	radio-group {
		radio {
			// 隐藏 radio
			display: none;
		}
	
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	
		row-gap:30rpx;
		column-gap:20rpx;
	
		label {
			text-align: center;
	
			border: solid;
			border-radius: 20rpx;
			padding: 15rpx 10rpx 15rpx;
	
			&.selected {
				background-color: #eda721;
	
			}
		}
	}


	.file-picker-section {
		text {
			display: block;
			margin: 30rpx 0 30rpx;
			
			font-weight: bold;
		}

		.file-picker-boxed {
			margin: 0 auto 0;
			border: solid;
			border-radius: 20rpx;
			padding: 15rpx;

			// 保证上传图片之后边框不坍缩
			min-height: 480rpx;

			position: relative;

			// 让上传的图片竖直方向居中
			display: flex;
			align-items: center;

			.deco-paw {
				// 将猫爪挂在边框上
				position: absolute;
				right: 0;
				bottom: 0;
				width: 60rpx;
				height: 60rpx;
				transform: translate(10%, 30%);
			}
		}

	}


	.become-section {
		margin: 50rpx 0 50rpx;

		text {
			display: block;
			margin: 30rpx 0 30rpx;
			
			font-weight: bold;
		}

		

	}

	.n-images-section {
		margin: 50rpx 0 50rpx;

		text {
			display: block;
			margin: 30rpx 0 30rpx;
			
			font-weight: bold;
		}

		.slider-container {
			position: relative;
			// margin: 0 30rpx 0;

			.slider {}
		}
	}



	.submit-btn {
		// fixed position 似乎没办法继承 parent 的宽度，只能通过 left 和 right 控制和边框的距离
		// https://stackoverflow.com/questions/18442628/position-fixed-width-100
		position: fixed;
		left: 20rpx;
		right: 20rpx;

		// TODO：计算安全区？
		bottom: 100rpx;


		border: solid;
		border-radius: 30rpx;
		background-color: #f194a6;
	}
</style>
