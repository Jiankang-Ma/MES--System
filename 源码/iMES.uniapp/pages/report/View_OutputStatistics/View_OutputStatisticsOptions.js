//************************************************ 
//  *Author：COCO
//  *代码由框架生成,任何更改都可能导致被代码生成器覆盖
//  *业务请在View_OutputStatistics.js中编写
//************************************************ 
export default function() {
	return {
		editFormFields: {},
		editFormOptions: [],
		searchFormFields: {"CreateDate":"","PlanQty":"","ProductName":"","ProductCode":"","ProductStandard":"","GoodQty":""},
		searchFormOptions: [{"title":"数量","field":"GoodQty","type":"number"},{"type":"group"},{"title":"报工日期","field":"CreateDate","type":"date"},{"title":"工单计划数","field":"PlanQty","type":"number"},{"title":"产品名称","field":"ProductName","type":"like"},{"type":"group"},{"title":"产品编号","field":"ProductCode","type":"like"},{"title":"产品规格","field":"ProductStandard","type":"like"}],
		columns: [{field:'CreateDate',title:'报工日期',type:'datetime'},
                       {field:'PlanQty',title:'工单计划数',type:'int'},
                       {field:'ProductName',title:'产品名称',type:'string'},
                       {field:'ProductCode',title:'产品编号',type:'string'},
                       {field:'ProductStandard',title:'产品规格',type:'string'},
                       {field:'Unit_Id',title:'单位',type:'int',bind:{ key:'unitList',data:[]}},
                       {field:'GoodQty',title:'数量',type:'int'}],
		table: {
			key: 'ID',
			footer: "Foots",
			cnName: '产量统计',
			name: 'View_OutputStatistics',
			url: "/View_OutputStatistics/",
			sortName: "CreateDate"
		}
	}
}
