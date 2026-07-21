//************************************************ 
//  *Author：COCO
//  *代码由框架生成,任何更改都可能导致被代码生成器覆盖
//  *业务请在View_DefectItemSummary.js中编写
//************************************************ 
export default function() {
	return {
		editFormFields: {},
		editFormOptions: [],
		searchFormFields: {"WorkOrderCode":"","ProductCode":"","ProductName":"","DefectItemName":"","PlanQty":""},
		searchFormOptions: [{"title":"不良品项","field":"DefectItemName"},{"type":"group"},{"title":"工单编号","field":"WorkOrderCode","type":"like"},{"title":"产品编号","field":"ProductCode","type":"like"},{"title":"产品名称","field":"ProductName","type":"like"},{"type":"group"},{"title":"工序计划数","field":"PlanQty","type":"number"}],
		columns: [{field:'WorkOrderCode',title:'工单编号',type:'string'},
                       {field:'ProductCode',title:'产品编号',type:'string'},
                       {field:'ProductName',title:'产品名称',type:'string'},
                       {field:'ProcessName',title:'工序名称',type:'string'},
                       {field:'UserTrueName',title:'生产人员',type:'string'},
                       {field:'DefectItemName',title:'不良品项',type:'string'},
                       {field:'PlanQty',title:'工序计划数',type:'int'},
                       {field:'GoodQty',title:'良品数',type:'int'},
                       {field:'NoGoodQty',title:'不良品数',type:'int'},
                       {field:'NoPassPercent',title:'不良品率',type:'string'}],
		table: {
			key: 'ID',
			footer: "Foots",
			cnName: '不良品项汇总',
			name: 'View_DefectItemSummary',
			url: "/View_DefectItemSummary/",
			sortName: "StartDate"
		}
	}
}
