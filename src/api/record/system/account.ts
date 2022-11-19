import { defHttp } from '/@/utils/http/axios';
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getAccountList() {
  return defHttp.request({
    url: '/sys/account/findNew/available',
    timeout: 100000000000,
    method: 'GET',
  });
}

export function getAssetsAccountList({userId}) {
  return defHttp.request({
    url: '/sys/account/assets/authorAccountList?userId='+userId,
    timeout: 100000000000,
    method: 'GET',
  });
}
export function getStockAccountList({userId}) {
  return defHttp.request({
    url: '/group/stockAccount/authorAccountList?userId='+userId,
    timeout: 100000000000,
    method: 'GET',
  });
}
export function getAllAuthorAccountList({userId}) {
  return defHttp.request({
    url: '/sys/account/allAuthorAccountList?userId='+userId,
    timeout: 100000000000,
    method: 'GET',
  });
}

export function countByAccountMode(accountMode:any) {
  return defHttp.request({
    url: '/sys/account/countByAccountMode?accountMode='+accountMode,
    timeout: 100000000000,
    method: 'POST',
  });
}
export function saveAccount(params: any) {
  return defHttp.request({
    url: '/sys/account',
    timeout: 100000000000,
    method: 'POST',
    params,
  });
}

export function deleteAccount(params: any) {
  return defHttp.request({
    url: '/sys/account',timeout: 100000000000,
    method: 'DELETE',
    params,
  });
}

export function findByUserAccount(userId: any) {
  return defHttp.request({
    url: '/sys/account/findByUserAccount?userId=' + userId,timeout: 100000000000,
    method: 'GET',
  });
}

export function saveUserAccount(params: any) {
  return defHttp.request({
    url:
      '/sys/account/saveUserAccount?userId=' + params.userId + '&accountList=' + params.accountList,timeout: 100000000000,
    method: 'POST',
  });
}
export function findByAccId(accontId: any) {
  return defHttp.request({
    url: '/sys/account/findByAccId?accontId=' + accontId,timeout: 100000000000,
    method: 'POST',
  });
}

export function findDataBase(accId:any,year:any) {
  return defHttp.request({
    url: '/sys/account/findDataBase?accId=' + accId+'&year='+year,timeout: 100000000000,
    method: 'GET',
  });
}

export function findAllByAccGroup(orgUnique:any) {
  return defHttp.request({
    url: '/sys/account/findAllByAccGroup?orgUnique=' + orgUnique,timeout: 100000000000,
    method: 'POST',
  });
}

export function findDataBase1(accId:any,year:any) {
  return defHttp.request({
    url: '/sys/account/findDataBase1?accId=' + accId+'&year='+year,timeout: 100000000000,
    method: 'GET',
  });
}

export function findDataBase2(accId:any,year:any) {
  return defHttp.request({
    url: '/sys/account/findDataBase2?accId=' + accId+'&year='+year,timeout: 100000000000,
    method: 'GET',
  });
}

export function findByAllSysAccPeriodGroupDataBase() {
  return defHttp.request({
    url: '/sys/account/findByAllSysAccPeriodGroupDataBase',timeout: 100000000000,
    method: 'GET',
  });
}
export function findByAccIdIyearGroupBy(accId) {
  return defHttp.request({
    url: '/sys/account/findByAccIdIyearGroupBy?accId='+accId,timeout: 100000000000,
    method: 'POST',
  });
}

export const company_findByAccTypeAuth = defRouteApi(async ({userId,iyear}) => {
  return {
    url: '/sys/account/company_findByAccTypeAuth?userId='+userId+'&iyear='+iyear,timeout: 100000000000,
    method: 'POST'
  };
});

export function findByAccIdAccStyleList(accId) {
  return defHttp.request({
    url: '/sys/account/findByAccIdAccStyleList?accId='+accId,timeout: 100000000000,
    method: 'POST',
  });
}

export function findByAccIdSunYiAndQuanYi(accId) {
  return defHttp.request({
    url: '/sys/account/findByAccIdSunYiAndQuanYi?accId='+accId,timeout: 100000000000,
    method: 'POST',
  });
}
export function findAllByAccCountPartColumn(accId) {
  return defHttp.request({
    url: '/sys/account/findAllByAccCountPartColumn?accId='+accId,timeout: 100000000000,
    method: 'POST',
  });
}
export function countAllByAccStandard(templateId) {
  return defHttp.request({
    url: '/sys/account/countAllByAccStandard?templateId='+templateId,timeout: 100000000000,
    method: 'POST',
  });
}
export function findPeriodIyearByUniqueCode(id) {
  return defHttp.request({
    url: '/group/stockAccount/period/findIyearByUniqueCode?id='+id,timeout: 100000000000,
    method: 'POST',
  });
}
