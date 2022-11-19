import { defHttp } from '/@/utils/http/axios';

// 持久层
export function pushTaskManagerApi(params: any) {
  return defHttp.request({
    url: '/sys/taskManager/push',
    method: 'get',
    params,
  });
}

//
export function getTaskManagerAll() {
  return defHttp.request({
    url: '/sys/taskManager/getAll',
    method: 'get',
  });
}
