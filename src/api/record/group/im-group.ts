import {defHttp} from "/@/utils/http/axios";
import {usePlatformsStore} from "/@/store/modules/platforms";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export async function getGroupList (params:any){
  return  defHttp.request({
    url: '/group/sys-group',
    method: 'GET',
    timeout: 100000000000,
    params
  })
}

export async function getGroupAll (){
  return  defHttp.request({
    url: '/group/sys-group/all',
    timeout: 100000000000,
    method: 'GET',
  })
}

export async function saveGroup(params:any){
  return defHttp.request({
    url: '/group/sys-group',
    method: 'POST',
    timeout: 100000000000,
    params
  })
}

export async function deleteGroup (params: any){
  return defHttp.request({
    url: '/group/sys-group',
    method: 'DELETE',
    params
  })
}

export async function findByCode (params:any){
  return defHttp.request({
    url: '/group/sys-group/findByCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export async function findByName (params:any){
  return defHttp.request({
    url: '/group/sys-group/findByName',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export async function findAllIndustry (){
  return defHttp.request({
    url: '/group/sys-class-industry/findAllIndustry',
    method: 'GET',

  })
}

export async function importImg(params:any){
  return defHttp.request({
    url: '/group/sys-group/img',
    timeout:100000000000,
    method: 'POST',
    params
  })
}
