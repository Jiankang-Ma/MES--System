<template>
	<view class="content">
		<!-- 此处为了让reload时不自动滚动到顶部，需要设置auto-clean-list-when-reload和auto-scroll-to-top-when-reload为false，即在reload时关闭自动清空数组和自动滚动到顶部 -->
		<!--工单基本信息-->
		<reportCard :item="reportInfo" :isSelect="true"></reportCard>
		<!--tab页签-->
		<view class="uTabsView">
			<u-subsection :list="tabList" fontSize="16" :current="tabIndex" @change="tabChange"></u-subsection>
		</view>
		<!-- 自定义下拉刷新view -->
		<!-- <custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher> -->
		<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
		<view class="contentView">
			<!--生产进度详细信息-->
			<view v-if="tabIndex == 0">
				<view v-for="(item, index) in listProcess" :key="index">
					<view class="card">
						<view class="topRow1">
							<view style="margin-left: 15rpx;" class="name">
								<text>{{item.ProcessName || '暂无'}}</text>
							</view>
							<view>
								<text style="margin-left: 15rpx;" class="colorGray">计划数：</text>
								<text class="colorGray">{{item.PlanQty}}</text>
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
						<view class="bottomRow">
							<view class="lxRow">
							</view>
							<view class="lxRow">
								<u-button size="mini" style="margin-right: 30rpx;" type="default" :plain="true"
									ripple-bg-color="#909399" @click="openDetail(item.WorkOrderCode,item.Process_Id)">详
									情</u-button>
								<u-button v-if="isclose" size="mini" type="primary" ripple-bg-color="#909399"
									:plain="true" @click="report(item)">报 工
								</u-button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="show" mode="bottom" :closeOnClickOverlay="true" @close="close" :closeable="true">

			<u-picker :show="showDefectItem" :columns="listDefectItem" keyName="label" @confirm="confirm"
				@cancel="cancel"></u-picker>
			<u-picker :show="showUnit" :columns="unitList" keyName="label" @confirm="confirmUnit" @cancel="cancel">
			</u-picker>
			<view class="content_scroll">
				<scroll-view scroll-y="true" style="height: 1000rpx;">
					<view class="flex-white-plr26 ptb10 bdb_f5" style="margin-top:50rpx;">
						<text class="mr26">工序名</text>
						<view>
							<u-input v-model="processName" :disabled="true" placeholder="请输入" />
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5" @click="selectProductUserFun()">
						<text class="mr26">生产人员
							<text class="redXingh">*</text>
						</text>
						<view :class="ProductUser ? '' : 'cBlack'" style="display:inline;">
						
							<u-row customStyle="margin: 5px">
								<u-col span="10">
									<view>{{ProductUser ? ProductUser : '请选择'}}</view>
								</u-col>
								<u-col span="2">
										<u-icon class="ml26" name="arrow-right" size="20" color="#888888"></u-icon>
								</u-col>
							</u-row>
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5">
						<text class="mr26">报工数
							<text class="redXingh">*</text>
						</text>
						<view>
							<u-input type="number" v-model="reportQty" placeholder="请输入报工数" />
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5">
						<text class="mr26">良品数
							<text class="redXingh">*</text>
						</text>
						<view>
							<u-input type="number" v-model="reportGoodQty" placeholder="请输入良品数" />
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5">
						<text class="mr26">不良品数
						</text>
						<view>
							<u-input type="number" v-model="reportNoGoodQty" placeholder="请输入不良品数" />
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5" @click="showDefectItem = true">

						<text class="mr26">不良品项
						</text>
						<view :class="defectItem ? '' : 'cBlack'" style="display:inline;">

							<u-row customStyle="margin: 5px">
								<u-col span="10">
									<view>{{defectItem ? defectItem : '请选择'}}</view>
								</u-col>
								<u-col span="2">
									<u-icon class="ml26" name="arrow-right" size="20" color="#888888"></u-icon>
								</u-col>
							</u-row>
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5" @click="showUnit = true">

						<text class="mr26">单位
						</text>
						<view :class="unitName ? '' : 'cBlack'" style="display:inline;">

							<u-row customStyle="margin: 5px">
								<u-col span="10">
									<view>{{unitName ? unitName : '请选择'}}</view>
								</u-col>
								<u-col span="2">
									<u-icon class="ml26" name="arrow-right" size="20" color="#888888"></u-icon>
								</u-col>
							</u-row>
						</view>
					</view>
					<view class="flex-white-plr26 ptb10 bdb_f5">
						<view>
							<u-row gutter="12">
								<u-col span="3">
									<text>报工时长</text>
								</u-col>
								<u-col span="3">
									<u-input type="number" v-model="ReoportDurationHour" placeholder="请输入不良品数" />
								</u-col>
								<u-col span="2">
									<u-button type="primary" size="mini">小时</u-button>
								</u-col>
								<u-col span="2">
									<u-input type="number" v-model="ReoportDurationMinute" placeholder="请输入不良品数" />
								</u-col>
								<u-col span="2">
									<u-button type="primary" size="mini">分钟</u-button>
								</u-col>
							</u-row>
						</view>
					</view>
					<view class="flex-white-plr26 ptb20 bdb_f5" @click="DateShow = true, gjDateType = 'StartDate'">
						<text class="mr26">开始时间</text>
						<view class="w420">{{$u.timeFormat(StartDate, 'yyyy-mm-dd hh:MM:ss')}}</view>
						<u-icon class="ml26" name="calendar" size="30" color="#888888"></u-icon>
					</view>
					<view class="flex-white-plr26 ptb20 bdb_f5" @click="DateShow = true, gjDateType = 'EndDate'">
						<text class="mr26">结束时间</text>
						<view class="w420">{{$u.timeFormat(EndDate, 'yyyy-mm-dd hh:MM:ss')}}</view>
						<u-icon class="ml26" name="calendar" size="30" color="#888888"></u-icon>
					</view>
				</scroll-view>
				<view class="confrim-btn">
					<u-row gutter="16">
						<u-col span="5">
							<u-button ripple-bg-color="#11AAED" :plain="true" @click="show = false">取消</u-button>
						</u-col>
						<u-col span="2">
						</u-col>
						<u-col span="5">
							<u-button ripple-bg-color="#11AAED" :plain="true" @click="submitReport()">确定</u-button>
						</u-col>
					</u-row>
				</view>
			</view>
		</u-popup>
		<u-datetime-picker :params="pickerTimeParams" :safe-area-inset-bottom="true" end-year="2100" :show="DateShow"
			@confirm="pickerTimeConfirmFun"   v-model="defaulTime" :default-time="defaulTime" mode="datetime"></u-datetime-picker>
	</view>
