import { defHttp } from '/@/utils/http/axios';

enum Api {
  findByQueryPlan = '/group-query-plan/findByAccIdAndMenuName',
  saveQueryPlan = '/group-query-plan/saveQueryPlan',
}

export function findByQueryPlan(accId,menuName) {
  return defHttp.request({
    url: Api.findByQueryPlan+'?accId='+accId+'&menuName='+menuName,
    method: 'POST',
  });
}
export function saveQueryPlan(params) {
  return defHttp.request({
    url: Api.saveQueryPlan,
    method: 'POST',
    params
  });
}

