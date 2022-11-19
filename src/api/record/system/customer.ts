import { defHttp } from '/@/utils/http/axios';

enum Api {
  findAll = '/sys/cusrtomer/findAll',
  findAllByFlag = '/sys/cusrtomer/findAllByFlag',
  findAllCountry = '/sys/cusrtomer/findAllCountry',
  findAllSysTradeNature = '/sys/cusrtomer/findAllSysTradeNature',
  customerAddApi = '/sys/cusrtomer/save',
  verifyCustomerName = '/sys/cusrtomer/verifyCustomerName',
  verifyCustomerNum = '/sys/cusrtomer/verifyCustomerNum',
  verifyByCustAbbname = '/sys/cusrtomer/verifyByCustAbbname',
  verifyByCustSregcode = '/sys/cusrtomer/verifyByCustSregcode',
  onlyEditDatabase = '/sys/cusrtomer/onlyEditDatabase',
  exportExcelFindAllJSON = '/sys/cusrtomer/exportExcelFindAllJSON',
}

export function verifyByCustSregcode(custSregcode: any) {
  return defHttp.request({
    url: Api.verifyByCustSregcode + '?custSregcode=' + custSregcode,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyByCustAbbname(custAbbname: any) {
  return defHttp.request({
    url: Api.verifyByCustAbbname + '?custAbbname=' + custAbbname,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustomerNum(num: any) {
  return defHttp.request({
    url: Api.verifyCustomerNum + '?num=' + num,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustomerName(name: any) {
  return defHttp.request({
    url: Api.verifyCustomerName + '?name=' + name,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

/* 获取启用中的客户信息 */
export async function findAllByFlag(flag: any) {
  return defHttp.request({
    url: Api.findAllByFlag + '?flag=' + flag,timeout: 100000000000,
    method: 'GET',
  });
}

/* 获取国家信息*/
export async function findAllCountry() {
  return defHttp.request({
    url: Api.findAllCountry,timeout: 100000000000,
    method: 'GET',
  });
}
/* 获取行业性质信息*/
export async function findAllSysTradeNature() {
  return defHttp.request({
    url: Api.findAllSysTradeNature,timeout: 100000000000,
    method: 'GET',
  });
}
export async function findAll(params: any) {
  return defHttp.request({
    url: Api.findAll,timeout: 100000000000,
    method: 'GET',
    params,
  });
}

export function customerAddApi(params, { accId, userName }) {
  return defHttp.request({
    url: Api.customerAddApi + '?accId=' + accId + '&userName=' + userName,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}

export function onlyEditDatabase(params: any) {
  return defHttp.request({
    url: Api.onlyEditDatabase,timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  });
}
export async function exportExcelFindAllJSON() {
  return defHttp.request({
    url: Api.exportExcelFindAllJSON,timeout: 100000000000,
    method: 'GET',
  });
}
export async function getCusDataAuthorData(params) {
  return defHttp.request({
    url: '/cusrtomer/getCusDataAuthorData',timeout: 100000000000,
    method: 'POST',
    params,
  });
}
