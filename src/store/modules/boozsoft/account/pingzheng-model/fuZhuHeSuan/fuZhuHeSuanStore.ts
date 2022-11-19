import { defineStore } from 'pinia';

export const useFuZhuHeSuanDefineStore = defineStore({
  id: 'fuZhuHeSuanDefineStore',
  state: () => ({
    showPopover: {
      value: false,
    },
    showRecordManager: {
      value: false,
    },
    fuZhuHeSuanTableModel: {},
    rowFuZhuHeSuanData: {},
    nextFun: function () {},
  }),
  getters: {
    getNextFun() {
      return this.nextFun;
    },
    getShowPopover() {
      return this.showPopover;
    },
    getShowRecordManager() {
      return this.showRecordManager;
    },
    getFuZhuHeSuanTableModel() {
      return this.fuZhuHeSuanTableModel;
    },
    getRowFuZhuHeSuanData() {
      return this.rowFuZhuHeSuanData;
    },
  },
  actions: {
    setShowPopover(showPopover) {
      this.showPopover.value = showPopover;
    },
    setFuZhuHeSuanTableModel(fuZhuHeSuanTableModel) {
      this.fuZhuHeSuanTableModel = fuZhuHeSuanTableModel;
    },
    setRowFuZhuHeSuanData(rowFuZhuHeSuanData) {
      this.rowFuZhuHeSuanData = rowFuZhuHeSuanData;
    },
    setNextFun(nextFun) {
      this.nextFun = nextFun;
    },
  },
});
