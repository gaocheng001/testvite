import { useCompanyOperateStoreWidthOut } from '/@/store/modules/operate-company';

export function hasDebuggerInfoEnable(){
  return window.debuggerInfo.enable
}
export function createWindowDebuggerInfo() {

  window.debuggerInfo = {
    enable: true,
    pingzheng: {
      rowDebuggerInfo: [],
      getRowInfo(index) {
        const a = this.rowDebuggerInfo.filter((it) => it.rowIndex == index)[0];

        console.log(a);
        return a;
      },
      getApiInfo(index) {
        const apiData=window.debuggerInfo.pingzheng.pingzhengModel.pingzhengData.value.toRowModelVerfiyData(this.getRowInfo(index).pingzhengGridParams.columnDefine)
        return apiData
      },
    },
  };
}

export function getRowInfo(rowIndex) {
  const rowInfo = window.debuggerInfo.pingzheng.rowDebuggerInfo.filter(
    (it) => it.rowIndex == rowIndex,
  );
  if (rowInfo.length == 0) {
    window.debuggerInfo.pingzheng.rowDebuggerInfo.push({
      rowIndex,
    });
  }
  return window.debuggerInfo.pingzheng.rowDebuggerInfo.filter((it) => it.rowIndex == rowIndex)[0];
}

export function addInfo(rowIndex, info) {
  const rowInfo = getRowInfo(rowIndex);

  Object.assign(rowInfo, info);
}
