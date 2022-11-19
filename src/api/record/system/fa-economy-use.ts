import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export const findSettModesAll = defRouteApi(()=> {
  return {
    url: '/sys/faEconomyUse/findAll',
    method: 'GET',
  }
})

export const findSettModesByFlag = defRouteApi(()=> {
  return {
    url: '/sys/faEconomyUse/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/faEconomyUse',
    method: 'POST',
    params
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/faEconomyUse',
    method: 'DELETE',
    params
  }
})

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/faEconomyUse/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByBsName = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/faEconomyUse/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sys/faEconomyUse/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/sys/faEconomyUse/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/faEconomyUse/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})


