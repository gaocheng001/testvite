import {defHttp} from "/@/utils/http/axios";
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getProjectCashList(params:any){
  return defHttp.request({
    url: '/originProjectCash/findAll',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function getProjectCashByAccStandard({accStandard}){
  return defHttp.request({
    url: '/originProjectCash/findListByAccStandard?accStandard='+accStandard,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveProjectCash(params:any){
  return defHttp.request({
    url: '/originProjectCash',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteProjectCash(params:any){
  return defHttp.request({
    url: '/originProjectCash',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(projectCode:any){
  return defHttp.request({
    url: '/originProjectCash/findByCode?projectCode='+projectCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function editFlag(params:any){
  return defHttp.request({
    url: '/originProjectCash/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findCodeByIyear(iyear:any){
  return defHttp.request({
    url: '/originProjectCash/findCodeByIyear?iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function excelProjectCash(params:any){
  return defHttp.request({
    url: '/originProjectCash/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findCodeByProjectCode({projectCode,accStandard,originId,iyear}){
  return defHttp.request({
    url: '/originProjectCash/findCodeByProjectCode?projectCode='+projectCode+'&accStandard='+accStandard+'&originId='+originId+'&iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findCodeByYearAndBend({originId,year}){
  return defHttp.request({
    url: '/originProjectCash/findCodeByYearAndBend?year='+year+'&originId='+originId,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getAccountList(groupId:any){
  return defHttp.request({
    url: '/originProjectCash/getAccountList?groupId='+groupId,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

//状态
export const saveProjectCash2=defRouteApi((params:any)=>{
  return {
    url: '/projectCash',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const deleteProjectCash2=defRouteApi((params:any)=>{
  return {
    url: '/projectCash',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const editFlag2=defRouteApi((params:any)=>{
  return {
    url: '/projectCash/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelProjectCash2 = defRouteApi((params:any)=> {
  return {
    url: '/projectCash/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export function initData({groupId,year}){
  return defHttp.request({
    url: '/originProjectCash/initData?groupId='+groupId+'&year='+year,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getTypeList({accStandard,originId,iyear}){
  return defHttp.request({
    url: '/originProjectCash/getTypeList?accStandard='+accStandard+'&originId='+originId+'&iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export const getTotalData = defRouteApi(()=>{
  return {
    url: '/originProjectCash/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
