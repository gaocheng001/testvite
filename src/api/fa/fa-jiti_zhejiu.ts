import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

export function findPeriodByUniqueCode ({code,year}) {
  return defHttp.request({
    url: '/faJitiZhejiu/findPeriodByUniqueCode?code='+code+'&year='+year,
    method: 'GET',
  })
}

export const findByIyearAndImonth = defRouteApi(({code,year,month}) => {
  return {
    url: '/faJitiZhejiu/findByIyearAndImonth?code='+code+'&year='+year+'&month='+month,
    method: 'GET',
  }
})

export const findByManageCodeAndIyearAndImonth = defRouteApi(({code,year,month}) => {
  return {
    url: '/faJitiZhejiu/findByManageCodeAndIyearAndImonth?code='+code+'&year='+year+'&month='+month,
    method: 'GET',
  }
})

export const findDeptByManageCodeAndIyearAndImonth = defRouteApi(({code,year,month}) => {
  return {
    url: '/faJitiZhejiu/findDeptByManageCodeAndIyearAndImonth?code='+code+'&year='+year+'&month='+month,
    method: 'GET',
  }
})

export const findProjectByManageCodeAndIyearAndImonth = defRouteApi(({code,year,month}) => {
  return {
    url: '/faJitiZhejiu/findProjectByManageCodeAndIyearAndImonth?code='+code+'&year='+year+'&month='+month,
    method: 'GET',
  }
})

export const saveFaDepreciation = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciation',
    method: 'POST',
    params
  }
})

export const saveFaDepreciationList = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciationList',
    method: 'POST',
    params
  }
})

export const deleteByManageCodeAndIyearAndImonth = defRouteApi(({code,year,month}) => {
  return {
    url: '/faJitiZhejiu/deleteByManageCodeAndIyearAndImonth?code='+code+'&year='+year+'&month='+month,
    method: 'DELETE',
  }
})

export function saveFaPeriod(params) {
  return defHttp.request({
    url: '/faJitiZhejiu/saveFaPeriod',
    method: 'POST',
    params
  })
}

export const saveFaDepreciationDept = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciationDept',
    method: 'POST',
    params
  }
})

export const saveFaDepreciationDeptList = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciationDeptList',
    method: 'POST',
    params
  }
})

export const saveFaDepreciationProject = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciationProject',
    method: 'POST',
    params
  }
})

export const saveFaDepreciationProjectList = defRouteApi((params) => {
  return {
    url: '/faJitiZhejiu/saveFaDepreciationProjectList',
    method: 'POST',
    params
  }
})
