import { defHttp } from '/@/utils/http/axios'

export  function findAllKeMuCode(params:any) { // 获取所以
  params.pageSize = 1000
  return defHttp.request({
    url: '/carryForward/period',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export  function findAllIncomeKeMuCode() {
  return  defHttp.request({
    url: '/carryForward/period/incomeList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}
