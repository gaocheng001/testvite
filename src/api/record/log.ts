import { defHttp } from '/@/utils/http/axios';

enum Api {
  serveDate = '/sys/log/serverDate',
  serverTime = '/sys/log/serverTime',
  findAllLogByNameAndInterval= '/sys/log/interval',
}

export function savelog(params) {
  return defHttp.request({
    url: '/sys/log/save',
    method: 'POST',
    params,
  });
}

export function findInterval(params) {
  return defHttp.request({
    url: Api.findAllLogByNameAndInterval,
    method: 'POST',
    params,
  });
}

export function serveDate(){
  return defHttp.request({
    url: Api.serveDate,
    method: 'GET',
  });
}
export function serverTime(){
  return defHttp.request({
    url: Api.serverTime,
    method: 'GET',
  });
}
export function newLogSave(params) {
  return defHttp.request({
    url: '/sys/log/save',
    method: 'POST',
    params,
  });
}
