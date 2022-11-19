import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findDefinedRecordList=defRouteApi( ({definedCode})=>{
  return{
    url: '/definedRecord/findAll?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getDefinedRecordList=defRouteApi( (definedCode)=>{
  return{
    url: '/definedRecord/getAll?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveDefinedRecord=defRouteApi((params:any)=>{
  return {
    url: '/definedRecord',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDefinedRecord=defRouteApi((params:any)=>{
  return {
    url: '/definedRecord/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDefinedRecordList=defRouteApi((params:any)=>{
  return {
    url: '/definedRecord/deleteList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi(({definedCode,recordCode})=>{
  return {
    url: '/definedRecord/findByCode?definedCode='+definedCode+'&recordCode='+recordCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByName=defRouteApi(({definedCode,recordName})=>{
  return {
    url: '/definedRecord/findByName?definedCode='+definedCode+'&recordName='+recordName,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/definedRecord/editByFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAllDefinedRecordList=defRouteApi((definedCode:any)=>{
  return {
    url: '/definedRecord/findAllList?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelDefinedRecord = defRouteApi((params:any)=> {
  return {
    url: '/definedRecord/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findMaxRecordCode=defRouteApi((definedCode:any)=>{
  return {
    url: '/definedRecord/findMaxRecordCode?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBukongRecordCode=defRouteApi((definedCode:any)=>{
  return {
    url: '/definedRecord/findBukongRecordCode?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
