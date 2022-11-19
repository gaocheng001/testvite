import { defHttp } from '/@/utils/http/axios';

enum Api {
  findAll = `/SysLogger/findAll`,
  findAllByYearAndMonthApi = `/SysLogger/findAllByYearAndMonth`,
  findAllByYearAndMonthAndDayApi = `/SysLogger/findAllByYearAndMonthAndDay`,
  findById = `/SysLogger/findById`,
  save = `/SysLogger/save`,
  deleteById = `/SysLogger/deleteById`,
}

export function findAllApi(params) {
  return defHttp.request({
    timeout: 1000000,
    url: Api.findAll,
    method: 'GET',
    params,
  });
}
export function findAllByYearAndMonthApi(params) {
  return defHttp.request({
    timeout: 1000000,
    url: Api.findAllByYearAndMonthApi,
    method: 'GET',
    params,
  });
}

export function findAllByYearAndMonthAndDayApi(params) {
  return defHttp.request({
    timeout: 1000000,
    url: Api.findAllByYearAndMonthAndDayApi,
    method: 'GET',
    params,
  });
}

export function findByIdApi() {
  return defHttp.request({
    url: Api.findById,
    method: 'GET',
  });
}

export function saveApi(params) {
  return defHttp.request({
    url: Api.save,
    method: 'POST',
    params,
  });
}

export async function deleteByIdApi(params) {
  return defHttp.request({
    url: Api.deleteById,
    method: 'DELETE',
    params,
  });
}
