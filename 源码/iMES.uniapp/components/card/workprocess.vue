<template>
	<view>
		<u-action-sheet :list="sheetList" v-model="moreShow" @click="sheetFun"></u-action-sheet>
		<view class="card">
			<view class="topRow1" @click="gotoDetailFun">
				<view class="name">
					<text>{{item.ProcessName || '暂无'}}</text>
				</view>
				<view>
					<u-icon name="bag" class="colorGray"></u-icon><text style="margin-left: 15rpx;"
						class="colorGray">计划数：</text>
					<text class="colorGray">{{item.PlanQty}}</text>
				</view>
				<view>
					<u-icon name="thumb-up" class="colorGray"></u-icon><text style="margin-left: 15rpx;"
						class="colorGray">良品数：</text>
					<text class="colorGray">{{item.GoodQty}}</text>
				</view>
				<view>
					<u-icon name="thumb-down" class="colorGray"></u-icon><text style="margin-left: 15rpx;"
						class="colorGray">不良品数：</text>
					<text class="colorGray">{{item.NoGoodQty}}</text>
				</view>
			</view>
			<view v-if="!isSelect" class="bottomRow">
				<view class="lxRow">

				</view>
				<view class="lxRow">
					<u-button size="mini" style="margin-right: 30rpx;" type="default" :plain="true"
						ripple-bg-color="#909399" @click="openDetail">详 情</u-button>
					<u-button size="mini" type="primary" ripple-bg-color="#909399" :plain="true" @click="show = true">报 工
					</u-button>
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
				show: false,
				sheetList: [{
						text: '变更为【未开始】'
					},
					{
						text: '变更为【进行中】'
					},
					{
						text: '变更为【已完成】'
					}
				],
				moreShow: false,
				allotShow: false,
				userList: []
			}
		},
		methods: {
			openDetail: function() {
				console.log("4444",this.item);
				uni.navigateTo({
					url: './productDetail?WorkOrderCode=' + this.item.WorkOrderCode + '&Process_Id=' + this.item.Process_Id
				})
			},
			report:function(){
				
			},
			moreShowFun: function() {
				let status = this.item.status
				this.sheetList = [{
						text: '变更为【未开始】'
					},
					{
						text: '变更为【进行中】'
					},
					{
						text: '变更为【已完成】'
					}
				];
				this.moreShow = true;
			},
			gotoDetailFun: function() {
				if (this.isSelect) {
					return
				}
				uni.$khInfo = this.item;
				uni.navigateTo({
					url: './woDetail?index=' + this.index
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
			}
		}
	}
</script>

<style>
	.card {
		width: 698rpx;
		padding: 26rpx 26rpx 10rpx;
		margin: 32rpx 26rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: #d8d8d8 0px 0px 0rpx;
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

	.topRow1 {
		margin-bottom: 16rpx;
		color: #000;
		position: relative;
	}

	.lxIcon {
		width: 52rpx;
		height: 52rpx;
		margin-left: 5rpx;
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
		margin-right: -15rpx;
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
