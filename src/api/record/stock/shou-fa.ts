import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */

export const getDeptList = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/findAll',
    method: 'GET',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getDeptListById = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/findAll',
    method: 'GET',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findAll2 = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/findAll2',
    method: 'GET',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/shouFaType/save',
    method: 'POST',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDept = defRouteApi( async (params)=>{
  return  {
    url: '/sys/shouFaType/del',
    method: 'DELETE',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag = defRouteApi( async (params)=>{
  return  {
    url: '/sys/shouFaType/editFlag',
    method: 'POST',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const GetDeptTree = defRouteApi( async (params)=>{
  return  {
    url: '/sys/shouFaType/treeDept',
    method: 'GET',timeout: 10000000,
    params
  }
})

export const GetDeptTreeByFlag = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/treeDeptByFlag',
    method: 'GET',timeout: 10000000,
  }
})

export const excelVoucherType = defRouteApi( async (params:any)=>{
  return  {
    url: '/sys/shouFaType/excel',
    method: 'POST',timeout: 10000000,
    params
  }
})

export const getMaxCode = defRouteApi( async (code)=>{
  return  {
    url: '/sys/shouFaType/getMaxCode?id='+code,
    method: 'GET',timeout: 10000000,
  }
})
export const getMaxCode2 = defRouteApi( async (code)=>{
  return  {
    url: '/sys/shouFaType/getMaxCode2?id='+code,
    method: 'GET',timeout: 10000000,
  }
})

export const getCutModeAllList= defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/allMinus',
    method: 'GET',timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByShouAndFa = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/findByShouAndFa',
    method: 'POST',timeout: 10000000,
  }
})
export const saveShouAndFa = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/saveShouAndFa',
    method: 'POST',timeout: 10000000,
  }
})
export const initShouAndFa = defRouteApi( async ()=>{
  return  {
    url: '/sys/shouFaType/initShouAndFa',
    method: 'GET',
    timeout: 10000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByLikeEcName = defRouteApi( async (ecName)=>{
  return  {
    url: '/sys/shouFaType/findByLikeEcName?ecName='+ecName,
    method: 'POST',timeout: 10000000,
  }
})
