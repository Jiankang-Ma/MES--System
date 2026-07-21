<template>
	<view>
		<u-picker :show="moreShow" title="状态变化为" :columns="sheetList" :closeOnClickOverlay="true" @confirm="confirm"
			@close="close"></u-picker>
		<view class="card">
			<view class="topRow1" @click="gotoDetailFun">
				<view class="name" >
					<text>{{item.ProductUserName +'|' + item.ReportTime }}</text>

				</view>
				<view style="margin-top:8rpx;">
					<text class="colorGray">工单编号：</text>
					<text class="colorGray" style="float:right">{{item.WorkOrderCode}}</text>
				</view>
				<view style="margin-top:8rpx;">
					<text class="colorGray">工序名称：</text>
					<text class="colorGray" style="float:right">{{item.ProcessName}}</text>
				</view>
				<view style="margin-top:8rpx;">
					<text  class="colorGray">产品信息：</text>
					<text class="colorGray" style="float:right">{{item.ProductCode + '|' + item.ProductName}}</text>
				</view>
				<view style="margin-top:8rpx;">
					<text class="colorGray">报工时间：</text>
					<text class="colorGray" style="float:right">{{$u.timeFormat(item.StartDate, 'yyyy-mm-dd')}} ~ {{$u.timeFormat(item.EndDate, 'yyyy-mm-dd')}}</text>
				</view>
				<view style="margin-top:8rpx;">
					<text  class="colorGray">报工数量：</text>
					<text class="colorGray" style="float:right">总{{item.ReportQty}}/良品{{item.GoodQty}}/不良品{{item.NoGoodQty}}</text>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			isSelect: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				sheetList: [
					['未审批', '已审批']
				],
				moreShow: false,
				allotShow: false,
				userList: []
			}
		},
		methods: {
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				console.log('confirm', e)
				if (e.value == '未审批') {
					status = 1
				} else if (e.value == '已审批') {
					status = 2
				}
				let that = this;
				this.http.get("api/Production_WorkOrder/changeUpdate?workOrderId=" + this.item.WorkOrder_Id +
					"&status=" + status, {}, true).then(result => {
					that.$u.toast("变更成功！");
					uni.$emit('cxGetDataFun');
				})
				this.moreShow = false
			},
			close(e) {
				this.moreShow = false
			},
			cancel() {
				// console.log('cancel');
				this.moreShow = false
			},
			moreShowFun: function() {
				let status = this.item.status
				this.moreShow = true;
			},
			gotoDetailFun: function() {
				if (this.isSelect) {
					return
				}
				uni.$reportInfo = this.item;
				uni.navigateTo({
					url: './reportwoDetail?index=' + this.index
				})
			},
			sheetFun: function(i) {
				let arr = this.sheetList;
				let str = arr[i].text;
				let status = 1
				if (str == '变更为【未开始】') {
					status = 1
				} else if (str == '变更为【进行中】') {
					status = 2
				} else if (str == '变更为【已完成】') {
					status = 3
				}
				let that = this;
				this.http.get("api/Production_WorkOrder/changeUpdate?workOrderId=" + this.item.WorkOrder_Id +
					"&status=" + status, {}, true).then(result => {
					that.$u.toast("变更成功！");
					uni.$emit('cxGetDataFun');
				})
			},
		}
	}
</script>

<style>
	.card {
		width: 698rpx;
		padding: 26rpx 26rpx 10rpx 25rpx;
		margin: 15rpx 26rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: #d8d8d8 0px 0px 0rpx;
		position: relative;
		background-color: #FFFFFF;
		font-size: 13px;
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

	.topRow1 {
		margin-bottom: 16rpx;
		color: #000;
		position: relative;
	}

	.name {
		font-size: 13px;
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

	.khJieDuan {
		position: absolute;
		right: 0;
		top: 50rpx;
		font-weight: bold;
	}

	.khType {
		position: absolute;
		right: 0;
		top: 72rpx;
		font-weight: bold;
	}
</style>
