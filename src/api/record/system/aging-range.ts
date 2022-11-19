import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
export const findAllByModel = defRouteApi(async (params) => {
  return {
    url: '/AccAgingRange',
    method: 'GET',
    params
  };
});
export const saveModel = defRouteApi(async (params) => {
  return {
    url: '/AccAgingRange',
    method: 'POST',
    params
  };
});

export const findAllByAccIdModel = defRouteApi(async (params) => {
  return {
    url: '/AccAgingRange/findAllByAccIdModel',
    method: 'GET',
    params
  }
})
