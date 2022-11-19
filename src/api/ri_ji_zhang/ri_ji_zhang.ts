import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAccountByBank = defRouteApi((params) => {
  return {
    url: '/dayAccount/findByDayBookAccount',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByBankAndQc = defRouteApi(({iyperiod, ccode}) => {
  return {
    url: '/dayAccount/findByDayBookAccountAndQc?iyperiod=' + iyperiod + '&ccode=' + ccode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findCodeByDayBook = defRouteApi(() => {
  return {
    url: '/dayAccount/findCodeByDayBook',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
