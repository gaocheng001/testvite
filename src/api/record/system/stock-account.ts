// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export function findByStockAccountId(id) {
  return defHttp.request({
    url: '/group/stockAccount/findByStockAccountId?id=' + id,timeout: 100000000000,
    method: 'POST',
  });
}
export function findByStockAccountAccId(accId) {
  return defHttp.request({
    url: '/group/stockAccount/findByStockAccountAccId?accId=' + accId,timeout: 100000000000,
    method: 'POST',
  });
}

export function findByStockAccId(accId) {
  return defHttp.request({
    url: '/group/stockAccount/findByStockAccId?accId='+accId,
    timeout: 100000000000,
    method: 'GET',
  });
}

export function saveStocckAccount(params) {
  return defHttp.request({
    url: '/group/stockAccount/saveStocckAccount',
    timeout: 100000000000,
    method: 'POST',
    params
  });
}
