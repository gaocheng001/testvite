// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function cateFindAll(originId) {
  return defHttp.request({
      url: '/originProject/category/findAll?originId='+originId,
      method: 'GET'
    })
}

export function columnFindCate(projectCateCode:any,originId) {
  return defHttp.request({
      url: '/originProject/category/findColumnByCate?projectCateCode=' + projectCateCode+'&originId='+originId,
      method: 'GET',
    })
}

export function cateFindByFlag(originId) {
  return defHttp.request({
      url: '/originProject/category/findByFlag?originId='+originId,
      method: 'GET'
    })
}

export function editFlag(params:any) {
  return defHttp.request({
    url: '/originProject/category/editFlag',
    method: 'POST',
    params
  })
}

export function saveCate(params:any) {
  return defHttp.request({
    url: '/originProject/category',
    method: 'POST',
    params
  })
}

export function deleteCate(params:any) {
  return defHttp.request({
    url: '/originProject/category',
    method: 'DELETE',
    params
  })
}

export function deleteColumn(id:any) {
  return defHttp.request({
    url: '/originProject/category/deleteColumn?id=' + id,
    method: 'DELETE',
  })
}

export function findProCateByCode(projectCateCode:any,originId) {
  return defHttp.request({
      url: '/originProject/category/findByCode?projectCateCode=' + projectCateCode +'&originId='+originId,
      method: 'GET',
    })
}

export function findProCateByName(projectCateName:any,originId) {
  return defHttp.request({
      url: '/originProject/category/findByName?projectCateName=' + projectCateName+'&originId='+originId,
      method: 'GET',
    })
}

export function findMaxProjectCateCode(originId) {
  return defHttp.request({
    url: '/originProject/category/findMaxProjectCateCode?originId='+originId,
    method: 'GET',
  })
}

export function findBukongProjectCateCode(originId) {
  return defHttp.request({
    url: '/originProject/category/findBukongProjectCateCode?originId='+originId,
    method: 'GET',
  })
}
