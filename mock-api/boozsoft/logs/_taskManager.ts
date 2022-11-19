import { MockMethod } from 'vite-plugin-mock';
import { ok } from '../../../mock/_utils/r';

const list = [];

// admin页 end
export default [
  /**
   * 上传任務管理
   */
  {
    url: '/api/sys/taskManager/push',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      const { type, action, page, date, opeartor, msg } = query;
      list.push({ type, action, page, date, opeartor, msg });
      return ok('ok');
    },
  },
  /**
   * 获取日志
   */
  {
    url: '/api/sys/taskManager/getAll',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      return list;
    },
  },
  /**
   * 获取日志
   */
  {
    url: '/api/sys/taskManager/delAll',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      list.splice(0, list.length);
      return ok('ok');
    },
  },
] as MockMethod[];
