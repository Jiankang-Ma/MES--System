<template>
	<view>
		<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectDataFun"
			refresher-enabled :refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-if="list.length > 0">
				<view v-for="(item, index) in list" :key="index" @click="cardClickFun(item)">
					<product :item="item" :isSelect="isSelect" :index="index"></product>
				</view>
				<view class="h200"></view>
			</view>
			<dataNull v-else src="../../../static/img/dataNull.png" title="暂无相关产品哦~"></dataNull>
		</scroll-view>
	</view>
</template>

<script>
	let that = this;
	import dataNull from '../../../components/dataNull/dataNull.vue'
	import getMore from '../../../components/getMore/getMore.vue'
	import product from '../../../components/card/product.vue'
	export default {
		components: {
			dataNull,
			getMore,
			product
		},
		data() {
			return {
				dropdown1: '全部',
				list: [],
				pageIndex: 1,
				scrollHeight: '667px',
				triggered: false,
				pageType: '',
				sortObj: {
					update_date: -1
				},
				optionsReq: {}, // 第一个下拉框请求参数
				dateReq: [], // 日期相关请求参数
				sxReq: JSON.stringify({}), // 筛选想请求参数
				matchObj: {},
				searchValue: '',
				clientIdArr: [],
				isSelect: false,
				tabNoEqualArr: [], //标签页不等于数据
				depId: undefined
			}
		},
		onLoad(e) {
			that = this;
			let obj = {};
			that.pageType = e.type ? e.type : '';
			if(e.clientId) {
				that.clientIdArr = [e.clientId]
			}
			if(e.type) {
				that.isSelect = true;
			}
			that.matchObj = obj;
			that.optionsReq = JSON.stringify(obj);
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight - 40 + 'px';
				}
			})
		
			that.selectDataFun()
			uni.$on('deleteCardFun', that.deleteCardFun);
			uni.$on('addItemInListFun', that.addItemInListFun);
		},
		onBackPress() {
			uni.$off('deleteCardFun', that.deleteCardFun)
			uni.$off('addItemInListFun', that.addItemInListFun)
		},
		methods: {
			// 查询用户
			selectDataFun: function() {
				
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				let params = {
					order: "desc",
					page: 1,
					rows: 10000,
					sort: "CreateDate"
				};
				this.http.post("api/Base_Product/getPageData", params, true).then(result => {
					that.list = result.rows;
				})
			},
			// 卡片点击方法
			cardClickFun: function(item) {
				if(that.pageType == 'report') {
					uni.$emit('getProductBindFun', { productName: item.ProductName, productId: item.Product_Id })
					uni.navigateBack()
				} 
			},
			// 下拉刷新
			onRefresh: function() {
				if(that.triggered) return
				that.triggered = true;
				that.cxSelectDataFun();
			},
			onRestore: function(e) {
				that.triggered = false; // 需要重置
			},
			// 重新获取数据
			cxSelectDataFun: function() {
				that.pageIndex = 1;
				that.selectDataFun();
			},
			deleteCardFun: function(e) {
				let arr = that.list;
				arr.splice(e.index, 1);
				that.list = arr;
			},
			// add页面新增数据
			addItemInListFun: function(e) {
				let arr = that.list;
				arr.unshift(e);
				that.list = arr;
				uni.pageScrollTo({
					scrollTop: 0
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
	
</style>
