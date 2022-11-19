import { pushLogApi } from '/@/api/logs/logs';
import {pushCallBackApi} from "/@/api/logs/callback/callback";

export function pushCallbackManager(msg, params) {
  if (params == null) {
    pushCallBackApi({
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
  pushCallBackApi({
    type,
    action,
    page,
    date: new Date().toString(),
    opeartor,
    msg,
  });
}
