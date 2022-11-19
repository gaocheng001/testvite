import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findCardList = defRouteApi((params) => {
  return {
    url: '/faCard/findCardList',
    method: 'GET',
    params
  }
})

export const findCardMasterAll = defRouteApi((params) => {
  return {
    url: '/faCard/findCardMasterAll',
    method: 'GET',
    params
  }
})
export const findCardMasterEffectiveAll = defRouteApi((params) => {
  return {
    url: '/faCard/findCardMasterEffectiveAll',
    method: 'GET',
  }
})


export const findCardMasterByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/findCardMasterByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findCardMasterByIymonth = defRouteApi(({iymonth}) => {
  return {
    url: '/faCard/findCardMasterByIymonth?iymonth='+iymonth,
    method: 'GET'
  }
})

export const findChangeByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/findChangeByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findChangeDeptByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/findChangeDeptByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findChangeProjectByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/findChangeProjectByCardUnique?cardUnique='+cardUnique,
    method: 'GET'
  }
})

export const findMaxSysId = defRouteApi(() => {
  return {
    url: '/faCard/findMaxSysId',
    method: 'GET'
  }
})

export const findBySysId = defRouteApi((sysId) => {
  return {
    url: '/faCard/findBySysId?sysId='+sysId,
    method: 'GET'
  }
})

export const findByCardCode = defRouteApi((cardCode) => {
  return {
    url: '/faCard/findByCardCode?cardCode='+cardCode,
    method: 'GET'
  }
})

export const saveFaCardMaster = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaCardMaster',
    method: 'POST',
    params
  }
})

export const saveFaChange = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaChange',
    method: 'POST',
    params
  }
})

export const saveFaChangeDept = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaChangeDept',
    method: 'POST',
    params
  }
})

export const saveFaChangeDeptList = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaChangeDeptList',
    method: 'POST',
    params
  }
})

export const saveFaChangeProject = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaChangeProject',
    method: 'POST',
    params
  }
})

export const saveFaChangeProjectList = defRouteApi((params) => {
  return {
    url: '/faCard/saveFaChangeProjectList',
    method: 'POST',
    params
  }
})

export const findFaAssetTypeByFlagAndBend = defRouteApi((params) => {
  return {
    url: '/faCard/findFaAssetTypeByFlagAndBend',
    method: 'GET',
    params
  }
})

export const findFaAddCutModeByFlagAndBend = defRouteApi((params) => {
  return {
    url: '/faCard/findFaAddCutModeByFlagAndBend',
    method: 'GET',
    params
  }
})

export const findFaPropertyByFlag = defRouteApi((params) => {
  return {
    url: '/faCard/findFaPropertyByFlag',
    method: 'GET',
    params
  }
})

export const findUnitOfMeaByFlag = defRouteApi((params) => {
  return {
    url: '/faCard/findUnitOfMeaByFlag',
    method: 'GET',
    params
  }
})

export const findFaUsageStatusByFlagAndBend = defRouteApi((params) => {
  return {
    url: '/faCard/findFaUsageStatusByFlagAndBend',
    method: 'GET',
    params
  }
})

export const findZhejiuMethodByFlag = defRouteApi((params) => {
  return {
    url: '/faCard/findZhejiuMethodByFlag',
    method: 'GET',
    params
  }
})

export const findLocationByFlagAndBend = defRouteApi((params) => {
  return {
    url: '/faCard/findLocationByFlagAndBend',
    method: 'GET',
    params
  }
})

export const deleteCardMasterByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/deleteCardMasterByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const deleteChangeByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/deleteChangeByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const deleteChangeDeptByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/deleteChangeDeptByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const deleteChangeProjectByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/deleteChangeProjectByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const deleteDepreciationByCardUnique = defRouteApi((cardUnique) => {
  return {
    url: '/faCard/deleteDepreciationByCardUnique?cardUnique='+cardUnique,
    method: 'DELETE'
  }
})

export const findAllMJList = defRouteApi((params) => {
  return {
    url: '/sys/acckemu/company/findAllMJList',
    method: 'GET',
    params
  }
})

export const findCardMasterByCdateList = defRouteApi((params) => {
  return {
    url: '/faCard/findCardMasterByCdateList',
    method: 'GET',
    params
  }
})
