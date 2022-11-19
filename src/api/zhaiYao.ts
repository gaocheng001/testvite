import { defHttp } from '/@/utils/http/axios';
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  addOneZhaiYao="/zhaiyao/addOne",
  updateOneZhaiYao="/zhaiyao/updateOne",
  delOneZhaiYao="/zhaiyao/delOne",
}

export const addOneZhaiYao = defRouteApi( async (params) => {
    return {
      url:
      Api.addOneZhaiYao ,
      method: 'POST',
      params
    };
  });
export const updateOneZhaiYao = defRouteApi( async (params) => {
    return {
      url:
      Api.updateOneZhaiYao ,
      method: 'POST',
      params
    };
  }
);export const delOneZhaiYao = defRouteApi( async (params) => {
    return {
      url:
      Api.delOneZhaiYao ,
      method: 'POST',
      params
    };
  }
);
