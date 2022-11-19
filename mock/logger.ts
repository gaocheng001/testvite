import {itemsToTreeData} from '../src/utils/treeUtil';
import {MockMethod} from 'vite-plugin-mock';
import {
  getRequestToken, R,
  requestParams,
  resultError,
  resultPageSuccess,
  resultSuccess
} from './_util';
import {
  createState,
  tokenState,
  useUser
} from '../mock-api/_datatable/tokenResource_data/tokenResource_data';
import {mockUsers} from '../mock-api/_datatable/user_data/userData';





export default [
  // // mock user login
  // {
  //   url: '/api/SysLogger/findAll',
  //   timeout: 200,
  //   method: 'get',
  //   response: ({body}) => {
  //     return R.ok([{}])
  //   }
  // },

] as MockMethod[];
