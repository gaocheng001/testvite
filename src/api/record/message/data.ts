import {defRouteApi, otherRouteApi, useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";


enum Api {
  findAll         = '/api/message/findAll',
  hide            = '/api/message/hide',
  read            = '/api/message/read',
  getUserList     = '/api/message/getUserList',
  save            = '/api/message/save',
  getMessageUser  = '/api/message/getMessageUser',
  findAllIndex    = '/api/message/findAllIndex',
  findNewMseeage  = '/api/message/findNewMseeage',
  chexiao         = '/api/message/chexiao',
  getFileList     = '/api/message/getFileList',
  delete          = '/api/message/delete',
  getTypeList     = '/api/message/getTypeList',
}

/**
 * @description: Get user jigou based on id
 */

// 消息list
export function  findAll(params:any) {
  return defHttp.request({
    url: Api.findAll,
    method: 'POST',
    params
  })
}
//首页消息 4条
export function  findAllIndex(params:any) {
  return defHttp.request({
    url: Api.findAllIndex,
    method: 'POST',
    params
  })
}
//定时一分钟请求 新消息数量
export function  findNewMseeage(params:any) {
  return defHttp.request({
    url: Api.findNewMseeage,
    method: 'POST',
    params
  })
}

//隐藏
export function  hide(userId,id) {
  return defHttp.request({
    url: Api.hide+'/'+id+"/"+userId,
    method: 'GET',
  })
}
//隐藏
export function  chexiao(id,messageId) {
  return defHttp.request({
    url: Api.chexiao+'/'+id+'/'+messageId,
    method: 'GET',
  })
}
//read
export function goread(userId,ids) {
  return defHttp.request({
    url: Api.read+'/'+ids+"/"+userId,
    method: 'GET',
  })
}
//getUserList
export function getUserList() {
  return defHttp.request({
    url: Api.getUserList,
    method: 'GET',
  })
}

//getMessageUser
export function getMessageUser() {
  return defHttp.request({
    url: Api.getMessageUser,
    method: 'GET',
  })
}
//save
export function save(params:any) {
  return defHttp.request({
    url: Api.save,
    method: 'POST',
    params
  })
}
export function getFileList(id:any) {
  return defHttp.request({
    url: Api.getFileList+"/"+id,
    method: 'GET',
  })
}

export function delMessage(params:any) {
  return defHttp.request({
    url: Api.delete,
    method: 'POST',
    params
  })
}
export function getTypeList() {
  return defHttp.request({
    url: Api.getTypeList,
    method: 'GET',
  })
}
