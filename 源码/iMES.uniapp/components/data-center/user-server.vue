<template>
	<view class="content">
		<scroll-view class="data_body" scroll-y :style="{height:scrollHeight}">
			<template v-if="true">
				<!-- 数量统计-->
				<view class="view_item">
					<view class="title">数量统计</view>
					<view class="progress_circle">
						<view v-for="(item,index) in CircleData" :key="index"
							:class="['progress_block','block_'+index]">
							<view class="name">{{item.ItemName}}</view>
							<view class="value">{{item.Qty}}</view>
							<view class="planet">
								<view class="planet_shadow"></view>
								<view class="crater1"></view>
								<view class="crater2"></view>
								<view class="crater3"></view>
								<view class="crater4"></view>
							</view>
							<view class="star" :class="['star'+index]"></view>
							<view class="star pink" :class="['star'+index]"></view>
							<view class="star blue" :class="['star'+index]"></view>
							<view class="star yellow" :class="['star'+index]"></view>
						</view>
					</view>
				</view>
				<view class="split_line"></view>

				<!-- 不良品项分布 -->
				<view class="friend_operate">
					<view class="title">不良品项分布
					</view>
					<view v-if="delayload" class="charts-box">
						<qiun-data-charts type="ring" canvasId="four_b" :canvas2d="isCanvas2d" :resshow="delayload"
							:opts="{legend:{position: 'bottom'},title:{name: '',},subtitle: {name: ''}}"
							:chartData="ProductRateData" />
					</view>
				</view>
				<view class="split_line"></view>

				<!-- 工序计划数 -->
				<view class="friend_operate">
					<view class="title">工序计划数
					<text class="font-small" style="color: #ff9900;">(Top5)</text></view>
					<view v-if="delayload" class="charts-box" style="height: 300px;">
						<qiun-data-charts type="mix" canvasId="four_c" :canvas2d="isCanvas2d" :resshow="delayload"
							:opts="{yAxis:{data:[{position: 'left',title: '',min:0,unit:''}]}}"
							:chartData="TrendData" />
					</view>
				</view>
				<view class="split_line"></view>

				<!-- 工序报工数 -->
				<view class="friend_operate">
					<view class="title">工序报工数<text class="font-small" style="color: #ff9900;">(Top5)</text></view>
					<progress-bar :isRank="isRank" :content="RankData" />
				</view>
			</template>
			<template v-else>
				<view class="container padding_stand-big normal_color">
					<li class="iconfont icon-cry cry"></li>暂无数据
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import CircleData from "../../static/json/user-server/1.json"
	import ProgressBar from "../progress-bar/progress-bar.vue"
	import ProductRateData from '../../static/json/user-server/2.json';
	import TrendData from '../../static/json/user-server/3.json';
	import RankData from '../../static/json/user-server/4.json';
	export default {
		name: "user-server",
		props: {
			scrollHeight: {
				type: String,
				default: "600px"
			}
		},
		components: {
			ProgressBar
		},
		data() {
			return {
				CircleData,
				TrendData,
				ProductRateData,
				RankData,
				isRank: true,
				isCanvas2d: this.$Config.ISCANVAS2D,
				delayload: false, //延时加载图表，否则会出现图表加载完后定位错乱
			}
		},
		methods: {
			async getData() {
				uni.showLoading();
				await setTimeout(() => {
					this.delayload = true;
					uni.hideLoading();
				}, 1000)
			},
			getCircleData() {
				let urlWo = 'api/Production_WorkOrder/getHomeStatisticsNumber';
				//给工序名称重新绑定数据源
				this.http.get(urlWo, {}, true).then((result) => {
					this.CircleData = result.filter(item => item.ItemName != "不良品总数" &&
						item.ItemName != "销售订单占比");
				});
			},
			getDefectItem(){
				let urlWo = 'api/Base_DefectItem/getAppHomeDefectValue';
				//给工序名称重新绑定数据源
				this.http.get(urlWo, {}, true).then((result) => {
					this.ProductRateData.series = result
				});
			},
			getProcessTop5(){
				let urlWo = 'api/Base_Process/getAppHomeProcessTop5';
				//给工序名称重新绑定数据源
				this.http.get(urlWo, {}, true).then((result) => {
					let categories = result.map(item=>(item.name));
					let data = result.map(item=>(item.data));
					this.TrendData.categories = categories;
					this.TrendData.series[0].data = data;
				});
			},
			getReportProcessTop5() {
				let urlWo = 'api/Production_ReportWorkOrder/getAppHomeReportProcessTop5';
				//给工序名称重新绑定数据源
				this.http.get(urlWo, {}, true).then((result) => {
					this.RankData = result.map(item =>({name:item.name,num:item.data,width:"","background":"#0FEBE1"}));
				});
			},
		},
		mounted() {
			this.getData();
			this.getCircleData();
			this.getDefectItem();
			this.getProcessTop5();
			this.getReportProcessTop5();
		}
	}
</script>

