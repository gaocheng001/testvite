import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get jigou Emp based on id
 */

export const getGdzcList =  defRouteApi((params)=>{
  return {
    url: '/sys/faKmSetting/getGdzcList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const getLjzjList =  defRouteApi(()=>{
  return {
    url: '/sys/faKmSetting/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const save =  defRouteApi((params)=>{
  return {
    url: '/sys/faKmSetting/save',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/faKmSetting',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/faKmSetting',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/faKmSetting/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/faKmSetting/excel',
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
    url: '/sys/faKmSetting/treeDept',
    method: 'GET',
    params
  }
})


export const GetDeptTreeByFlag = defRouteApi(async () => ({
  url: '/sys/faKmSetting/treeDeptByFlag',
  method: 'GET',
}));


export const GetfaKmSettingAll = defRouteApi(()=>{
  return {
    url: '/sys/faKmSetting/findAll',
    method: 'GET',
  }
})

export const SavefaKmSetting = defRouteApi((params)=>{
  return {
    url: '/sys/faKmSetting/save',
    method: 'POST',
    params
  }
})

export const DeletefaKmSettingBy = defRouteApi((params)=>{
  return {
    url: '/sys/faKmSetting/deleteBy',
    method: 'POST',
    params
  }
})

