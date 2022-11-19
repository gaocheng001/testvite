import {MockMethod} from 'vite-plugin-mock';
import {R} from '../../mock/_util';
import {roleMenus} from '../../rbac/roleData';

export default [
  {
    url: '/api/sys/menu/getMenuIdsByRoleId',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      const a=query.roleId
      return R.ok(roleMenus(),{message:'成功'});
    }
  }

] as MockMethod[];