</template>

<script>
	let that = '';
	import reportCard from '@/components/card/report.vue'
	import {
		formateDate
	} from '../../../util/date.js'
	import {
		getNowDate
	} from '../../../static/utils/date.js'
	import workProcess from '@/components/card/workprocess.vue'
	export default {
		components: {
			reportCard,
			workProcess
		},
		data() {
			return {
				show: false,
				showDefectItem: false,
				showUnit: false,
				DateShow: false,
				ReoportDurationMinute: 0,
				ReoportDurationHour: 0,
				defaulTime: Number(new Date()),
				StartDate: "",
				EndDate: "",
				pickerTimeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					timestamp: true
				},
				listDefectItem: [],
				unitList: [],
				defectItem: "",
				defectItemId: "",
				isclose: true,
				listProcess: [],
				ProductUser: "",
				ProductUserId: "",
				planQty: 0, //工单计划数
				goodQty: 0, //工单良品数
				noGoodQty: 0, //工单不良品数
				reportQty: 0, //报工数
				reportGoodQty: 0, //良品数
				reportNoGoodQty: 0, //不良品数
				unitName: "", //单位名称
				unitId: "", //单位Id
				processId: "",
				processName: "",
				stateIndex: 0,
				reportInfo: {},
				dataList: [],
				gjDateType: "",
				tabList: ['生产进度'],
				tabIndex: 0,
				refresherStatus: 0,
				cardIndex: -1,
				isLoadSelectKhById: false
			}
		},
		onLoad(e) {
			that = this;
			let dateObj = getNowDate(true);
			that.defaulTime = dateObj.nowDate;
			that.StartDate = dateObj.st;
			that.cardIndex = e.index || -1;
			that.reportInfo = uni.$reportInfo || {};
			if (that.reportInfo.Status == 3) {
				this.isclose = false;
			}
			uni.setNavigationBarTitle({
				title: that.reportInfo.clientName || '报工 详情'
			})
			this.selectProcessByWo();
			this.selectDefectItem();
			this.selectUnitList();
			uni.$on('getUserBindFun', that.getUserBindFun)
		},
		onBackPress(e) {
			if (e.from == 'backbutton' && this.cardIndex != -1) {
				uni.$emit('updateListByIndex', {
					index: this.cardIndex,
					obj: this.reportInfo
				})
			}
			uni.$off('getUserBindFun', that.getUserBindFun)
		},
		onShow() {

		},
		//注意函数和data同级,不要写在methods内
		onNavigationBarButtonTap(e) {
			uni.switchTab({
				url: '../workorder/workorder'
			});
		},
		methods: {
			close() {
				this.show = false
				// console.log('close');
			},
			cancel() {
				this.showDefectItem = false;
				this.showUnit = false;
			},
			// 不良品项回调
			confirm(e) {
				this.defectItem = e.value[0].label;
				this.defectItemId = e.value[0].value;
				this.showDefectItem = false;
			},
			//单位选择回调
			confirmUnit(e) {
				this.unitName = e.value[0].label;
				this.unitId = e.value[0].value;
				this.showUnit = false;
			},
			submitReport() {
				let detailData = [];
				if (this.defectItemId != "") {
					detailData.push({
						DefectItem: this.defectItemId,
						Qty: this.reportNoGoodQty,
						elementIndex: 0
					})
				}
				let mainData = {
					ActualProgress: "",
					ApproveStatus: "2",
					ApproveUser: "超级管理员",
					EndDate: that.$u.timeFormat(that.EndDate, 'yyyy-mm-dd hh:MM:ss'),
					GoodQty: that.reportGoodQty,
					GuessPrice: "",
					NoGoodQty: that.reportNoGoodQty,
					PriceType: "",
					ProcessProgress: "",
					ProcessStatus: "2",
					Process_Id: that.processId,
					ProductCode: that.reportInfo.ProductCode,
					ProductName: that.reportInfo.ProductName,
					ProductStandard: that.reportInfo.ProductStandard,
					ProductUser: that.ProductUserId,
					Product_Id: that.reportInfo.Product_Id,
					RateStandard: "",
					ReoportDurationHour: that.ReoportDurationHour,
					ReoportDurationMinute: that.ReoportDurationMinute,
					ReportQty: that.reportQty,
					ReportTime: that.defaulTime,
					StandardProgress: "",
					StartDate: that.$u.timeFormat(that.StartDate, 'yyyy-mm-dd hh:MM:ss'),
					UnitPrice: "",
					Unit_Id: that.unitId,
					WorkOrder_Id: that.reportInfo.WorkOrder_Id
				}
				let params = {
					delKeys: null,
					detailData: detailData,
					mainData: mainData
				};
				this.http.post("api/Production_ReportWorkOrder/Add", params, true).then(result => {
					if (result.status) {
						that.show = false;
						that.$u.toast(result.message);
						that.selectProcessByWo();
					}
				})
			},
			openDetail: function(workOrderCode, process_Id) {
				uni.navigateTo({
					url: './productDetail?WorkOrderCode=' + workOrderCode + '&Process_Id=' + process_Id
				})
			},
			// 选择生产人员
			selectProductUserFun: function() {
				uni.navigateTo({
					url: '../user/user?type=report'
				})
			},
			//报工方法
			report: function(entity) {
				this.planQty = entity.PlanQty;
				this.goodQty = entity.GoodQty == undefined ? "0" : entity.GoodQty;
				this.noGoodQty = entity.noGoodQty == undefined ? "0" : entity.noGoodQty;
				this.processName = entity.ProcessName;
				this.processId = entity.Process_Id;
				this.show = true;
			},
			// 绑定联系人
			getUserBindFun: function(e) {
				that.ProductUserId = e.userId;
				that.ProductUser = e.userTrueName;
			},
			//根据工单获取工序列表
			selectProcessByWo: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 1000,
					sort: "CreateDate",
					value: this.reportInfo.WorkOrder_Id
				};
				params.wheres = JSON.stringify([]);
				this.http.post("api/Production_WorkOrder/getDetailPage", params, true).then(result => {
					this.listProcess = result.rows;
				})
			},
			//获取不良品项
			selectDefectItem: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 1000,
					sort: "CreateDate"
				};
				params.wheres = JSON.stringify([]);
				this.http.post("api/Base_DefectItem/getPageData", params, true).then(result => {
					let listDefectItem = result.rows.map(item => ({
						label: item.DefectItemName,
						value: item.DefectItem_Id
					}));
					this.listDefectItem.push(listDefectItem);
				})
			},
			//获取单位列表
			selectUnitList: function() {
				let params = {
					order: "desc",
					page: 1,
					rows: 1000,
					sort: "CreateDate"
				};
				params.wheres = JSON.stringify([]);
				this.http.post("api/Sys_Unit/getPageData", params, true).then(result => {
					let unitList = result.rows.map(item => ({
						label: item.UnitName,
						value: item.Unit_Id
					}));
					this.unitList.push(unitList);
				})
			},
			//Tab页签切换方法
			tabChange(index) {
				this.tabIndex = index;
				let item = that.tabList[index];
				if (item.arr && item.arr.length > 0) {
					return
				}
			},
			// 时间选择器点击确定按钮，返回当前选择的值
			pickerTimeConfirmFun: function(e) {
				if (that.gjDateType == 'StartDate') {
					that.StartDate = e.value;
				} else if (that.gjDateType == 'EndDate') {
					that.EndDate = e.value;
				}
				this.DateShow = false;
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */

	/*如果有scoped，page的css设置建议放在App.vue中 */
	page {
		height: 100%;
		background-color: #F8F8F8;
	}

	.content_scroll {
		padding: 24rpx;
		text-align: center;
	}

	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}

	.uTabsView {
		border-bottom: 1rpx solid #DDDDDD;
		z-index: 100;
		position: sticky;
		top: 0;
	}

	.contentView {
		/* background-color: #FFFFFF; */
		min-height: calc(100vh - 45px);
	}

	.flexRow {
		display: flex;
		font-size: 30rpx;
		margin-bottom: 8rpx;
	}

	.flexRow>view {
		width: 50%;
		display: flex;
	}

	.flexRow>view>text:first-child {
		width: 166rpx;
	}

	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}

	.uTabsView {
		top: -2px !important;
	}

	.width100 {
		width: 100%;
		margin: 26rpx 0;
	}

	.u-steps__item,
	.u-steps__item--row {
		width: 200px !important;
	}

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
</style>
