// @ts-ignore
import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const getSysBankAccountList = defRouteApi(()=> {
  return {
    url: '/sysBankAccount/findAll',
    method: 'GET',
  }
})

export const getSysBankAccountByStatus = defRouteApi(()=> {
  return {
    url: '/sysBankAccount/findByStatus',
    method: 'GET',
  }
})

export const saveSysBankAccount = defRouteApi((params:any)=> {
  return {
    url: '/sysBankAccount',
    method: 'POST',
    params
  }
})

export const deleteSysBankAccount = defRouteApi((id:any)=> {
  return {
    url: '/sysBankAccount?id='+id,
    method: 'DELETE',
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sysBankAccount/editFlag',
    method: 'POST',
    params
  }
})

export const excelSysBankAccount = defRouteApi((params:any)=> {
  return {
    url: '/sysBankAccount/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCname = defRouteApi((cname:any)=> {
  return {
    url: '/sysBankAccount/findByCname?cname='+cname,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
