//************************************************ 
//  *Author：COCO
//************************************************ 
export default function() {
	return {
		editFormFields: {"OutWareHouseBillCode":"","Remark":""},
		editFormOptions: [{"title":"单据编号","field":"OutWareHouseBillCode","type":"text"},
                               {"title":"备注","field":"Remark","type":"textarea"}],
		searchFormFields: {"OutWareHouseBillCode":"","Remark":"","CreateDate":"","ModifyDate":"","OutWareHouseDate":""},
		searchFormOptions: [{"title":"单据编号","field":"OutWareHouseBillCode","type":"like"},{"type":"group"},{"title":"备注","field":"Remark","type":"like"},{"title":"创建时间","field":"CreateDate","type":"date"},{"title":"修改时间","field":"ModifyDate","type":"date"},{"title":"出库时间","field":"OutWareHouseDate","type":"date"}],
		columns: [{field:'OutWareHouseBillCode',title:'单据编号',type:'string'},
					   {field:'OutWareHouseBillType',title:'出库类型',type:'string',bind:{ key:'outStoreType',data:[]}},
                       {field:'OutWareHouseDate',title:'出库时间',type:'datetime'},
					   {field:'Remark',title:'备注',type:'string'},
                       {field:'CreateDate',title:'创建时间',type:'datetime'},
                       {field:'Creator',title:'创建人',type:'string'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime'}],
		table: {
			key: 'OutWareHouseBill_Id',
			footer: "Foots",
			cnName: '出库单',
			name: 'Ware_OutWareHouseBill',
			url: "/Ware_OutWareHouseBill/",
			sortName: "CreateDate"
		}
	}
}
