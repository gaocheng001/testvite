import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findFaStyleHeadAll = defRouteApi((params) => {
  return {
    url: '/faStyle/findFaStyleHeadAll',
    method: 'GET',
    params
  }
})

export const saveFaStyleHead = defRouteApi((params) => {
  return {
    url: '/faStyle/saveFaStyleHead',
    method: 'POST',
    params
  }
})

export const saveFaStyle = defRouteApi((params) => {
  return {
    url: '/faStyle/saveFaStyle',
    method: 'POST',
    params
  }
})

export const saveFaStyleList = defRouteApi((params) => {
  return {
    url: '/faStyle/saveFaStyleList',
    method: 'POST',
    params
  }
})
