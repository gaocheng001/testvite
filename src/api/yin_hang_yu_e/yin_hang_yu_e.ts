import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAccountByBankYue = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByBankYue',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByBankYueQichu = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByBankYueQichu',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByBankYueLeiji = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByBankYueLeiji',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByCashYue = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByCashYue',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByCashYueQichu = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByCashYueQichu',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByCashYueLeiji = defRouteApi((params)=> {
  return {
    url: '/bankYue/findAccountByCashYueLeiji',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
