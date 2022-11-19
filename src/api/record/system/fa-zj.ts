import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";
import {excelVoucherType} from "/@/api/record/system/dept-class";

/**
 * @description: Get jigou Emp based on id
 */

export const getDeptList = defRouteApi( async ()=>{
  return  {
    url: '/sys/faZhejiuMethod/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getDeptListById = defRouteApi( async ()=>{
  return  {
    url: '/sys/faZhejiuMethod/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})


export const saveDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faZhejiuMethod/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faZhejiuMethod/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faZhejiuMethod/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const GetDeptTree = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faZhejiuMethod/treeDept',
    method: 'GET',
    params
  }
})

export const GetDeptTreeByFlag = defRouteApi( async ()=>{
  return  {
    url: '/sys/faZhejiuMethod/treeDeptByFlag',
    method: 'GET',
  }
})

export const excelVoucherType = defRouteApi( async (params:any)=>{
  return  {
    url: '/sys/faZhejiuMethod/excel',
    method: 'POST',
    params
  }
})

export const getMaxCode = defRouteApi( async (code)=>{
  return  {
    url: '/sys/faZhejiuMethod/getMaxCode?id='+code,
    method: 'GET',
  }
})
export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faZhejiuMethod/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

