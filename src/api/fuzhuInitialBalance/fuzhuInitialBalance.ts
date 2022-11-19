import { defHttp } from '/@/utils/http/axios';

enum Api {
  findByFuzhuCode = '/sys/fuzhuInitialBalance/findByFuzhuCode',
  findByFuzhuInitalBalance = '/sys/fuzhuInitialBalance/findByFuzhuInitalBalance',
  findByItem = '/sys/fuzhuInitialBalance/findByItem',
  findBySup = '/sys/fuzhuInitialBalance/findBySup',
  findByCus = '/sys/fuzhuInitialBalance/findByCus',
  findByDept = '/sys/fuzhuInitialBalance/findByDept',
  findByPerson = '/sys/fuzhuInitialBalance/findByPerson',
  saveFuzhuInitalBalance = '/sys/fuzhuInitialBalance/saveFuzhuInitalBalance',
}

export function findByFuzhuCode(iyear: any) {
  return defHttp.request({
    url: Api.findByFuzhuCode + '?iyear=' + iyear,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByFuzhuInitalBalance(ccode: any, iyear: any) {
  return defHttp.request({
    url: Api.findByFuzhuInitalBalance + '?ccode=' + ccode + '&iyear=' + iyear,
    method: 'POST',timeout: 100000000000,
  });
}
export function findByPerson() {
  return defHttp.request({
    url: Api.findByPerson,
    method: 'GET',timeout: 100000000000,
  });
}
export function findByDept() {
  return defHttp.request({
    url: Api.findByDept,
    method: 'GET',timeout: 100000000000,
  });
}
export function findByCus() {
  return defHttp.request({
    url: Api.findByCus,
    method: 'GET',timeout: 100000000000,
  });
}
export function findBySup() {
  return defHttp.request({
    url: Api.findBySup,
    method: 'GET',timeout: 100000000000,
  });
}
export function findByItem() {
  return defHttp.request({
    url: Api.findByItem,
    method: 'GET',timeout: 100000000000,
  });
}
export function saveFuzhuInitalBalance(
  id: any,
  iyear: any,
  ccode: any,
  person: any,
  dept: any,
  cus: any,
  sup: any,
  item: any,
  md: any,
  mc: any
) {
  return defHttp.request({
    url:
      Api.saveFuzhuInitalBalance +
      '?iyear=' +
      iyear +
      '&ccode=' +
      ccode +
      '&person=' +
      person +
      '&dept=' +
      dept +
      '&cus=' +
      cus +
      '&sup=' +
      sup +
      '&item=' +
      item +
      '&md=' +
      md +
      '&mc=' +
      mc,
    method: 'POST',timeout: 100000000000,
  });
}
