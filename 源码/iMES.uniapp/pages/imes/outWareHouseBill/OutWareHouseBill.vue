<template>
	<view>
			<view-grid ref="grid" :index="true" :options="options">
				<!-- 自定义slot -->
				<view @click="viewClick" slot="gridHeader" class="grid-header">
					<imes-alert>
						<view>点击编辑或新建跳转到明细页面</view>
						<view></view>
					</imes-alert>
				</view>
			</view-grid>
	</view>
</template>

<script>
	//************************************************
	//  *Author：COCO
	//  *自定义业务逻辑扩展
	//************************************************
	import extend from './OutWareHouseBillExtend.js'
	import options from './OutWareHouseBillOptions.js';
	let _options = options();
	_options.extend = extend;
	export default {
		data() {
			return {
				gridHeaderText: "", //随便输入字符后可以显示出来
				options: _options
			}
		},
		//注意函数和data同级,不要写在methods内
		onNavigationBarButtonTap(e) {
			uni.switchTab({
				url: '../workorder/workorder'
			});
		},
		onShow() {},
		methods: {
			viewClick() {
				//获取生成页面grid的对象
				console.log(this.$refs.grid.searchFormFields)
			}
		}
	}
</script>

<style>
</style>
