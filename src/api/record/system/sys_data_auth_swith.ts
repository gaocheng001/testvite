import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findByAccIdAndIyear = defRouteApi(async ({accId,iyear}) => {
  return {
    url: '/sys/dataAuthSwith/findByAccIdAndIyear?accId='+accId+'&iyear='+iyear,
    timeout: 100000000000,
    method: 'POST'
  };
});
export const sysDataAuthSwithSave = defRouteApi(async (params) => {
  return {
    url: '/sys/dataAuthSwith/save',
    timeout: 100000000000,
    method: 'POST',params
  };
});

export const delById = defRouteApi(async ({id}) => {
  return {
    url: '/sys/dataAuthSwith/delById?id='+id,
    timeout: 100000000000,
    method: 'POST'
  };
});
