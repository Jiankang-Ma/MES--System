<template>
	<view>
		<view class="box" v-for="(item, index) in list" :key="index">
			<view class="tilte">{{item.name}}</view>
			<view class="cardList">
				<view class="card" v-for="(obj, iii) in item.arr" :key="iii" @click="skipPageFun(obj)">
					<image v-if="obj.img" :src="obj.img" mode="aspectFill"></image>
					<u-icon v-else :name="obj.icon" color="#007aff" size="68" class="iconClass"></u-icon>
					<view>{{obj.name}}</view>
				</view>
			</view>
		</view>
		<!--无网络提示-->
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	import {
		getDayByNumFun,
		getDayFun,
		getMonthFun
	} from '@/static/utils/date.js'
	export default {
		data() {
			return {
				list: [{
						name: '快捷入口',
						arr: [{
								name: '产量统计',
								img: '../../static/imes/todayproduction.png',
								url: '../report/View_OutputStatistics/View_OutputStatistics',
								menu_id: 'OutputStatistics'
							},
							{
								name: '生产任务',
								img: '../../static/imes/workorderlist.png',
								url: '../imes/workorderlist/workorderlist',
								menu_id: 'workorderlist'
							},
							{
								name: '不良分布',
								img: '../../static/imes/nogood.png',
								url: '../report/View_DefectItemDistribute/View_DefectItemDistribute',
								menu_id: 'View_DefectItemDistribute'
							},
							{
								name: '不良汇总',
								img: '../../static/imes/todayreport.png',
								url: '../report/View_DefectItemSummary/View_DefectItemSummary',
								menu_id: 'View_DefectItemSummary'
							},

						]
					},
					{
						name: '业务功能',
						arr: [{
								name: '销售订单',
								img: '../../static/imes/salesorder.png',
								url: '../imes/salesOrder/SalesOrder',
								menu_id: 'SalesOrder'
							},
							{
								name: '生产计划',
								img: '../../static/imes/planorder.png',
								url: '../imes/productPlan/ProductPlan',
								menu_id: 'ProductPlan'
							},
							{
								name: '装配工单',
								img: '../../static/imes/assworkorder.png',
								url: '../imes/assembleWorkOrder/AssembleWorkOrder',
								menu_id: 'AssembleWorkOrder'
							},
							// { name: '个人', img: '../../static/imes/user.png', url: './mine/mine', menu_id: 'contract' },
							{
								name: '出库单',
								img: '../../static/imes/outwarehouse.png',
								url: '../imes/outWareHouseBill/OutWareHouseBill',
								menu_id: 'OutWareHouseBill'
							},
							{
								name: '入库单',
								img: '../../static/imes/inwarehouse.png',
								url: '../imes/wareHouseBill/WareHouseBill',
								menu_id: 'WareHouseBill'
							},
						]
					},
					{
						name: '报表看板',
						arr: [{
								name: '库存余额',
								img: '../../static/imes/inventory.png',
								url: '../warehouse/View_StockBalance/View_StockBalance',
								menu_id: 'View_StockBalance'
							},
							{
								name: '数据看板',
								img: '../../static/imes/board.png',
								url: '../board/index',
								menu_id: 'contract'
							}
						]
					}
				]
			}
		},
		onShow() {

		},
		methods: {
			skipPageFun: function(obj) {
				let url = obj.url;
				if (obj.menu_id == "workorderlist") {
					uni.switchTab({
								url: url
							});
				} else {
					uni.navigateTo({
						url
					})
				}
			},
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
		padding-bottom: 100rpx;
	}

	.box {
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 16rpx;
		width: 686rpx;
		margin: 32rpx;
		padding: 26rpx;
		box-shadow: #dddddd 0px 0px 0rpx;
	}

	.tilte {
		font-size: 32rpx;
		font-weight: bold;
	}

	.cardList {
		margin-top: 26rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.card {
		font-size: 28rpx;
		width: 159rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.card>image {
		width: 68rpx;
		height: 68rpx;
		margin-bottom: 6rpx;
	}

	.iconClass {
		margin-bottom: 6rpx;
	}
</style>
