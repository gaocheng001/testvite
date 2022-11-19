import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../../mock/_util';

const deptData = [
  {
    id: 1,
    deptName: '财务部门55555',
    deptNum: '001',
    deptOrder: '一级部门',
    deptType: '财务'
  },
  {
    id: 1555,
    deptName: '财务部门66666665',
    deptNum: '001',
    deptOrder: '一级部门',
    deptType: '财务'
  }

]
export default [
  {
    url: '/api/record/getDeptAll',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(deptData);
    },
  },
] as MockMethod[];
