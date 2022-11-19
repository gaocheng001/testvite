// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function findDefinedRecordList({definedCode}){
  return defHttp.request({
    url: '/groupDefinedRecord/findAll?definedCode='+definedCode,
    method: 'GET',
  })
}

export function getDefinedRecordList(definedCode){
  return defHttp.request({
    url: '/groupDefinedRecord/getAll?definedCode='+definedCode,
    method: 'GET',
  })
}

export function saveDefinedRecord(params:any){
  return defHttp.request({
    url: '/groupDefinedRecord',
    method: 'POST',
    params
  })
}

export function deleteDefinedRecord(params:any){
  return defHttp.request({
    url: '/groupDefinedRecord/del',
    method: 'DELETE',
    params
  })
}

export function deleteDefinedRecordList(params:any){
  return defHttp.request({
    url: '/groupDefinedRecord/deleteList',
    method: 'DELETE',
    params
  })
}

export function findByCode({definedCode,recordCode}){
  return defHttp.request({
    url: '/groupDefinedRecord/findByCode?definedCode='+definedCode+'&recordCode='+recordCode,
    method: 'GET',
  })
}

export function findByName({definedCode,recordName}){
  return defHttp.request({
    url: '/groupDefinedRecord/findByName?definedCode='+definedCode+'&recordName='+recordName,
    method: 'GET',
  })
}

export function editByFlag(params:any){
  return defHttp.request({
    url: '/groupDefinedRecord/editByFlag',
    method: 'POST',
    params
  })
}

export function findAllDefinedRecordList(definedCode:any){
  return defHttp.request({
    url: '/groupDefinedRecord/findAllList?definedCode='+definedCode,
    method: 'GET',
  })
}

export function excelDefinedRecord(params:any){
  return defHttp.request({
    url: '/groupDefinedRecord/excel',
    timeout:100000000000,
    method: 'POST',
    params
  })
}

export function findMaxRecordCode(definedCode:any){
  return defHttp.request({
    url: '/groupDefinedRecord/findMaxRecordCode?definedCode='+definedCode,
    method: 'GET',
  })
}

export function findBukongRecordCode(definedCode:any){
  return defHttp.request({
    url: '/groupDefinedRecord/findBukongRecordCode?definedCode='+definedCode,
    method: 'GET',
  })
}
