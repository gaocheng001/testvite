// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function findDefinedFileList(){
  return defHttp.request({
    url: '/groupDefinedFile/findAll',
    method: 'GET',
  })
}

export function getDefinedFileList(){
  return defHttp.request({
    url: '/groupDefinedFile/getAll',
    method: 'GET',
  })
}

export function saveDefinedFile(params:any){
  return defHttp.request({
    url: '/groupDefinedFile',
    method: 'POST',
    params
  })
}

export function deleteDefinedFile(params:any){
  return defHttp.request({
    url: '/groupDefinedFile/del',
    method: 'DELETE',
    params
  })
}

export function deleteDefinedFileList(params:any){
  return defHttp.request({
    url: '/groupDefinedFile/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode(definedCode:any){
  return defHttp.request({
    url: '/groupDefinedFile/findByCode?definedCode='+definedCode,
    method: 'GET',
  })
}

export function findByName(definedName:any){
  return defHttp.request({
    url: '/groupDefinedFile/findByName?definedName='+definedName,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/groupDefinedFile/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllDefinedFileList(){
  return defHttp.request({
    url: '/groupDefinedFile/findAllList',
    method: 'GET',
  })
}

export function findByModelList({scope,model}){
  return defHttp.request({
    url: '/groupDefinedFile/findByModelList?scope='+scope+'&model='+model,
    method: 'GET',
  })
}

export function excelDefinedFile(params:any) {
  return defHttp.request({
    url: '/groupDefinedFile/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findMaxDefinedCode(){
  return defHttp.request({
    url: '/groupDefinedFile/findMaxDefinedCode',
    method: 'GET',
  })
}

export function findBukongDefinedCode(){
  return defHttp.request({
    url: '/groupDefinedFile/findBukongDefinedCode',
    method: 'GET',
  })
}

export function findByModelOrderByDefinedCode(model){
  return defHttp.request({
    url: '/groupDefinedFile/findByModelOrderByDefinedCode?model='+model,
    method: 'GET',
  })
}
