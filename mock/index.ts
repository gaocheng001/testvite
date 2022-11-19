import { MockMethod } from 'vite-plugin-mock';
import _account from '../mock-api/boozsoft/account';
import pingzheng from '../mock-api/boozsoft/pingzheng';
import zi_chan_fu_zai from '../mock-api/boozsoft/zi_chan_fu_zai';
import yin_hang_dui_zhang_dan from '../mock-api/xian_jin_yin_hang/yin_hang_dui_zhang_dan';
import yin_hang_dui_zhang_mo_ban from '../mock-api/xian_jin_yin_hang/yin_hang_dui_zhang_mo_ban';
import yin_hang_dui_zhang_yu_e from '../mock-api/xian_jin_yin_hang/yin_hang_dui_zhang_yu_e';
import logs from '../mock-api/boozsoft/logs/_logs';
import taskManager from '../mock-api/boozsoft/logs/_taskManager';
import callback from '../mock-api/boozsoft/logs/_callback';
import zhang_tao_zhang_hu from '../mock-api/xian_jin_yin_hang/zhang_tao_zhang_hu';
import system from '../mock-api/boozsoft/system';
//
// console.log();
// const _fastglob = require('fast-glob');
// (async function(){
//   const list=await _fastglob(['mock/**/*.ts'])
//   for (let  i in list){
//     const b="./"+list[i]
//     const a=await require(list[i]);
//
//   }
// })()
const apis = [];

const frontEnd = [
  ...pingzheng,
  ..._account,
  ...yin_hang_dui_zhang_dan,
  ...yin_hang_dui_zhang_mo_ban,
  ...yin_hang_dui_zhang_yu_e,
  ...logs,
  ...taskManager,
  ...callback,
  ...zhang_tao_zhang_hu,
  ...system,
];

if (process.env.VITE_RUN_BACKEND != 'true') {
  const backEnd = [...zi_chan_fu_zai];

  apis.push(...backEnd);
}
// if (process.env.VITE_RUN_BACKEND!="true") {
// const backEnd = [222
//   ..._pingzheng,
//   ..._account,
//   ..._zi_chan_fu_zai,
//   ...yin_hang_dui_zhang_dan,
//   ...yin_hang_dui_zhang_mo_ban,
//   ...yin_hang_dui_zhang_yu_e
// ];
apis.push(...frontEnd);
// }

export default apis as MockMethod[];
