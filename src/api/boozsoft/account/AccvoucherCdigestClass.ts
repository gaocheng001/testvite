import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAll = `/AccvoucherCdigestClass/findAll`,
  findById = `/AccvoucherCdigestClass/findById`,
  save = `/AccvoucherCdigestClass/save`,
  deleteById = `/AccvoucherCdigestClass/deleteById`
}

export const findAllApi = defRouteApi(() => {
  return {
    url: Api.findAll,
    method: 'GET'
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

export const findMaxClassCode = defRouteApi(() => {
  return {
    url: '/AccvoucherCdigestClass/findMaxClassCode',
    method: 'GET'
  }
})

export const findBukongClassCode = defRouteApi(() => {
  return {
    url: '/AccvoucherCdigestClass/findBukongClassCode',
    method: 'GET'
  }
})
