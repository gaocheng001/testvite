import {defHttp} from "/@/utils/http/axios";

enum Api {
  FindAll = '/groupProject/category/findAll',
}

/**
 * @description: user login api
 */
export function cateFindAll() {
  return defHttp.request({
      url: Api.FindAll,
      method: 'GET'
    })
}

export function columnFindCate(projectCateCode:any) {
  return defHttp.request({
      url: '/groupProject/category/findColumnByCate?projectCateCode=' + projectCateCode,
      method: 'GET',
    })
}

export function cateFindStateFlag() {
  return defHttp.request({
      url: '/groupProject/category/findBySuccessStateAndFlag',
      method: 'GET'
    })
}

export function editFlag(params:any) {
  return defHttp.request({
    url: '/groupProject/category/editFlag',
    method: 'POST',
    params
  })
}

export function saveCate(params:any) {
  return defHttp.request({
    url: '/groupProject/category',
    method: 'POST',
    params
  })
}

export function deleteCate(params:any) {
  return defHttp.request({
    url: '/groupProject/category',
    method: 'DELETE',
    params
  })
}

export function deleteColumn(id:any) {
  return defHttp.request({
    url: '/groupProject/category/deleteColumn?id=' + id,
    method: 'DELETE',
  })
}

export function findProCateByCode(projectCateCode:any) {
  return defHttp.request({
      url: '/groupProject/category/findByCode?projectCateCode=' + projectCateCode,
      method: 'GET',
    })
}

export function findProCateByName(projectCateName:any) {
  return defHttp.request({
      url: '/groupProject/category/findByName?projectCateName=' + projectCateName,
      method: 'GET',
    })
}

export function findMaxProjectCateCode() {
  return defHttp.request({
    url: '/groupProject/category/findMaxProjectCateCode',
    method: 'GET',
  })
}

export function findBukongProjectCateCode() {
  return defHttp.request({
    url: '/groupProject/category/findBukongProjectCateCode',
    method: 'GET',
  })
}
