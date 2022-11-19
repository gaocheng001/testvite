import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/faUsageStatus/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/faUsageStatus/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/faUsageStatus/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/faUsageStatus/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/faUsageStatus/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/faUsageStatus/excel',
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
    url: '/sys/faUsageStatus/treeDept',
    method: 'GET',
    params
  }
})
export const GetDeptTreeByFlag = defRouteApi(()=>{
  return {
    url: '/sys/faUsageStatus/treeDeptByFlag',
    method: 'GET',
  }
})
export const getMaxCode = defRouteApi((code: any)=>{
  return {
    url: '/sys/faUsageStatus/getMaxCode?id='+code,
    method: 'GET',
  }
})
export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faUsageStatus/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

