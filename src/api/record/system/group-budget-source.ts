import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */

export const findSettModesAll = defRouteApi((params)=> {
  return {
    url: '/sys/budgetSource/findAll',
    method: 'GET',
  }
})

export const findSettModesByFlag = defRouteApi(()=> {
  return {
    url: '/sys/budgetSource/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/budgetSource',
    method: 'POST',
    params
  }
})

export const deleteSettModes = defRouteApi((params)=> {
  return {
    url: '/sys/budgetSource',
    method: 'DELETE',
    params
  }
})

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/budgetSource/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByBsName = defRouteApi((settModesCode:any)=> {
  return {
    url: '/sys/budgetSource/findByBsName?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const getTotalData =  defRouteApi(()=>{
  return {
    url: '/sys/budgetSource/getTotalData',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})


export const findDelAll = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/findDelAll',
    method: 'POST',
    params
  }
})

export const deleteList = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/deleteList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const reductionList = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/reductionList',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const introduceData = defRouteApi((params:any)=> {
  return {
    url: '/sys/budgetSource/introduceData',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const findSettModesInAll = defRouteApi((params)=> {
  return {
    url: '/sys/budgetSource/findSettModesInAll',
    method: 'GET',
  }
})
