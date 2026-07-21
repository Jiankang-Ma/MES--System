//************************************************ 
//  *Author：COCO
//  *代码由框架生成,任何更改都可能导致被代码生成器覆盖
//  *业务请在View_DefectItemDistribute.js中编写
//************************************************ 
export default function() {
	return {
		editFormFields: {"Qty":""},
		editFormOptions: [{"title":"数量","field":"Qty","type":"number"}],
		searchFormFields: {"CreateDate":"","DefectItemCode":"","DefectItemName":"","Qty":""},
		searchFormOptions: [{"title":"数量","field":"Qty","type":"number"},{"type":"group"},{"title":"时间","field":"CreateDate","type":"date"},{"title":"不良品项编号","field":"DefectItemCode","type":"like"},{"title":"不良品项名称","field":"DefectItemName","type":"like"}],
		columns: [{field:'CreateDate',title:'时间',type:'datetime'},
                       {field:'DefectItemCode',title:'不良品项编号',type:'string'},
                       {field:'DefectItemName',title:'不良品项名称',type:'string'},
                       {field:'AllQty',title:'总数量',type:'int'},
                       {field:'PassPercent',title:'占比',type:'string'}],
		table: {
			key: 'ID',
			footer: "Foots",
			cnName: '不良品项分布',
			name: 'View_DefectItemDistribute',
			url: "/View_DefectItemDistribute/",
			sortName: "CreateDate"
		}
	}
}
