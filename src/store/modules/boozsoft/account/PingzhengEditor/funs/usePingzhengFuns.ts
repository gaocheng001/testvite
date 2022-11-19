export function clearGridData(key, obj) {
  if (key == 'daiMoney' || key == 'jieMoney') {
    obj.value = '0.0';
  } else if (key == 'kuaiJiKeMu') {
    obj.value = {
      code: '',
      name: '',
      path: '',
    };
  } else if (key == 'fuZhuHeSuan') {
    obj.value = [];
  } else {
    obj.value = '';
  }
}

export function rowClear(it) {
  it.requireModels = ['zhaiYao', 'kuaiJiKeMu', 'jieMoney', 'daiMoney'];
  Object.keys(it.rowData).forEach((key) => {
    if (it.rowData[key]?.value != null) {
      clearGridData(key, it.rowData[key]);
      Object.keys(it.rowData[key].columnDatas).forEach((it222) => {
        it.rowData[key].columnDatas[it222].text = '';
      });
    }
  });
}

export function supplementRow(pingzhengData, data) {
  const start = pingzhengData.value.rows.length;
  const index = data.rows.length - pingzhengData.value.rows.length;
  for (let i = 0; i < index; i++) {
    pingzhengData.value.addRow(start + i);
  }
}

export function replaceNewData(pingzhengData, data) {
  data.rows.forEach((it, i) => {
    Object.keys(it).map((key) => {
      Object.assign(pingzhengData.value.rowDefines[i].rowData, data.rows[i]);
    });
  });
}
