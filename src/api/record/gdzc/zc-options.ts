import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
import {defHttp} from "/@/utils/http/axios";

export const findByAccId = defRouteApi(async ({uniqueCode}) => {
  return {
    url: '/group/faAccount/findByAccId?uniqueCode='+uniqueCode,
    timeout: 100000000000,
    method: 'GET'
  };
});
export const saveAccount = defRouteApi(async (params) => {
  return {
    url: '/group/faAccount/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export function findFaAccountByAccId(accId:any) {
  return defHttp.request({
    url: '/group/faAccount/findFaAccountByAccId?accId='+accId,
    method: 'GET',
  })
}


