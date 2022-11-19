// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAllByModel = defRouteApi(async (params) => {
  return {
    url: '/ArApAgingRange',
    method: 'GET',
    params
  };
});
export const saveModel = defRouteApi(async (params) => {
  return {
    url: '/ArApAgingRange',
    method: 'POST',
    params
  };
});

export const findAllByAccIdModel = defRouteApi(async (params) => {
  return {
    url: '/ArApAgingRange/findAllByAccIdModel',
    method: 'GET',
    params
  }
})
