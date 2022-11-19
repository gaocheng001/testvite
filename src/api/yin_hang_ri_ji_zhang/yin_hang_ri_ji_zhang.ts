import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAccountByBank = defRouteApi((params) => {
  return {
    url: '/dayAccount/findByBankAccount',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByBankAndQc = defRouteApi(({iyperiod, ccode}) => {
  return {
    url: '/dayAccount/findByBankAccountAndQc?iyperiod=' + iyperiod + '&ccode=' + ccode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
