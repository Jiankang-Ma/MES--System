//************************************************ 
//  *Author：COCO
//************************************************ 
export default function() {
	return {
		editFormFields: {"WareHouseBillCode":"","Remark":""},
		editFormOptions: [{"title":"单据编号","field":"WareHouseBillCode","type":"text"},
                               {"title":"备注","field":"Remark","type":"textarea"}],
		searchFormFields: {"WareHouseBillCode":"","Remark":"","CreateDate":"","ModifyDate":"","WareHouseDate":""},
		searchFormOptions: [{"title":"单据编号","field":"WareHouseBillCode","type":"like"},{"type":"group"},{"title":"备注","field":"Remark","type":"like"},{"title":"创建时间","field":"CreateDate","type":"date"},{"title":"修改时间","field":"ModifyDate","type":"date"},{"title":"入库时间","field":"WareHouseDate","type":"date"}],
		columns: [{field:'WareHouseBillCode',title:'单据编号',type:'string'},
					   {field:'WareHouseBillType',title:'入库类型',type:'string',bind:{ key:'inStoreType',data:[]}},
                       {field:'WareHouseDate',title:'入库时间',type:'datetime'},
					   {field:'Remark',title:'备注',type:'string'},
                       {field:'CreateDate',title:'创建时间',type:'datetime'},
                       {field:'Creator',title:'创建人',type:'string'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime'}],
		table: {
			key: 'WareHouseBill_Id',
			footer: "Foots",
			cnName: '入库单',
			name: 'Ware_WareHouseBill',
			url: "/Ware_WareHouseBill/",
			sortName: "CreateDate"
		}
	}
}
