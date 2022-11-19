import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findByReportName=defRouteApi(({reportName}:any)=> {
  return {
    url: '/reportTemplate/findByReportName?reportName='+reportName,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByReportNameAndFlag=defRouteApi((reportName:any)=> {
  return {
    url: '/reportTemplate/findByReportNameAndFlag?reportName='+reportName,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByTemplateName=defRouteApi((templateName:any)=> {
  return {
    url: '/reportTemplate/findByTemplateName?templateName='+templateName,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByColumn=defRouteApi((templateId:any)=> {
  return {
    url: '/reportTemplate/findByColumn?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByColumnAndType=defRouteApi(({templateId, columnType}:any)=> {
  return {
    url: '/reportTemplate/findByColumnAndType?templateId='+templateId+'&columnType='+columnType,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByFormula=defRouteApi((columnId:any)=> {
  return {
    url: '/reportTemplate/findByFormula?columnId='+columnId,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveTemplate=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/saveTemplate',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveColumn=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/saveColumn',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveFormula=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/saveFormula',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteTemplate=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/deleteTemplate',
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteColumn=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/deleteColumn',
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteFormula=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/deleteFormula',
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteFormulaByTemplate=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/deleteFormulaByTemplate',
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag=defRouteApi((params:any)=> {
  return {
    url: '/reportTemplate/editFlag',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findTemplateById=defRouteApi((id:any)=> {
  return {
    url: '/reportTemplate/findById?id='+id,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findFormulaByTemplate=defRouteApi((templateId:any)=> {
  return {
    url: '/reportTemplate/findFormulaByTemplate?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByTitleName=defRouteApi(({reportName, titleName}:any)=> {
  return {
    url: '/reportTemplate/findByTitleName?reportName='+reportName+'&titleName='+titleName,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByNum=defRouteApi((num:any)=> {
  return {
    url: '/reportTemplate/findByTitleName?num='+num,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByAccvoucherOrderAndTemplateId = defRouteApi(({
                                                                 templateId,
                                                                 iyperiod1,
                                                                 iyperiod2,
                                                                 jizhang
                                                               }: any) => {
  return {
    url: '/reportTemplate/findByAccvoucherOrderAndTemplateId?templateId=' + templateId + '&iyperiod1=' + iyperiod1 + '&iyperiod2=' + iyperiod2 + '&jizhang=' + jizhang,
    timeout: 1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findTemplateBySysFlag = defRouteApi(({sysFlag}:any)=>{
  return {
    url: '/reportTemplate/findTemplateBySysFlag?sysFlag='+sysFlag,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByCashOrderAndTemplateId = defRouteApi(({
                                                           templateId,
                                                           iyear,
                                                           iperiod1,
                                                           iperiod2
                                                         }: any) => {
  return {
    url: '/reportTemplate/findByCashOrderAndTemplateId?templateId=' + templateId + '&iyear=' + iyear + '&iperiod1=' + iperiod1 + '&iperiod2=' + iperiod2,
    timeout: 1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
