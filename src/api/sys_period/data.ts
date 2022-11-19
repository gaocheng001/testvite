import {defHttp} from "/@/utils/http/axios";

export async function findPeriodInfo(accId) {
  return defHttp.request({
    url: '/iperiod/findPeriodInfo?accId='+accId,
    method: 'GET',
  });
}

export async function findPeriodByYaer(accId,year) {
  return defHttp.request({
    url: '/iperiod/findPeriodByYaer?accId='+accId+'&year='+year,
    method: 'GET',
  });
}
export async function countAllByAccountIdAndIyear(accId,iyear) {
  return defHttp.request({
    url: '/iperiod/countAllByAccountIdAndIyear?accId='+accId+'&iyear='+iyear,
    method: 'POST',
  });
}


