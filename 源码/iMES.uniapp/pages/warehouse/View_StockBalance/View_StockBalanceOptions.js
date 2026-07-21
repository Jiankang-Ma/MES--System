//************************************************ 
//  *Author：COCO
//  *代码由框架生成,任何更改都可能导致被代码生成器覆盖
//  *业务请在View_StockBalance.js中编写
//************************************************ 
export default function() {
	return {
		editFormFields: {},
		editFormOptions: [],
		searchFormFields: {"ProductCode":"","ProductName":"","InventoryQty":[null,null]},
		searchFormOptions: [{"title":"产品编码","field":"ProductCode","type":"like"},{"title":"产品名称","field":"ProductName","type":"like"},{"type":"group"},{"title":"库存数量","field":"InventoryQty","type":"number"}],
		columns: [{field:'ProductCode',title:'产品编码',type:'string'},
                       {field:'ProductName',title:'产品名称',type:'string'},
                       {field:'ProductStandard',title:'产品规格',type:'string'},
                       {field:'InventoryQty',title:'库存数量',type:'int'},
                       {field:'Unit_Id',title:'单位',type:'int',bind:{ key:'unitList',data:[]}},
                       {field:'MaxInventory',title:'最大库存',type:'int'},
                       {field:'MinInventory',title:'最小库存',type:'int'},
                       {field:'SafeInventory',title:'安全库存',type:'int'}],
		table: {
			key: 'Product_Id',
			footer: "Foots",
			cnName: '库存余额',
			name: 'View_StockBalance',
			url: "/View_StockBalance/",
			sortName: "CreateDate"
		}
	}
}
