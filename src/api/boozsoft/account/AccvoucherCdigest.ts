import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAll = `/AccvoucherCdigest/findAll`,
  findById = `/AccvoucherCdigest/findById`,
  save = `/AccvoucherCdigest/save`,
  deleteById = `/AccvoucherCdigest/deleteById`,
  saveList = `/AccvoucherCdigest/saveList`,
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
    url: '/AccvoucherCdigest/findMaxCcode',
    method: 'GET'
  }
})

export const findBukongCcode = defRouteApi(() => {
  return {
    url: '/AccvoucherCdigest/findBukongCcode',
    method: 'GET'
  }
})
