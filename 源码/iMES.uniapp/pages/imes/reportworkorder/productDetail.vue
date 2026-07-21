<template>
	<view class="content">
		<!-- 此处为了让reload时不自动滚动到顶部，需要设置auto-clean-list-when-reload和auto-scroll-to-top-when-reload为false，即在reload时关闭自动清空数组和自动滚动到顶部 -->
		<!--工单基本信息-->
			<woCard :item="reportInfo" :isSelect="true"></woCard>
			<view class="cardDetail" style="margin-top: 10rpx;">
				<view style="padding:10rpx 40rpx 20rpx 30rpx;font-size: 16px;font-weight: bold;">报工列表</view>
			</view>
		<view class="cardDetail" v-for="(item, index) in reportList" >
			<view style="padding: 25rpx;">
				<view style="margin-bottom: 16rpx;color: #000;position: relative;">
					<view style="font-size: 16px;
								margin-bottom: 8rpx;
								color: #000000;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-weight: bold;">
						<text  style="margin-left: 15rpx;">{{item.ProductUser || '暂无'}}</text>
						<view style="float: right;">
							<text style="margin-left: 15rpx;font-size: 14px;font-weight: normal;" >{{item.ReportTime}}</text>
						</view>
					</view>
					<view>
						<text style="margin-left: 15rpx;" class="colorGray">良品数：</text>
						<text class="colorGray">{{item.GoodQty}}</text> 
						<view style="float: right;">
							<text style="margin-left: 15rpx;" class="colorGray">不良品数：</text>
							<text class="colorGray">{{item.NoGoodQty}}</text>
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import woCard from '@/components/card/workorder.vue'
	export default {
		components: {
			woCard
		},
		data() {
			return {
				reportInfo: [],
				Process_Id: "",
				value: '进行中',
				reportList: {
					type: Object,
					default: () => {}
				},
				list: [{
						name: '未开始',
						disabled: false
					},
					{
						name: '进行中',
						disabled: false
					},
					{
						name: '已完成',
						disabled: false
					}
				],
			}
		},
		onLoad(e) {
			this.Process_Id = e.Process_Id;
			this.reportInfo = uni.$reportInfo || {};
			this.value = this.reportInfo.Status == "2" ? "进行中" : this.reportInfo.Status == "3" ? "已完成" : "未开始";
			this.selectReportList();
		},
		//注意函数和data同级,不要写在methods内
		onNavigationBarButtonTap(e) {
			uni.switchTab({
				url: '../workorder/workorder'
			});
		},
		methods: {
			selectReportList: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 1000,
					sort: "CreateDate",
					value: this.reportInfo.WorkOrder_Id
				};
				let wheres = [{
						"name": "WorkOrder_Id",
						"value": this.reportInfo.WorkOrder_Id,
					},
					{
						"name": "Process_Id",
						"value": this.Process_Id
					},
					{
						"name": "ProductCode",
						"value": this.reportInfo.ProductCode
					}
				]
				params.wheres = JSON.stringify(wheres);
				this.http.post("api/Production_ReportWorkOrder/getPageData", params, true).then(result => {
					this.reportList = result.rows;
					this.reportList.forEach(function(item, index) {
						item.ProductUser = uni.$userInfo.find(key => key.User_Id == item.ProductUser).UserTrueName
					})
				})
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
	}

	.cardDetail {
		width: 698rpx;
		padding: 10rpx 10rpx 5rpx;
		margin: 20rpx 25rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
		box-shadow: #d8d8d8 0px 0px 0rpx;
		position: relative;
		background-color: #FFFFFF;
	}

	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}
</style>
