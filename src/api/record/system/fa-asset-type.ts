import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getfaZhejiuMethodList =  defRouteApi(()=>{
  return {
    url: '/sys/faZhejiuMethod/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getFaPropertyList =  defRouteApi(()=>{
  return {
    url: '/sys/FaProperty/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getUnitmeaList=  defRouteApi(()=>{
  return {
    url: '/sys/unitmea/findAllSysUnitOfMea',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/faAssetType/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/faAssetType/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/faAssetType/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/faAssetType/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const GetDeptTree = defRouteApi((params)=>{
  return {
    url: '/sys/faAssetType/treeDept',
    method: 'GET',
    params
  }
})
export const GetDeptTreeByFlag = defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/treeDeptByFlag',
    method: 'GET',
  }
})
export const getMaxCode = defRouteApi((code: any)=>{
  return {
    url: '/sys/faAssetType/getMaxCode?id='+code,
    method: 'GET',
  }
})

export const getFaProperty = defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/getFaProperty',
    method: 'GET',
  }
})
export const getFaZhejiuMethod = defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/getFaZhejiuMethod',
    method: 'GET',
  }
})
export const getSysUnitOfMeaType = defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/getSysUnitOfMeaType',
    method: 'GET',
  }
})

export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faAssetType/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
