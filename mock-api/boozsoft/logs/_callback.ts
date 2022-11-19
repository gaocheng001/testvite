import { MockMethod } from 'vite-plugin-mock';
import { ok } from '../../../mock/_utils/r';

const list = [];

// admin页 end
export default [
  /**
   * 回滚表
   */
  {
    url: '/api/sys/callback/push',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      const { type, action, page, date, opeartor, msg } = query;
      list.push({ type, action, page, date, opeartor, msg });
      return ok('ok');
    },
  },
  /**
   * 回滚表
   */
  {
    url: '/api/sys/callback/getAll',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      return list;
    },
  },
  /**
   * 回滚表
   */
  {
    url: '/api/sys/callback/delAll',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      list.splice(0, list.length);
      return ok('ok');
    },
  },
] as MockMethod[];
