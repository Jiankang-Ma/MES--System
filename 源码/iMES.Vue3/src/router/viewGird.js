
let viewgird = [
  {
    path: '/Sys_Log',
    name: 'sys_Log',
    component:  () => import('@/views/system/Sys_Log.vue' )
  },
  {
    path: '/Sys_User',
    name: 'Sys_User',
    component:  () => import('@/views/system/Sys_User.vue' )
  },
  {
    path: '/permission',
    name: 'permission',
    component:  () => import('@/views/system/Permission.vue' )
  },
  {
    path: '/Sys_Dictionary',
    name: 'Sys_Dictionary',
    component:  () => import('@/views/system/Sys_Dictionary.vue' )
  },
  {
    path: '/Sys_Role',
    name: 'Sys_Role',
    component:  () => import('@/views/system/Sys_Role.vue' )
  }, {
    path: '/Sys_Role1',
    name: 'Sys_Role1',
    component:  () => import('@/views/system/Sys_Role1.vue' )
  }
  , {
    path: '/Sys_DictionaryList',
    name: 'Sys_DictionaryList',
    component:  () => import('@/views/system/Sys_DictionaryList.vue' )
  } ,{
        path: '/FormDesignOptions',
        name: 'FormDesignOptions',
        component: () => import('@/views/system/form/FormDesignOptions.vue')
    }    ,{
        path: '/FormCollectionObject',
        name: 'FormCollectionObject',
        component: () => import('@/views/system/form/FormCollectionObject.vue')
    }    ,{
        path: '/Custom/Sys_User_ExtendData',
        name: 'Sys_User_ExtendData',
        component: () => import('@/views/custom/custom/Sys_User_ExtendData.vue')
    }    ,{
        path: '/Sys_Table_Extend',
        name: 'Sys_Table_Extend',
        component: () => import('@/views/custom/custom/Sys_Table_Extend.vue')
    }   ,{
        path: '/Sys_User_Extend',
        name: 'Sys_User_Extend',
        component: () => import('@/views/custom/custom/Sys_User_Extend.vue')
    }   
    ,{
        path: '/Base_DefectItem_Extend',
        name: 'Base_DefectItem_Extend',
        component: () => import('@/views/custom/custom/Base_DefectItem_Extend.vue')
    }  
    ,{
        path: '/Base_MeritPay_Extend',
        name: 'Base_MeritPay_Extend',
        component: () => import('@/views/custom/custom/Base_MeritPay_Extend.vue')
    }  
    ,{
        path: '/Base_Process_Extend',
        name: 'Base_Process_Extend',
        component: () => import('@/views/custom/custom/Base_Process_Extend.vue')
    }  
    ,{
        path: '/Base_Product_Extend',
        name: 'Base_Product_Extend',
        component: () => import('@/views/custom/custom/Base_Product_Extend.vue')
    }  ,{
        path: '/Sys_User_ExtendData',
        name: 'Sys_User_ExtendData',
        component: () => import('@/views/custom/custom/Sys_User_ExtendData.vue')
    }    ,{
        path: '/Sys_Dept',
        name: 'Sys_Dept',
        component: () => import('@/views/system/Sys_Dept.vue')
    }    ,{
        path: '/Sys_Unit',
        name: 'Sys_Unit',
        component: () => import('@/views/custom/custom/Sys_Unit.vue')
    }    ,{
        path: '/Base_DefectItem',
        name: 'Base_DefectItem',
        component: () => import('@/views/custom/custom/Base_DefectItem.vue')
    }    ,{
        path: '/Base_Process',
        name: 'Base_Process',
        component: () => import('@/views/custom/custom/Base_Process.vue')
    }    ,{
        path: '/Base_ProcessList',
        name: 'Base_ProcessList',
        component: () => import('@/views/custom/custom/Base_ProcessList.vue')
    }    ,{
        path: '/Base_NumberRule',
        name: 'Base_NumberRule',
        component: () => import('@/views/custom/custom/Base_NumberRule.vue')
    }    ,{
        path: '/Base_ProcessLine',
        name: 'Base_ProcessLine',
        component: () => import('@/views/custom/custom/Base_ProcessLine.vue')
    }    ,{
        path: '/Base_ProcessLineList',
        name: 'Base_ProcessLineList',
        component: () => import('@/views/custom/custom/Base_ProcessLineList.vue')
    }    ,{
        path: '/Base_MeritPay',
        name: 'Base_MeritPay',
        component: () => import('@/views/custom/custom/Base_MeritPay.vue')
    }    ,{
        path: '/Base_Product',
        name: 'Base_Product',
        component: () => import('@/views/custom/custom/Base_Product.vue')
    }    ,{
        path: '/View_Base_MaterialDetail',
        name: 'View_Base_MaterialDetail',
        component: () => import('@/views/custom/custom/View_Base_MaterialDetail.vue')
    }    ,{
        path: '/Ware_WareHouseBill',
        name: 'Ware_WareHouseBill',
        component: () => import('@/views/warehouse/warehouse/Ware_WareHouseBill.vue')
    }    ,{
        path: '/Ware_WareHouseBillList',
        name: 'Ware_WareHouseBillList',
        component: () => import('@/views/warehouse/warehouse/Ware_WareHouseBillList.vue')
    }    ,{
        path: '/Ware_OutWareHouseBillList',
        name: 'Ware_OutWareHouseBillList',
        component: () => import('@/views/warehouse/warehouse/Ware_OutWareHouseBillList.vue')
    }    ,{
        path: '/Ware_OutWareHouseBill',
        name: 'Ware_OutWareHouseBill',
        component: () => import('@/views/warehouse/warehouse/Ware_OutWareHouseBill.vue')
    }    ,{
        path: '/View_WareInOutDetail',
        name: 'View_WareInOutDetail',
        component: () => import('@/views/warehouse/warehouse/View_WareInOutDetail.vue')
    }    ,{
        path: '/View_StockBalance',
        name: 'View_StockBalance',
        component: () => import('@/views/warehouse/warehouse/View_StockBalance.vue')
    }    ,{
        path: '/Production_SalesOrderList',
        name: 'Production_SalesOrderList',
        component: () => import('@/views/production/production/Production_SalesOrderList.vue')
    }    ,{
        path: '/Production_SalesOrder',
        name: 'Production_SalesOrder',
        component: () => import('@/views/production/production/Production_SalesOrder.vue')
    }    ,{
        path: '/Production_ProductPlanList',
        name: 'Production_ProductPlanList',
        component: () => import('@/views/production/production/Production_ProductPlanList.vue')
    }    ,{
        path: '/Production_ProductPlan',
        name: 'Production_ProductPlan',
        component: () => import('@/views/production/production/Production_ProductPlan.vue')
    }    ,{
        path: '/Production_AssembleWorkOrderList',
        name: 'Production_AssembleWorkOrderList',
        component: () => import('@/views/production/production/Production_AssembleWorkOrderList.vue')
    }    ,{
        path: '/Production_AssembleWorkOrder',
        name: 'Production_AssembleWorkOrder',
        component: () => import('@/views/production/production/Production_AssembleWorkOrder.vue')
    }    ,{
        path: '/Production_WorkOrder',
        name: 'Production_WorkOrder',
        component: () => import('@/views/production/production/Production_WorkOrder.vue')
    }    ,{
        path: '/Production_WorkOrderList',
        name: 'Production_WorkOrderList',
        component: () => import('@/views/production/production/Production_WorkOrderList.vue')
    }    ,{
        path: '/Base_PrintCatalog',
        name: 'Base_PrintCatalog',
        component: () => import('@/views/custom/custom/Base_PrintCatalog.vue')
    }    ,{
        path: '/Base_PrintTemplate',
        name: 'Base_PrintTemplate',
        component: () => import('@/views/custom/custom/Base_PrintTemplate.vue')
    } ,{
        path: '/Base_PrintTemplateTree',
        name: 'Base_PrintTemplateTree',
        component: () => import('@/views/custom/custom/Base_PrintTemplateTree.vue')
    }    ,{
        path: '/Production_ReportWorkOrder',
        name: 'Production_ReportWorkOrder',
        component: () => import('@/views/production/production/Production_ReportWorkOrder.vue')
    }    ,{
        path: '/Production_ReportWorkOrderList',
        name: 'Production_ReportWorkOrderList',
        component: () => import('@/views/production/production/Production_ReportWorkOrderList.vue')
    }    ,{
        path: '/View_OutputStatistics',
        name: 'View_OutputStatistics',
        component: () => import('@/views/report/report/View_OutputStatistics.vue')
    }    ,{
        path: '/Sys_WorkFlowTableStep',
        name: 'Sys_WorkFlowTableStep',
        component: () => import('@/views/system/flow/Sys_WorkFlowTableStep.vue')
    }    ,{
        path: '/Sys_WorkFlowStep',
        name: 'Sys_WorkFlowStep',
        component: () => import('@/views/system/flow/Sys_WorkFlowStep.vue')
    }    ,{
        path: '/Sys_WorkFlowTable',
        name: 'Sys_WorkFlowTable',
        component: () => import('@/views/system/flow/Sys_WorkFlowTable.vue')
    }    ,{
        path: '/Sys_WorkFlow',
        name: 'Sys_WorkFlow',
        component: () => import('@/views/system/flow/Sys_WorkFlow.vue')
    }    ,{
        path: '/View_EmployeePerformance',
        name: 'View_EmployeePerformance',
        component: () => import('@/views/report/report/View_EmployeePerformance.vue')
    }    ,{
        path: '/View_SalaryReport',
        name: 'View_SalaryReport',
        component: () => import('@/views/report/report/View_SalaryReport.vue')
    }    ,{
        path: '/View_DefectItemDistribute',
        name: 'View_DefectItemDistribute',
        component: () => import('@/views/report/report/View_DefectItemDistribute.vue')
    }    ,{
        path: '/View_DefectItemSummary',
        name: 'View_DefectItemSummary',
        component: () => import('@/views/report/report/View_DefectItemSummary.vue')
    }    ,{
        path: '/View_ProductionReport',
        name: 'View_ProductionReport',
        component: () => import('@/views/report/report/View_ProductionReport.vue')
    }    ,{
        path: '/Base_Notice',
        name: 'Base_Notice',
        component: () => import('@/views/custom/custom/Base_Notice.vue')
    }    ,{
        path: '/Base_Product_ExtendData',
        name: 'Base_Product_ExtendData',
        component: () => import('@/views/custom/custom/Base_Product_ExtendData.vue')
    }    ,{
        path: '/Base_Process_ExtendData',
        name: 'Base_Process_ExtendData',
        component: () => import('@/views/custom/custom/Base_Process_ExtendData.vue')
    }    ,{
        path: '/Base_DefectItem_ExtendData',
        name: 'Base_DefectItem_ExtendData',
        component: () => import('@/views/custom/custom/Base_DefectItem_ExtendData.vue')
    }    ,{
        path: '/Base_MaterialDetail_ExtendData',
        name: 'Base_MaterialDetail_ExtendData',
        component: () => import('@/views/custom/custom/Base_MaterialDetail_ExtendData.vue')
    }    ,{
        path: '/Base_MeritPay_ExtendData',
        name: 'Base_MeritPay_ExtendData',
        component: () => import('@/views/custom/custom/Base_MeritPay_ExtendData.vue')
    }    ,{
        path: '/Sys_QuartzLog',
        name: 'Sys_QuartzLog',
        component: () => import('@/views/system/quartz/Sys_QuartzLog.vue')
    }    ,{
        path: '/Sys_QuartzOptions',
        name: 'Sys_QuartzOptions',
        component: () => import('@/views/system/quartz/Sys_QuartzOptions.vue')
    }    ,{
        path: '/Sys_VersionInfo',
        name: 'Sys_VersionInfo',
        component: () => import('@/views/system/system/Sys_VersionInfo.vue')
    }]

export default viewgird
