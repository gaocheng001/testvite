import { pushLogApi } from '/@/api/logs/logs';

export function pushLog(msg, params?:string) {
  if (params == null) {
    pushLogApi({
      type: '默认',
      action: '默认',
      page: '默认',
      date: new Date().toString(),
      opeartor: '默认',
      msg,
    });
    return;
  }
  const { type, action, page, opeartor } = params;
  pushLogApi({
    type,
    action,
    page,
    date: new Date().toString(),
    opeartor,
    msg,
  });
}
