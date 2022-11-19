import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findByReportName=defRouteApi(({reportName}:any)=> {
  return {
    url: '/reportData/findByReportName?reportName='+reportName,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByTemplateId=defRouteApi((templateId:any)=> {
  return {
    url: '/reportData/findByTemplateId?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByDataType=defRouteApi(({templateId, dataType, iyear, jidu, iperiod}:any)=> {
  return {
    url: '/reportData/findByDataType?templateId='+templateId+'&dataType='+dataType+'&iyear='+iyear+'&jidu='+jidu+'&iperiod='+iperiod,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByColumn=defRouteApi((dataId:any)=> {
  return {
    url: '/reportData/findByColumn?dataId='+dataId,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByDataIdAndColumnType=defRouteApi(({dataId, columnType}:any)=> {
  return {
    url: '/reportData/findByDataIdAndColumnType?dataId='+dataId+'&columnType='+columnType,
    timeout:1000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveReport=defRouteApi((params:any)=> {
  return {
    url: '/reportData',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveReportData=defRouteApi((params:any)=> {
  return {
    url: '/reportData/saveReportData',
    timeout:1000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteReport=defRouteApi((id:any)=> {
  return {
    url: '/reportData/deleteData?id='+id,
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const deleteColumn=defRouteApi((dataId:any)=> {
  return {
    url: '/reportData/deleteColumn?dataId='+dataId,
    timeout:1000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  }
})
