import { pushLogApi } from '/@/api/logs/logs';
import {pushTaskManagerApi} from "/@/api/logs/taskManager/taskManager";

export function pushTaskManager(msg, params) {
  if (params == null) {
    pushTaskManagerApi({
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
  pushTaskManagerApi({
    type,
    action,
    page,
    date: new Date().toString(),
    opeartor,
    msg,
  });
}
