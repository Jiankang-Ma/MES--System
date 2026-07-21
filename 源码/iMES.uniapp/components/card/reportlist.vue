<template>
	<view>
		<view style="padding: 25rpx;">
			<view class="topRow1">
				<view class="name">
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
</template>

<script>
	export default {
		props: {
			item: {
				
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
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.topRow1 {
		margin-bottom: 16rpx;
		color: #000;
		position: relative;
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
</style>
