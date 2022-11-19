import {defHttp} from "/@/utils/http/axios";

export function findDefinedFileList({originId}:any){
  return defHttp.request({
    url: '/originDefinedFile/findAll?originId='+originId,
    method: 'GET',
  })
}

export function getDefinedFileList(originId:any){
  return defHttp.request({
    url: '/originDefinedFile/getAll?originId='+originId,
    method: 'GET',
  })
}

export function saveDefinedFile(params:any){
  return defHttp.request({
    url: '/originDefinedFile',
    method: 'POST',
    params
  })
}

export function deleteDefinedFile(params:any){
  return defHttp.request({
    url: '/originDefinedFile/del',
    method: 'DELETE',
    params
  })
}

export function deleteDefinedFileList(params:any){
  return defHttp.request({
    url: '/originDefinedFile/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(definedCode:any,originId:any){
  return defHttp.request({
    url: '/originDefinedFile/findByCode?definedCode='+definedCode+'&originId='+originId,
    method: 'GET',
  })
}

export function findByName(definedName:any,originId:any){
  return defHttp.request({
    url: '/originDefinedFile/findByName?definedName='+definedName+'&originId='+originId,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/originDefinedFile/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllDefinedFileList(originId:any){
  return defHttp.request({
    url: '/originDefinedFile/findAllList?originId='+originId,
    method: 'GET',
  })
}

export function excelDefinedFile(params:any) {
  return defHttp.request({
    url: '/originDefinedFile/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findByModelList({scope,model,originId}){
  return defHttp.request({
    url: '/originDefinedFile/findByModelList?scope='+scope+'&model='+model+'&originId='+originId,
    method: 'GET',
  })
}

export function findMaxDefinedCode(originId){
  return defHttp.request({
    url: '/originDefinedFile/findMaxDefinedCode?originId='+originId,
    method: 'GET',
  })
}

export function findBukongDefinedCode(originId){
  return defHttp.request({
    url: '/originDefinedFile/findBukongDefinedCode?originId='+originId,
    method: 'GET',
  })
}

export function findByModelOrderByDefinedCode(model,originId){
  return defHttp.request({
    url: '/originDefinedFile/findByModelOrderByDefinedCode?model='+model+'&originId='+originId,
    method: 'GET',
  })
}
