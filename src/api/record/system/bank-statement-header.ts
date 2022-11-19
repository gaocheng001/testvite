import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getBankStatementHeaderList=defRouteApi(()=> {
  return {
    url: '/bankStatementHeader/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getBankStatementHeaderById=defRouteApi((id:any)=> {
  return {
    url: '/bankStatementHeader/findById?id='+id,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveBankStatementHeader=defRouteApi((params:any)=> {
  return {
    url: '/bankStatementHeader',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteBankStatementHeader=defRouteApi((params:any)=> {
  return {
    url: '/bankStatementHeader/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByYearAndKemu=defRouteApi(({year,kemuCode}:any)=> {
  return {
    url: '/bankStatementHeader/findByYearAndKemu?year='+year+'&kemuCode='+kemuCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
