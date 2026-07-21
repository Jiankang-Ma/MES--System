<template>
	<view>
		<scroll-view scroll-y="true" :style="{height: scrollHeight}" @scrolltolower="selectDataFun"
			refresher-enabled :refresher-threshold="200" :refresher-triggered="triggered" refresher-background="gray" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view v-if="list.length > 0">
				<view v-for="(item, index) in list" :key="index" @click="cardClickFun(item)">
					<lxrCard :item="item" :isSelect="isSelect" :index="index"></lxrCard>
				</view>
				<getMore :isMore="isMore" nullMsg="已加载全部~"></getMore>
				<view class="h200"></view>
			</view>
			<dataNull v-else src="../../../static/img/dataNull.png" title="暂无相关用户哦~"></dataNull>
		</scroll-view>
	</view>
</template>

<script>
	let that = this;
	import { tyDropDown, dropDownByUser, datePxData, lxrDropDownData } from '../../../static/utils/dropdown.js'
	import {
		getDayFun, getDayByNumFun
	} from '@/static/utils/date.js'
	import dataNull from '../../../components/dataNull/dataNull.vue'
	import getMore from '../../../components/getMore/getMore.vue'
	import lxrCard from '../../../components/card/lianXiRen.vue'
	export default {
		components: {
			dataNull,
			getMore,
			lxrCard
		},
		data() {
			return {
				dropdown1: '全部',
				options1: [],
				optionsPx: datePxData,
				sxList: [],
				list: [],
				pageIndex: 1,
				isMore: true,
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
			let lxrSxList = JSON.stringify(lxrDropDownData);
			that.sxList = JSON.parse(lxrSxList);
			let obj = {};
			that.options1 = tyDropDown;
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
			if(e.next_gjDate) {
				let dateArr = getDayByNumFun(e.next_gjDate);
				let dateObj = {
					field: 'next_gjDate',
					sTime: dateArr[1],
					eTime: dateArr[0]
				};
				let arr = that.sxList;
				arr[0].current = 0;
				that.sxList = arr;
				that.dateReq.push(dateObj)
			} else {
				let arr = that.sxList;
				arr[0].current = '';
				that.sxList = arr;
			}
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
				if (!that.isMore) {
					return
				}
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
				this.http.post("api/Sys_User/getPageData", params, true).then(result => {
					that.list = result.rows;
				})
			},
			// 卡片点击方法
			cardClickFun: function(item) {
				if(that.pageType == 'report') {
					uni.$emit('getUserBindFun', { userTrueName: item.UserTrueName, userId: item.User_Id })
					uni.navigateBack()
				} 
			},
			// 下拉框回调函数
			dropDownFun1: function(e) {
				let optionsReq = {};
				let tabNoEqualArr = [];
				let userInfo = uni.$userInfo;
				that.depId = undefined;
				if(e.label == '全部') {
					that.depId = userInfo.depManager_Id;
				} else if(e.label == '我负责的') {
					optionsReq.fuZeRenId = userInfo._id;
				} else if(e.label == '我创建的') {
					optionsReq.cjRenId = userInfo._id;
				} else if(e.label == '下属负责') {
					that.depId = userInfo.depManager_Id;
					tabNoEqualArr = [{
						field: 'fuZeRenId',
						value: userInfo._id
					}]
					optionsReq.department = userInfo.departmentId;
				} else if(e.label == '下属创建') {
					that.depId = userInfo.depManager_Id;
					tabNoEqualArr = [{
						field: 'cjRenId',
						value: userInfo._id
					}]
				}
				that.tabNoEqualArr = tabNoEqualArr;
				that.optionsReq = JSON.stringify(optionsReq);
				that.matchObj = Object.assign(optionsReq, JSON.parse(that.sxReq));
				that.cxSelectDataFun();
			},
			// 筛选框回调函数
			optionSxFun: function(e) {
				let arr = e.arr;
				that.clientIdArr = e.selectKhList;
				let matchReq = [];
				let dateReq = [];
				for (var i = 0; i < arr.length; i++) {
					if(arr[i].current !== '' && !arr[i].isDate) {
						matchReq.push({
							field: arr[i].field,
							value: arr[i].arr[arr[i].current]
						})
					} else if(arr[i].current !== '' && arr[i].isDate) {
						dateReq.push({
							field: arr[i].field,
							sTime: arr[i].sTime,
							eTime: arr[i].eTime
						})
					}
				}
				let reqObj = {};
				// 动态生成请求对象
				for(var i = 0; i < matchReq.length; i++) {
					reqObj[matchReq[i].field] = matchReq[i].value
				}
				that.dateReq = dateReq;
				that.sxReq = JSON.stringify(reqObj);
				// 合并对象
				that.matchObj = Object.assign(reqObj, JSON.parse(that.optionsReq));
				that.cxSelectDataFun();
			},
			// 排序筛选框回调函数
			optionPxFun: function(arr) {
				let sortObj = {
					update_date: -1
				}
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].current !== '') {
						sortObj = {}
						if (arr[i].field == 'create_date') {
							sortObj.create_date = arr[i].current == 1 ? 1 : -1
						}
						if (arr[i].field == 'update_date') {
							sortObj.update_date = arr[i].current == 1 ? 1 : -1
						}
						if (arr[i].field == 'genjin_date') {
							sortObj.genjin_date = arr[i].current == 1 ? 1 : -1
						}
						that.sortObj = sortObj;
						break;
					}
				}
				that.cxSelectDataFun();
			},
			// 搜索框回调方法
			searchBoxEmitFun: function(e) {
				that.searchValue = e.searchValue1;
				that.cxSelectDataFun()
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
				that.isMore = true;
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
