// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const getSysExpenseList = defRouteApi(()=> {
  return {
    url: '/sysExpense/findAll',
    method: 'GET',
  }
})

export const getSysExpenseByFlag = defRouteApi(()=> {
  return {
    url: '/sysExpense/findByFlag',
    method: 'GET',
  }
})

export const saveSysExpense = defRouteApi((params:any)=> {
  return {
    url: '/sysExpense',
    method: 'POST',
    params
  }
})

export const deleteSysExpense = defRouteApi((id:any)=> {
  return {
    url: '/sysExpense?id='+id,
    method: 'DELETE',
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sysExpense/editFlag',
    method: 'POST',
    params
  }
})

export const excelSysExpense = defRouteApi((params:any)=> {
  return {
    url: '/sysExpense/excel',
    method: 'POST',
    params
  }
})

export const findByCcode = defRouteApi((ccode:any)=> {
  return {
    url: '/sysExpense/findByCcode?ccode='+ccode,
    method: 'GET',
  }
})

export const findByCname = defRouteApi((cname:any)=> {
  return {
    url: '/sysExpense/findByCname?cname='+cname,
    method: 'GET',
  }
})

export const findMaxCcode = defRouteApi(()=> {
  return {
    url: '/sysExpense/findMaxCcode',
    method: 'GET',
  }
})

export const findBukongCcode = defRouteApi(()=> {
  return {
    url: '/sysExpense/findBukongCcode',
    method: 'GET',
  }
})
