import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findProjectItemList(){
  return defHttp.request({
    url: '/groupProjectItem/findAll',
    method: 'GET',
  })
}

export function getProjectItemList(){
  return defHttp.request({
    url: '/groupProjectItem/getAll',
    method: 'GET',
  })
}

export function saveProjectItem(params:any){
  return defHttp.request({
    url: '/groupProjectItem',
    method: 'POST',
    params
  })
}

export function deleteProjectItem(params:any){
  return defHttp.request({
    url: '/groupProjectItem/del',
    method: 'DELETE',
    params
  })
}

export function deleteProjectItemList(params:any){
  return defHttp.request({
    url: '/groupProjectItem/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(itemCode:any){
  return defHttp.request({
    url: '/groupProjectItem/findByCode?itemCode='+itemCode,
    method: 'GET',
  })
}

export function findByName(itemName:any){
  return defHttp.request({
    url: '/groupProjectItem/findByName?itemName='+itemName,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/groupProjectItem/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllProjectItemList(){
  return defHttp.request({
    url: '/groupProjectItem/findAllList',
    method: 'GET',
  })
}

export function excelProjectItem(params:any) {
  return defHttp.request({
    url: '/groupProjectItem/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}
