import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";
import {excelVoucherType} from "/@/api/record/system/dept-class";

/**
 * @description: Get jigou Emp based on id
 */

export const getDeptList = defRouteApi( async ()=>{
  return  {
    url: '/sys/faAddCutMode/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getDeptListById = defRouteApi( async ()=>{
  return  {
    url: '/sys/faAddCutMode/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})


export const saveDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faAddCutMode/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faAddCutMode/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faAddCutMode/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const GetDeptTree = defRouteApi( async (params)=>{
  return  {
    url: '/sys/faAddCutMode/treeDept',
    method: 'GET',
    params
  }
})

export const GetDeptTreeByFlag = defRouteApi( async ()=>{
  return  {
    url: '/sys/faAddCutMode/treeDeptByFlag',
    method: 'GET',
  }
})

export const excelVoucherType = defRouteApi( async (params:any)=>{
  return  {
    url: '/sys/faAddCutMode/excel',
    method: 'POST',
    params
  }
})

export const getMaxCode = defRouteApi( async (code)=>{
  return  {
    url: '/sys/faAddCutMode/getMaxCode?id='+code,
    method: 'GET',
  }
})


export const getCutModeAllList= defRouteApi( async ()=>{
  return  {
    url: '/sys/faAddCutMode/allMinus',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faAddCutMode/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
