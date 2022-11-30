<template>
	<view class="page">
		<uni-file-picker limit="1" title="上传图片"></uni-file-picker>

		<view>
			<text>主人想要我变成？</text>
			<radio-group @change="(evt) => form_data.become = evt.detail.value">
				<view v-for="(item, index) in become_options" :key="item">
					<radio :value="item" :id="item" :checked="item === form_data.become"></radio>
					<label :for="item" :class="[{'selected': item === form_data.become}]">{{item}}</label>
				</view>
				
			</radio-group>

		</view>

		<button>马上变身吧</button>

		<view>{{form_data.init_image}}</view>
		<view>{{form_data.become}}</view>
		<view>{{form_data.n_images}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				become_options: ['碰碰运气', '正太', '萝莉', '御姐', '总裁', '宝宝'],
				form_data: {
					init_image: null,
					become: '碰碰运气',
					n_images: 1,
				},
			};
		}
	}
</script>

<style lang="scss">
	radio {
		// 隐藏 radio
		display: none;
	}

	label {
		display: inline-block;
		
		&.selected {
			background-color: #000000;
		}
	}

	

	

	// label:has(>radio:checked){
	// 	border: solid;
	// }
</style>
