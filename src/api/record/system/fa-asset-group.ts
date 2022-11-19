import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export const findSettModesAll = defRouteApi(()=> {
  return {
    url: '/sys/faAssetGroup/findAll',
    method: 'GET',
  }
})

export const findSettModesByFlag = defRouteApi(()=> {
  return {
    url: '/sys/faAssetGroup/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/faAssetGroup',
    method: 'POST',
    params
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/faAssetGroup',
    method: 'DELETE',
    params
  }
})

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/faAssetGroup/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByBsName = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/faAssetGroup/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sys/faAssetGroup/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/sys/faAssetGroup/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faAssetGroup/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
