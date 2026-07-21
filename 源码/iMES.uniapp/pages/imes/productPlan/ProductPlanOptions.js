//************************************************ 
//  *Author：COCO
//************************************************ 
export default function() {
	return {
		editFormFields: {"ProductPlanCode":"","Remark":""},
		editFormOptions: [{"title":"单据编号","field":"ProductPlanCode","type":"text"},
                               {"title":"备注","field":"Remark","type":"textarea"}],
		searchFormFields: {"ProductPlanCode":"","Remark":"","CreateDate":"","ModifyDate":""},
		searchFormOptions: [{"title":"单据编号","field":"ProductPlanCode","type":"like"},{"type":"group"},{"title":"备注","field":"Remark","type":"like"},{"title":"创建时间","field":"CreateDate","type":"date"},{"title":"修改时间","field":"ModifyDate","type":"date"}],
		columns: [{field:'ProductPlanCode',title:'单据编号',type:'string'},
                       {field:'Remark',title:'备注',type:'string'},
                       {field:'CreateDate',title:'创建时间',type:'datetime'},
                       {field:'Creator',title:'创建人',type:'string'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime'}],
		table: {
			key: 'ProductPlan_Id',
			footer: "Foots",
			cnName: '生产计划',
			name: 'Production_ProductPlan',
			url: "/Production_ProductPlan/",
			sortName: "CreateDate"
		}
	}
}
