<template>
	<view class="page">
		<view class="file-picker-section">
			<text>上传参考图片</text>
			<view class="file-picker-boxed">
				<yj-file-picker limit="1" fileMediatype="image"
					@success="form_data.init_image = $event.tempFilePaths[0]" @delete="form_data.init_image = ''"
					:init_img="'https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bea3e18e-04e6-4d99-9abc-6f15168f617b.jpg'">
				</yj-file-picker>
				<image src="@/static/common/paw.png" class="deco-paw"></image>
			</view>

		</view>



		<view class="n-images-section">
			<text>生成张数</text>
			<view class="slider-container">

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

		<view class="loading" v-if="click_submit">
			<yj-loading></yj-loading>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {

				n_images_options: [1, 2, 4],
				form_data: {
					init_image: "",
					n_images: 1,
				},

				click_submit: false,
			};
		},
		methods: {
			submit(e) {
				if (this.click_submit) {
					return;
				}
				this.click_submit = true;
				console.log('submit');
				
				let that = this;
				uniCloud.callFunction({
					name: 'submit-task',
					data: {
						task: 'christmas',
						form_data: this.form_data
					}
				}).then(res => {
					that.click_submit = false;
					console.log(res);
					if (!res.errCode) {
						if (res.result.errCode) {
							console.log('res.result.errCode true', res.errCode)
							uni.showToast({
								title: res.result.errMsg,
								icon: 'none'
							});
						} else {
							console.log('res.result.errCode false', res.errCode)
							let task_id = res.result.task_id;
							console.log('nav args', task_id, this.form_data.init_image, this.form_data.n_images)
							uni.navigateTo({
								url: `/pages/detail/detail?task_id=${task_id}&init_image=${this.form_data.init_image}&n_images=${this.form_data.n_images}`,
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

	.loading{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
		display: flex;
		flex-direction: column;
		align-items: center;
	}


</style>
