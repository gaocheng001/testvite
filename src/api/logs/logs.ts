import { defHttp } from '/@/utils/http/axios';

// 持久层
export function pushLogApi(params: any) {
  return defHttp.request({
    url: '/sys/logs/push',
    method: 'get',
    params,
  });
}

//
export function getLogAll() {
  return defHttp.request({
    url: '/sys/logs/getAll',
    method: 'get',
  });
}
