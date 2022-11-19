// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAllByCcodeSourrce = defRouteApi(async (ccode) => {
  return {
    url: '/stockXySource/findAllByCcode?ccode='+ccode,
    timeout: 100000000000,
    method: 'POST',
  };
});

export const findByXyDataSourrce = defRouteApi(async (billStyle) => {
  return {
    url: '/stockXySource/findByXyDataSourrce?billStyle='+billStyle,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const findByXyDataSourrceMap = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByXyDataSourrceMap',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByXyDataSourrceSearch = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByXyDataSourrceSearch',
    timeout: 100000000000,
    method: 'POST',params
  };
});

export const findBySyDataSourrce = defRouteApi(async (xyBillStyle) => {
  return {
    url: '/stockXySource/findBySyDataSourrce?xyBillStyle='+xyBillStyle,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const findBySyDataSourrceMap = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findBySyDataSourrceMap',
    timeout: 100000000000,
    method: 'POST',params
  };
});


export const findByXyOutDataSourrce = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByXyOutDataSourrce',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByLyOutDataSourrce = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByLyOutDataSourrce',
    timeout: 100000000000,
    method: 'POST',params
  };
});

/**
 * 检验上游子表行唯一码是否存在下游
 */
export const verifySyLineCodeExistXyData = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/verifySyLineCodeExistXyData',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByXyDataMainSourrceMap = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByXyDataMainSourrceMap',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findBySyDataMainSourrceMap = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findBySyDataMainSourrceMap',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByIyearAndCcodeAndXyBillStyle = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByIyearAndCcodeAndXyBillStyle',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByStockWareSMax = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByStockWareSMax',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findByXySyCcode = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findByXySyCcode',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findAllByBillStyleAndIyearAndCcode = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findAllByBillStyleAndIyearAndCcode',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findQTRKD_OnlyByXyData = defRouteApi(async (params) => {
  return {
    url: '/stockXySource/findQTRKD_OnlyByXyData',
    timeout: 100000000000,
    method: 'POST',params
  };
});
