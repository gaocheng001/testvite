import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAccountByYuetiaojie = defRouteApi(({endDate})=> {
  return {
    url: '/yueTiaojie/findAccountByYuetiaojie?endDate='+endDate,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBankStatementByYuetiaojie = defRouteApi(({ccode,endDate})=> {
  return {
    url: '/yueTiaojie/findBankStatementByYuetiaojie?ccode='+ccode+'&endDate='+endDate,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
