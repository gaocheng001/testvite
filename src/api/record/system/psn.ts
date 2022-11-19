import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getPsnListById = defRouteApi(()=>{
  return {
    url: '/sys/psn/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getPsnList = defRouteApi(()=>{
  return {
    url: '/sys/psn/getAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findPsnByFlag = defRouteApi(()=>{
  return {
    url: '/sys/psn/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const savePsn = defRouteApi((params)=>{
  return {
    url: '/sys/psn',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deletePsn = defRouteApi((params)=>{
  return {
    url: '/sys/psn',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag = defRouteApi((params)=>{
  return {
    url: '/sys/psn/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi((code:any)=>{
  return {
    url: '/sys/psn/findByCode?code='+code,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelPsn = defRouteApi((params:any)=> {
  return {
    url: '/sys/psn/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findPsnDelList = defRouteApi(()=>{
  return {
    url: '/sys/psn/findDelList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findAllByCpersonId = defRouteApi((cpersonId)=>{
  return {
    url: '/sys/psn/findAllByCpersonId?cpersonId='+cpersonId,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBukongPsnCode = defRouteApi(({num, sum,qzNum,qianzhui})=> {
  return {
    url: '/sys/psn/findBukongPsnCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})

export const findMaxPsnCode = defRouteApi(({num, sum,qzNum,qianzhui})=> {
  return {
    url: '/sys/psn/findMaxPsnCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})
