import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
export const findAcceptBillAll = defRouteApi(()=> {
  return {
    url: '/acceptBill/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findAcceptBillByQichu = defRouteApi(()=> {
  return {
    url: '/acceptBill/findByQichu',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findAcceptBillByBillCode = defRouteApi((billCode:any)=> {
  return {
    url: '/acceptBill/findByBillCode?billCode='+billCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveAcceptBill = defRouteApi((params:any)=> {
  return {
    url: '/acceptBill',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteAcceptBill = defRouteApi((id:any)=> {
  return {
    url: '/acceptBill?id='+id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByDaoqiDate = defRouteApi(()=> {
  return {
    url: '/acceptBill/findByDaoqiDate',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
