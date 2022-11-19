import {defHttp} from "/@/utils/http/axios";
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getProjectCashList(){
  return defHttp.request({
    url: '/groupProjectCash/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getProjectCashByAccStandard({accStandard}){
  return defHttp.request({
    url: '/groupProjectCash/findListByAccStandard?accStandard='+accStandard,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveProjectCash(params:any){
  return defHttp.request({
    url: '/groupProjectCash',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteProjectCash(params:any){
  return defHttp.request({
    url: '/groupProjectCash',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findByCode(projectCode:any){
  return defHttp.request({
    url: '/groupProjectCash/findByCode?projectCode='+projectCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function editFlag(params:any){
  return defHttp.request({
    url: '/groupProjectCash/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findCodeByYearAndBend ({accStandard}:any){
  return defHttp.request({
    url: '/groupProjectCash/findCodeByYearAndBend?accStandard='+accStandard,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findCodeByProjectCode({projectCode,iyear}){
  return defHttp.request({
    url: '/groupProjectCash/findCodeByProjectCode?projectCode='+projectCode+'&iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function findCodeByIyear(iyear:any){
  return defHttp.request({
    url: '/groupProjectCash/findCodeByIyear?iyear='+iyear,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function getTypeList(accStandard:any){
  return defHttp.request({
    url: '/groupProjectCash/getTypeList?accStandard='+accStandard,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

