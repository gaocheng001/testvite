import {defHttp} from "/@/utils/http/axios";

export function findProjectItemList(originId){
  return defHttp.request({
    url: '/originProjectItem/findAll?originId='+originId,
    method: 'GET',
  })
}

export function getProjectItemList(originId){
  return defHttp.request({
    url: '/originProjectItem/getAll?originId='+originId,
    method: 'GET',
  })
}

export function saveProjectItem(params:any){
  return defHttp.request({
    url: '/originProjectItem',
    method: 'POST',
    params
  })
}

export function deleteProjectItem(params:any){
  return defHttp.request({
    url: '/originProjectItem/del',
    method: 'DELETE',
    params
  })
}

export function deleteProjectItemList(params:any){
  return defHttp.request({
    url: '/originProjectItem/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(itemCode:any,originId){
  return defHttp.request({
    url: '/originProjectItem/findByCode?itemCode='+itemCode+'&originId='+originId,
    method: 'GET',
  })
}

export function findByName(itemName:any,originId){
  return defHttp.request({
    url: '/originProjectItem/findByName?itemName='+itemName+'&originId='+originId,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/originProjectItem/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllProjectItemList(originId){
  return defHttp.request({
    url: '/originProjectItem/findAllList?originId='+originId,
    method: 'GET',
  })
}

export function excelProjectItem(params:any) {
  return defHttp.request({
    url: '/originProjectItem/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}
