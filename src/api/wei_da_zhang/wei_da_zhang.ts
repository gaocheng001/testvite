import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findByKemuAndDate = defRouteApi(({kemuCode, year, flag, endDate}) => {
  return {
    url: '/weidazhang/findByKemuAndDate?kemuCode='+kemuCode+'&year='+year+'&flag='+flag+'&endDate='+endDate,
    method: 'GET',
  }
})

export const findAccountByKemuAndDate = defRouteApi(({kemuCode, year, flag, endDate}) => {
  return {
    url: '/weidazhang/findAccountByKemuAndDate?kemuCode='+kemuCode+'&year='+year+'&flag='+flag+'&endDate='+endDate,
    method: 'GET',
  }
})

export const findBankStatementByWeidazhang = defRouteApi(({kemuCode, year, flag}) => {
  return {
    url: '/weidazhang/findBankStatementByWeidazhang?kemuCode='+kemuCode+'&year='+year+'&flag='+flag,
    method: 'GET',
  }
})

export const findAccountByWeidazhang = defRouteApi(({kemuCode, year, flag}) => {
  return {
    url: '/weidazhang/findAccountByWeidazhang?kemuCode='+kemuCode+'&year='+year+'&flag='+flag,
    method: 'GET',
  }
})

export const findByKemuNotQichuAndDate = defRouteApi(({kemuCode, year, flag, endDate}) => {
  return {
    url: '/weidazhang/findByKemuNotQichuAndDate?kemuCode='+kemuCode+'&year='+year+'&flag='+flag+'&endDate='+endDate,
    method: 'GET',
  }
})
