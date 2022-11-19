import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAll = `/AccvoucherSetting/findAll`,
  findById = `/AccvoucherSetting/findById`,
  save = `/AccvoucherSetting/save`,
  deleteById = `/AccvoucherSetting/deleteById`,
  saveList = `/AccvoucherSetting/saveList`,
}

export const findAllApi = defRouteApi((params) => {
  return {
    url: Api.findAll,
    method: 'GET',
    params
  }
})

export const findByIdApi = defRouteApi((params) => {
  return {
    url: Api.findById,
    method: 'GET',
    params
  }
})

export const saveApi = defRouteApi((params) => {
  return {
    url: Api.save,
    method: 'POST',
    params
  }
})

export const deleteByIdApi = defRouteApi((params) => {
  return {
    url: Api.deleteById,
    method: 'DELETE',
    params
  }
})

export const saveListApi = defRouteApi((params) => {
  return {
    url: Api.saveList,
    method: 'POST',
    params
  }
})

export const findMaxCcode = defRouteApi(() => {
  return {
    url: '/AccvoucherSetting/findMaxCcode',
    method: 'GET'
  }
})

export const findBukongCcode = defRouteApi(() => {
  return {
    url: '/AccvoucherSetting/findBukongCcode',
    method: 'GET'
  }
})

export const findAllByParentIdOrderByNum = defRouteApi((id) => {
  return {
    url: '/AccvoucherSetting/findAllByParentIdOrderByNum?id='+id,
    method: 'GET'
  }
})

export const deleteByParentId = defRouteApi((id) => {
  return {
    url: '/AccvoucherSetting/deleteByParentId?id='+id,
    method: 'DELETE',
  }
})

export const deleteEntryById = defRouteApi((id) => {
  return {
    url: '/AccvoucherSetting/deleteEntryById?id='+id,
    method: 'DELETE',
  }
})
