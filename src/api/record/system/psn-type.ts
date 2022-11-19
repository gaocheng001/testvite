import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getPsnTypeListById = defRouteApi(()=> {
  return {
    url: '/sys/psnType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const psnTypeFindAll = defRouteApi(()=> {
  return {
    url: '/sys/psnType/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const savePsnType = defRouteApi((params:any)=> {
  return {
    url: '/sys/psnType',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deletePsnType = defRouteApi((params: any) => {
  return {
    url: '/sys/psnType',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelPsnType = defRouteApi((params: any) => {
  return {
    url: '/sys/psnType/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByUniqueCode = defRouteApi((uniqueCode) => {
  return {
    url: '/sys/psnType/findByUniqueCode?uniqueCode=' + uniqueCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const acceptSave = defRouteApi((params: any) => {
  return {
    url: '/sys/psnType/acceptSave',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
