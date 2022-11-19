import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findCardByLessCdateList = defRouteApi((params) => {
  return {
    url: '/faChaifen/findCardByLessCdateList',
    method: 'GET',
    params
  }
})

export const findAllList = defRouteApi((params) => {
  return {
    url: '/faChaifen/findAllList',
    method: 'GET',
    params
  }
})

export const findAllOrderByChaifenCode = defRouteApi((params) => {
  return {
    url: '/faChaifen/findAllOrderByChaifenCode',
    method: 'GET',
    params
  }
})

export const findMaxChaifenCode = defRouteApi((params) => {
  return {
    url: '/faChaifen/findMaxChaifenCode',
    method: 'GET',
    params
  }
})

export const saveFaChaifenHead = defRouteApi((params) => {
  return {
    url: '/faChaifen/saveFaChaifenHead',
    method: 'POST',
    params
  }
})

export const findCardMasterBySourceCardUniqueOrderByCardCode = defRouteApi((params) => {
  return {
    url: '/faChaifen/findCardMasterBySourceCardUniqueOrderByCardCode',
    method: 'GET',
    params
  }
})

export const deleteChaifenByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faChaifen/deleteChaifenByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const deleteChangeByCardUniqueAndIyearAndImonth = defRouteApi((params) => {
  return {
    url: '/faChaifen/deleteChangeByCardUniqueAndIyearAndImonth',
    method: 'DELETE',
    params
  }
})

export const findChaifenByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faChaifen/findChaifenByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findCardByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faChaifen/findCardByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findCardBySourceCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faChaifen/findCardBySourceCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})
