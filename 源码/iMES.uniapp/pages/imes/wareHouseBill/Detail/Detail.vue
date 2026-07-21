<template>
	<view class="order-detail">
		<!--主表信息 -->
		<view class="order-main">
			<view class="title">入库单信息</view>
			<imes-form class="main-form" :load-key="true" ref="form" :form-options="editFormOptions"
				:formFields.sync="editFormFields">
			</imes-form>
		</view>
		<!-- 明细列表信息 -->
		<u-button class="loginBtn" icon="checkmark" type="primary" @click="save">保存</u-button>
		<view class="order-detail-list">
			<imes-table @rowClick="rowClick" :tableData="rows"
				:columns.sync="columns" ref="table">
			</imes-table>
		</view>

		<u-popup @touchmove.prevent class="form-popup" :zIndex="999999" :show="detailModel" @close="detailModel=false;">
			<view class="vol-action-sheet-select-container" style="max-height:500px">
				<view class="vol-action-sheet-select-title" @click="detailModel=false;">明细操作
					<text class="vol-action-sheet-select-confirm">取消</text>
				</view>
				<imes-form :load-key="true" ref="detail" :form-options="detailFormOptions"
					:formFields.sync="detailFormFields">
				</imes-form>
				<view style="padding: 15px;">
					<!-- <view v-show="!isAdd" style="margin-bottom: 28rpx;">
						<u-button @click="showDel=true" icon="trash" type="error" shape="circle" text="删除"></u-button>
					</view> -->
					<u-button @click="addRow" icon="checkmark" type="primary" shape="circle" text="确认"></u-button>
				</view>
			</view>
		</u-popup>
		<!-- 删除提示 -->
		<u-modal :show="showDel" cancelText="取消" class="del-u-modal" :showCancelButton="true" :showConfirmButton="true"
			@cancel="showDel=false" @confirm="confirmDel" title="警告">
			<view style="color: red;">确定要删除此数据吗!</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDel: false, //删除提示框
				currentRow: {},
				currendtIndex: -1, //当前编辑或删除的是第几行
				isAdd: false, //当前是操作是新建还是编辑
				WareHouseBill_Id: null, //编辑时传过来的订单id
				//主表配置
				//主表配置
				editFormFields: {
					"WareHouseBillCode": "",
					"Remark": ""
				},
				editFormOptions: [{
						"title": "入库单号",
						"required": true,
						"field": "WareHouseBillCode"
					},
					{
						"title": "备注",
						"required": true,
						"field": "Remark",
						"type": "textarea"
					}
				],
				//明细表配置，具体见表单vol-form菜单
				rows: [], //数据
				columns: [{
						field: 'WareHouseBillList_Id',
						title: '明细表主键',
						hidden: true
					},
					{
						field: 'ProductName',
						title: '产品名称',
						type: "select",
						bind: {
							key: "productList",
							data: []
						},
					},
					{
						field: 'InStoreQty',
						title: '入库数量',
						type: 'int',
						require: true
					},
					{
						field: 'SafeInventory',
						title: '安全库存',
						type: 'int',
						require: true
					},
					{
						field: 'InventoryQty',
						title: '当前库存数量',
						type: 'int',
						require: true
					},
					{
						field: 'Creator',
						title: '创建人',
						type: 'string',
						readonly: true
					}
				],
				detailModel: false,
				detailFormFields: {
					ProductName: "",
					Qty: 0
				},
				detailFormOptions: [{
						field: 'ProductName',
						title: '产品名称',
						type: "select",
						"data": [],
						key: "productList",
						readonly:true
					},
					{
						field: 'InStoreQty',
						title: '入库数量',
						type: 'int',
						require: true
					}
				],
			}
		},
		//注意函数和data同级,不要写在methods内
		onNavigationBarButtonTap(e) {
			uni.switchTab({
				url: '../../workorder/workorder'
			});
		},
		methods: {
			save() { //保存
				let url = ''
				if (this.WareHouseBill_Id) { //编辑操作
					url = "api/Ware_WareHouseBill/update"
				} else {
					url = "api/Ware_WareHouseBill/add"
				}
				let params = {
					mainData: this.editFormFields,
					detailData: this.rows
				}
				this.http.post(url, params, true).then(result => {
					this.$toast(result.message);
					if (!result.status) {
						return;
					}
					this.getOrderData();
					this.getOrderListData();
					//保存成功后刷新页面数据
				})
			},
			confirmDel() { //删除行数据
				let url = "api/Ware_WareHouseBill/delDetail?WareHouseBillList_Id=" + this.currentRow.WareHouseBillList_Id;
				//从后台删除数据，这里自己写下delDetail接口
				// this.http.get(url,{},true).then(result=>{
				//  if(result.status){
				this.showDel = false;
				this.detailModel = false;
				this.rows.splice(this.currnetDelIndex, 1);
				this.$toast("删除成功");
				return;
				//  }
				// })
			},
			showDetailBtnClick() { //添加行
				this.isAdd = true;
				this.showDetail(-1, {
					ProductName: '',
					Qty: null
				});
			},
			rowClick(index, row) { //点击新建或者编辑弹出明细表的操作
				this.isAdd = false;
				this.showDetail(index, row);
			},
			showDetail(index, row) {
				this.currendtIndex = index;
				this.detailFormFields = JSON.parse(JSON.stringify(row));
				this.detailModel = true;
			},
			addRow() { //弹出框点击的确定
				if (!this.$refs.detail.validate()) {
					return false
				}
				//编辑操作
				if (this.currendtIndex != -1) {
					Object.assign(this.rows[this.currendtIndex], this.detailFormFields);
				} else { //添加行的数据
					this.rows.push(this.detailFormFields);
				}
				this.detailModel = false
				this.save();
			},
			getOrderData() { //获取主表数据(现在用的是框架的方法，可以自己写接口返回数据)
				let params = {
					page: 1,
					row: 1
				};
				//生成查询参数
				params.wheres = JSON.stringify([{
					name: "WareHouseBill_Id",
					value: this.WareHouseBill_Id
				}]);
				this.http.post("api/Ware_WareHouseBill/getPageData", params, true).then(result => {
					Object.assign(this.editFormFields, result.rows[0])
				})
			},
			getOrderListData() { //获取明细表数据(现在用的是框架的方法，可以自己写接口返回数据)
				//此页面没做分页，可以用uview的list来处理分页
				let params = {
					page: 1,
					rows: 30
				};
				//生成查询参数
				params.value = this.WareHouseBill_Id;
				this.http.post("api/Ware_WareHouseBill/getDetailPage", params, true).then(result => {
					this.rows = result.rows;
				})
			}
		},
		onShow() {
			//获取主表主键值
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let params = routes[routes.length - 1].options; //获取路由参数 
			if (params && params.WareHouseBill_Id) {
				this.WareHouseBill_Id = params.WareHouseBill_Id;
				//获取主表数据
				this.getOrderData();
				//获取明细表数据
				this.getOrderListData();
			} else {
				this.WareHouseBill_Id = null;
			}
			uni.setNavigationBarTitle({
				title: this.WareHouseBill_Id ? '入库单编辑' : '新建入库单'
			})
		}
	}
</script>

<style scoped lang="less">
	.order-detail {
		margin-top: -20rpx;
		background-color: #F6F6F6;
		padding-top: 20rpx;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.order-main,
	.order-detail-list {
		// margin: 20rpx;
		border-radius: 10rpx;
	}

	.main-form,
	.detail-form {
		border: 1px solid #ebebeb;
		border-bottom: 0;
		border-radius: 4px;
		display: inline-block;
		width: 100%;
	}

	.title {
		text-align: left;
		margin: 9px 0 7px 0;
		font-size: 15px;
		border-left: 8px solid #00aaff;
		line-height: 16px;
		padding-left: 5px;
		display: flex;
		position: relative;

		.detail-icon {
			position: absolute;
			width: 60rpx;
			right: 0;
			height: 44rpx;
		}
	}

	.detail-form {
		margin-bottom: 30rpx;
	}

	.detail-btns {
		margin: 15rpx 8rpx;
		display: flex;

		.detail-btn {
			margin-left: 20rpx;
		}
	}
</style>
