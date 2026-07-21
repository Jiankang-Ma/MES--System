<template>
	<view>
			<fy-dropdown :menuList="menuList">
				<fy-dropdown-item v-model="statusValue" dropdownKey="status" :options="statusOptions"
					@change="handlerColumnChange"></fy-dropdown-item>
				<fy-dropdown-item v-model="sortValue" dropdownKey="sort" :options="sortOptions" type="column"
					@change="handlerSortTypeChange"></fy-dropdown-item>
				<fy-dropdown-item v-model="productValue" dropdownKey="product" :options="productOptions"  type="column"
					@change="handlerProductTypeChange"></fy-dropdown-item>
			</fy-dropdown>
		<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectWorkorder" refresher-enabled
			:refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray"
			@refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-if="list.length > 0">
				<view v-for="(item, index) in list" :key="index" @click="woCardClickFun(item)">
					<woCard :item="item" :isSelect="isSelect" :index="index" @cxGetDataFun="cxGetDataFun"></woCard>
				</view>
				<getMore :isMore="isMore" nullMsg="已加载全部~"></getMore>
				<view class="h200"></view>
			</view>
			<dataNull v-else src="/static/img/dataNull.png" title="暂无相关工单哦~"></dataNull>
		</scroll-view>
		<view @click="gotoScan" class="scanBtn">
			<u-icon name="scan" color="#ffffff" size="20"></u-icon>
		</view>
		<u-action-sheet :list="sheetList" v-model="moreShow"></u-action-sheet>
	</view>
</template>