<style scoped lang="scss">
	.content {
		padding-top: 10rpx;
	}

	.data_body {
		height: 100%;
		text-align: center;
		color: #333333;
		background-repeat: repeat;
		background-color: #ffffff;

		.friend_operate {
			padding: 30rpx 20rpx;

			.title {
				text-align: left;
				margin-bottom: 30rpx;
				font-size: 40rpx;
			}
		}

		.view_item {
			padding: 30rpx 20rpx;

			.title {
				text-align: left;
				margin-bottom: 30rpx;
				font-size: 40rpx;
			}
		}

		.progress_circle {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: center;
			height: 450rpx;

			.progress_block {
				width: 45%;
				border-radius: 20rpx;
				height: 180rpx;
				position: relative;
				overflow: hidden;

				.name {
					color: #fff;
					font-size: 30rpx;
					position: absolute;
					top: 40rpx;
					left: 93rpx;
					max-width: 200rpx;
				}

				.value {
					color: #fff;
					font-size: 40rpx;
					position: absolute;
					top: 84rpx;
					left: 100rpx;
					max-width: 144rpx;
				}

				.circle {
					position: absolute;
					right: 8rpx;
					top: 16rpx;
				}

				.arcbar {
					position: absolute;
					right: -4rpx;
					top: 8rpx;
				}
			}

			.block_0 {
				background-color: #0FC3FF;
			}

			.block_1 {
				background-color: #FF6B8B;
			}

			.block_2 {
				background-color: #FFCB1D;
			}

			.block_3 {
				background-color: #3BDCAA;
			}
		}
	}

	.planet {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #333;
		position: absolute;
		left: -13px;
		bottom: -26px;
		overflow: hidden;
		opacity: 0.5;
		z-index: 0;
	}

	.planet_shadow {
		position: absolute;
		border-radius: 50%;
		height: 100%;
		width: 100%;
		top: -40%;
		right: -10%;
		border: 35px solid rgba(0, 0, 0, .15);
	}

	.crater1,
	.crater2,
	.crater3,
	.crater4 {
		position: absolute;
		border-radius: 50%;
		background: rgba(0, 0, 0, .3);
		box-shadow: inset 3px 3px 0 rgba(0, 0, 0, .2);
	}

	.crater1 {
		width: 20px;
		height: 20px;
		left: 25%;
		top: 20%;
	}

	.crater2 {
		width: 10px;
		height: 10px;
		left: 50%;
		top: 60%;
	}

	.crater3 {
		width: 15px;
		height: 15px;
		left: 30%;
		top: 65%;
	}

	.crater4 {
		width: 15px;
		height: 15px;
		left: 60%;
		top: 35%;
	}

	.star {
		display: block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #FFF;
		top: 10px;
		left: 50px;
		position: relative;
		transform-origin: 100% 0;
		box-shadow: 0 0 5px 5px rgba(255, 255, 255, .3);
		opacity: 0;
		z-index: 2;
	}

	.star0 {
		animation: star-ani 4s infinite ease-out;
	}

	.star1 {
		animation: star-ani 5s infinite ease-out;
	}

	.star2 {
		animation: star-ani 6s infinite ease-out;
	}

	.star3 {
		animation: star-ani 7s infinite ease-out;
	}

	.star:after {
		content: '';
		display: block;
		top: 20px;
		left: 60px;
		border: 0px solid #fff;
		border-width: 0px 90px 2px 90px;
		border-color: transparent transparent transparent rgba(255, 255, 255, .3);
		transform: rotate(-45deg) translate3d(1px, 3px, 0);
		box-shadow: 0 0 1px 0 rgba(255, 255, 255, .1);
		transform-origin: 0% 100%;
		animation: shooting-ani 100s infinite ease-out;
	}

	.pink {
		top: 10px;
		left: 60px;
		background: #ff5a99;
		animation-delay: 5s;
		-webkit-animation-delay: 5s;
		-moz-animation-delay: 5s;
	}

	.pink:after {
		border-color: transparent transparent transparent #ff5a99;
		animation-delay: 5s;
		-webkit-animation-delay: 5s;
		-moz-animation-delay: 5s;
	}

	.blue {
		top: 15px;
		left: 70px;
		background: cyan;
		animation-delay: 7s;
		-webkit-animation-delay: 7s;
		-moz-animation-delay: 7s;
	}

	.blue:after {
		border-color: 'transpareanimation-delay: 12s';
		-webkit-animation-delay: 7s;
		-moz-animation-delay: 7s;
		animation-delay: 7s;
	}

	.yellow {
		top: 0px;
		left: 80px;
		background: #ffcd5c;
		animation-delay: 5.8s;
	}

	.yellow:after {
		border-color: transparent transparent transparent #ffcd5c;
		animation-delay: 5.8s;
	}

	.split_line {
		width: 100%;
		height: 20rpx;
		background-color: #F0F0F0;
	}

	@keyframes star-ani {
		0% {
			opacity: 0;
			transform: scale(0) rotate(0) translate3d(0, 0, 0);
			-webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
			-moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
		}

		50% {
			opacity: 0.5;
			transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
			-webkit-transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
			-moz-transform: scale(1) rotate(0) translate3d(-20px, 20px, 0);
		}

		100% {
			opacity: 0;
			transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
			-webkit-transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
			-moz-transform: scale(1) rotate(0) translate3d(-30px, 30px, 0);
		}
	}
</style>
