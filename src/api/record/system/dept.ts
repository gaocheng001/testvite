import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getDeptList =  defRouteApi(()=>{
  return {
    url: '/sys/department/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const getDeptListById =  defRouteApi(()=>{
  return {
    url: '/sys/department/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const saveDept =  defRouteApi((params)=>{
  return {
    url: '/sys/department',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})


export const deleteDept =  defRouteApi((params)=> {
  return  {
    url: '/sys/department',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag =  defRouteApi((params)=> {
  return  {
    url: '/sys/department/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelDept = defRouteApi((params:any)=> {
  return {
    url: '/sys/department/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findDeptByFlag =  defRouteApi(()=>{
  return {
    url: '/sys/department/findDeptByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findDeptDelList =  defRouteApi(()=>{
  return {
    url: '/sys/department/findDelList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editByIsDel =  defRouteApi((params:any)=>{
  return {
    url: '/sys/department/editByIsDel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
