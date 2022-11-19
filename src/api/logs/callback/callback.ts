import { defHttp } from '/@/utils/http/axios';

// 持久层
export function pushCallBackApi(params: any) {
  return defHttp.request({
    url: '/sys/callback/push',
    method: 'get',
    params,
  });
}

//
export function getCallbackAll() {
  return defHttp.request({
    url: '/sys/callback/getAll',
    method: 'get',
  });
}