<script>
	let that = this;
	import {
		tyDropDown,
		khsxData,
		datePxData
	} from '../../../static/utils/dropdown.js'
	import dataNull from '@/components/dataNull/dataNull.vue'
	import getMore from '@/components/getMore/getMore.vue'
	import woCard from '../../../components/card/workorder.vue'
	import {
		formateDate
	} from '../../../util/date.js'
	export default {
		components: {
			dataNull,
			getMore,
			woCard
		},
		data() {
			return {
				menuList: [{
					title: '状态',
					dropdownKey: 'status'
				}, {
					title: '排序',
					dropdownKey: 'sort'
				}, {
					title: '选择产品',
					dropdownKey: 'product'
				}],
				sortValue: '',
				sortOptions: [{
					title: '排序时间',
					key: 'date',
					default: '',
					list: [{
						text: '创建时间-升序',
						value: '1'
					}, {
						text: '创建时间-降序',
						value: '2'
					}, {
						text: '计划开始时间-升序',
						value: '3'
					}, {
						text: '计划开始时间-降序',
						value: '4'
					}, {
						text: '计划结束时间-升序',
						value: '5'
					}, {
						text: '计划结束时间-降序',
						value: '6'
					}]
				}, ],
				productValue: '',
				productOptions: [{
					title: '产品列表',
					key: 'product',
					default: '',
					list: [{
						text: '全部',
						value: ''
					}]
				}],
				triggered: false,
				dropdown1: '全部',
				statusOptions: [],
				statusValue:"",
				optionsPx: datePxData,
				sxList: [],
				list: [],
				moreShow: false,
				sheetList: [],
				isMore: true,
				pageIndex: 1,
				scrollHeight: '667px',
				pageType: '',
				sortObj: {
					CreateDate: -1
				},
				optionsReq: {}, // 第一个下拉框请求参数
				dateReq: [], // 日期相关请求参数
				sxReq: [], // 筛选想请求参数
				matchObj: {},
				searchValue: '',
				isSelect: false,
				tabNoEqualArr: [], //标签页不等于数据
				depId: undefined,
				queryWheres: []
			}
		},
		onLoad(e) {
			that = this;
			this.getAllUser();
			this.getAllProduct();
			let khsxList = JSON.stringify(khsxData);
			that.sxList = JSON.parse(khsxList);
			let obj = {};
			that.statusOptions = [{
		value: 0,
		label: '全部'
	},{
		value: 1,
		label: '未开始'
	},
	{
		value: 2,
		label: '进行中'
	},
	{
		value: 3,
		label: '已完成'
	},
	{
		value: 4,
		label: '已撤回'
	},
	{
		value: 5,
		label: '已取消'
	}
];
			if (e.type) {
				that.isSelect = true;
			}
			that.matchObj = obj;
			that.optionsReq = JSON.stringify(obj);
			that.pageType = e.type ? e.type : '';
			uni.getSystemInfo({
				success(res) {
					that.scrollHeight = res.windowHeight - 40 + 'px';
				}
			})
			that.selectWorkorder();
			uni.$on('updateListByIndex', that.updateListByIndex)
			uni.$on('cxGetDataFun', that.cxGetDataFun)
		},
		onBackPress() {
			uni.$off('updateListByIndex', that.updateListByIndex)
			uni.$off('cxGetDataFun', that.cxGetDataFun)
		},
		methods: {
			gotoScan:function(){
				var that = this;
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function(res) {
						this.queryWheres = [];
						if (!res.result) {
							that.queryWheres.push({
								name: "WorkOrderCode",
								value: res.result,
								displayType: "like"
							});
						}
						that.cxGetDataFun()
					}
				});
			},
			getAllUser: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 10000,
					sort: "CreateDate"
				};
				this.http.post("api/Sys_User/getPageData", params, true).then(result => {
					uni.$userInfo = result.rows;
				})
			},
			// 查询工单
			selectWorkorder: function() {
				if (!that.isMore) {
					return
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				let column = "ModifyDate";
				for (var key in this.sortObj) {
					column = key
				}
				let params = {
					order: this.sortObj[column] == 1 ? "asc" : "desc",
					page: this.pageIndex,
					row: 10,
					sort: column
				};
				//生成查询参数
				params.wheres = JSON.stringify(this.queryWheres);
				this.http.post("api/Production_WorkOrder/getPageData", params, true).then(result => {
					this.triggered = false;
					if (that.pageIndex == 1) {
						that.list = [];
					}
					if (result.rows.length == 10) {
						that.pageIndex += 1;
						that.isMore = true;
					} else {
						that.isMore = false;
					}
					this.list = this.list.concat(result.rows);
				})
			},
			// 客户点击方法
			woCardClickFun: function(item) {
				if (that.pageType == 'lxr') {
					uni.$emit('kehuBindFun', {
						clientName: item.clientName,
						clientId: item._id
					})
					uni.navigateBack()
				}
			},
			getAllProduct: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 10000,
					sort: "CreateDate"
				};
				this.http.post("api/Base_Product/getPageData", params, true).then(result => {
					let productlist = result.rows.map(item => ({
						text: item.ProductName,
						value: item.Product_Id
					}));
					that.productOptions[0].list = that.productOptions[0].list.concat(productlist);
				})
			},
			handlerColumnChange(e) {
				this.queryWheres = [];
				this.pageIndex = 1;
				this.isMore = true;
				if (e != "") {
					this.queryWheres.push({
						name: "Status",
						value: "" + e + ""
					})
				}
				this.selectWorkorder();
				this.columnOptions.forEach(item => {
					item.default = e.data[item.key];
				})
			},
			handlerSortTypeChange(e) {
				if (e.cancel) return;
				this.pageIndex = 1;
				this.isMore = true;
				this.sortObj = {}
				switch (e.data.date) {
					case '1':
						this.sortObj.CreateDate = 1;
						break;
					case '2':
						this.sortObj.CreateDate = -1;
						break;
					case '3':
						this.sortObj.PlanStartDate = 1;
						break;
					case '4':
						this.sortObj.PlanStartDate = -1;
						break;
					case '5':
						this.sortObj.PlanEndDate = 1;
						break;
					case '6':
						this.sortObj.PlanEndDate = -1;
						break;
					default:
						this.sortObj.CreateDate = -1;
				}
				this.selectWorkorder();
				this.sortOptions.forEach(item => {
					item.default = e.data[item.key];
				})
			},
			handlerProductTypeChange(e){
				if (e.cancel) return;
				this.queryWheres = [];
				this.pageIndex = 1;
				this.isMore = true;
				if (e.data.product != "") {
					this.queryWheres.push({
						name: "Product_Id",
						value: "" + e.data.product + ""
					})
				}
				this.selectWorkorder();
				this.productOptions.forEach(item => {
					item.default = e.data[item.key];
				})
			},
			// 下拉刷新
			onRefresh: function() {
				if (that.triggered) return
				that.triggered = true;
				that.cxGetDataFun();
			},
			onRestore: function(e) {
				that.triggered = false; // 需要重置
			},
			// 重新获取数据
			cxGetDataFun: function() {
				that.pageIndex = 1;
				that.isMore = true;
				that.selectWorkorder();
			},
			// 通过下标更新list数据
			updateListByIndex: function(e) {
				that.$set(that.list, parseInt(e.index), e.obj)
			},
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
	}

	.scanBtn {
		width: 65rpx;
		height: 65rpx;
		border-radius: 50%;
		background-image: linear-gradient(45deg, #11AAED, #00aaff);
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 300rpx;
		right: 35rpx;
		z-index: 100;
	}

	.scanBtn:active {
		background-image: linear-gradient(45deg, #00aaff, #007aff);
	}

	.card {
		width: 698rpx;
		padding: 10rpx 10rpx 5rpx;
		margin: 20rpx 14rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
		box-shadow: #d8d8d8 0px 0px 16rpx;
		position: relative;
		background-color: #FFFFFF;
	}

	.genjinBtn {
		position: absolute;
		right: 26rpx;
		top: 26rpx;
		background-color: #007AFF;
		color: #FFFFFF;
		text-align: center;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		font-size: 14px;
	}

	.genjinBtn:active {
		background-color: #13B8FF;
	}

	.topRow {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.txView {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 26rpx;
	}

	.txViewImg {
		width: 100%;
		height: 100%;
	}

	.info {
		width: 492rpx;
		font-size: 15px;
		color: #000;
	}

	.name {
		font-size: 16px;
		margin-bottom: 8rpx;
		color: #000000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}

	.bottomRow {
		width: 100%;
		padding-top: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #f0f0f0;
		font-size: 15px;
		color: #007AFF;
	}

	.lxRow {
		display: flex;
		align-items: center;
	}

	.lxRow>image {
		width: 52rpx;
		height: 52rpx;
		margin-right: 26rpx;
	}

	.bqRow {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.bqRow>text {
		font-size: 14px;
		color: #888888;
	}

	.bqRow>view {
		padding: 6rpx 16rpx;
		font-size: 14px;
		background-color: rgba(255, 85, 127, 0.1);
		color: #ff5500;
		border-radius: 10rpx;
		margin: 6rpx 26rpx 20rpx 0;
	}
</style>
