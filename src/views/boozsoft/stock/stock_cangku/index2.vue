<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div> <AccountPicker theme="three" @reloadTable="dynamicAdReload"/></div>
        <div style="display: inline-block;position:absolute;top:60px;left:80px;font-size: 10px;color:#999999;">共 {{ tableTotal }} 条记录</div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">仓库信息</b></div>
      </div>
      <div>
        <div>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="openAddPage()"
          ><span>新增</span></button
          >
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="rowOpenEdit"
          >
            <span>修改</span></button
          >
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="rowOpenDel"
          ><span>删除</span>
          </button>
          <button type="button" class="ant-btn ant-btn-me" @click="openImportExcel"
          ><span>导入</span>
          </button>
          <button type="button" class="ant-btn ant-btn-me" @click="thisPageImport"><span>导出</span> </button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="jsonPrint"
          ><span>打印</span>
          </button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent(), router.push('/one/home/welcome')"
          ><span>退出</span></button>
        </div>
        <div>
          <div>
            <a-select
              v-model:value="pageParameter.searchConditon.requirement"
              style="width: 130px"
              class="special_select"
            >
              <template v-for="item in CrudApi.columns">
                <a-select-option :value="item.dataIndex">
                  {{ item.title }}
                </a-select-option>
              </template>
            </a-select>
            <a-input-search placeholder="" style="width: 200px; border-radius: 4px" v-model:value="pageParameter.searchValue" @search="pageReload"/>
          </div>
          <div>
            <a-button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="pageReload"/>
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <BasicTable
        ref="tableRef"
        :bordered="true"
        :class="
          pageParameter.showRulesSize == 'MAX' ? 'a-table-font-size-16' : 'a-table-font-size-12'
        "
        :scroll="{ x: totalColumnWidth, y: windowHeight }"
        :row-selection="{ type: 'checkbox' }"
        @register="registerTable"
      >
        <template #ckFlag="{ record }">
          <a-tag :color="record.ckFlag === '1' ? 'green' : 'volcano'">
            {{ record.ckFlag === '1' ? '启用' : '停用' }}
          </a-tag>
        </template>
        <template #ckIsDuli="{ record }">
          {{ record.ckIsDuli === '1' ? '独立仓库' : '级别仓库' }}
        </template>
        <template #ckType="{ record }">
          {{ record.ckType === '1' ? '自有仓库' : '供应商直发库' }}
        </template>
      </BasicTable>
      <Edit @closeOk="reload(), clearSelectedRowKeys()" @register="registerEditPage" />
      <ImprotExcel @save="reload" @register="registerExcelPage" />
      <StockCangKuModalPop @throwData="throwStockCangKuData" @register="registerStockCangKuModalPage" />
  </div>
  </div>
</template>
<script setup lang="ts">
  import router from '/@/router';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import {
    UnorderedListOutlined,
    SyncOutlined,
    ProfileOutlined
  } from '@ant-design/icons-vue';

  import { findAll, delById } from '/@/api/record/stock/stock-cangku';
  import Edit from './popup/edit.vue';
  import ImprotExcel from './popup/improtExcel.vue';
  import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue';
  import {
    Select as ASelect,
    Tabs as ATabs,
    Input as AInput,
    Popover as APopover,
    Checkbox as ACheckbox,
    Statistic as AStatistic,
    Radio as ARadio,
    Table as ATable,
    Popconfirm as APopconfirm,
    message,
    Tag as ATag
  } from 'ant-design-vue';
  import { useUserStoreWidthOut } from '/@/store/modules/user';
  import { findDataBase } from '/@/api/record/system/account';
  import { onMounted, ref, reactive, unref } from 'vue';
  import { aoaToSheetXlsx } from '/@/components/Excel';
  // import {
  //   initDynamics,
  //   assemblyDynamicColumn,
  // } from '/@/views/boozsoft/system/customer_info_group/data';
  const initDynamics=null
  const assemblyDynamicColumn=null
  import { useMessage } from '/@/hooks/web/useMessage';
  import { findDbLanMuList, saveLanMuList } from '/@/api/record/system/accvoucher';
  import { getCurrentAccountName } from '/@/api/task-api/tast-bus-api';
  import { cloneDeep } from 'lodash-es';
  import { getThisAdInfoData } from '/@/api/record/system/financial-settings';
  import { useRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
  import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-DATA.vue";
  import { useTabs } from '/@/hooks/web/useTabs';
  import {exportExcel} from "/@/api/record/generalLedger/excelExport";
  import { findAll as cangkuLevelFindAll } from '/@/api/record/stock/stock-cangku-level';

  const { createConfirm, createWarningModal, createMessage } = useMessage();
  const searchConditonList = ref([]);
  const visible = ref(false);
  const windowWidth = document.documentElement.clientWidth;
  const windowHeight = document.documentElement.clientHeight - 302;
  const totalColumnWidth = ref(0);
  const dynamicColumns = initDynamics().DEFAULT;
  const dynamicColumnData = ref([]);
  let dynamicColumnDataCopy = [];
  const editableData = reactive({});
  const tableRef = ref(null);
  const lanMuData = {
    accId: '',
    menuName: '客户信息',
    type: '账套',
    objects: '',
    username: useUserStoreWidthOut().getUserInfo.username,
  };
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const independent = ref(true);
  const ARadioButton = ARadio.Button;
  const ARadioGroup = ARadio.Group;
  const database = ref(getCurrentAccountName(true));
  const accId = ref('');

  const tableTotal = ref(0);
  const databaseId = ref('');
  const databaseName = ref('');
  const defaultPage = ref(true); // 先判断是否独立账套,true 是；false 否
  const loadMark = ref(false);
  const { closeCurrent } = useTabs();
  const CrudApi = {
    list: findAll,
    columns: [
      {
        title: '状态',
        dataIndex: 'ckFlag',
        width: 60,
        fixed: 'left',
        slots: { customRender: 'ckFlag' },
      },
      {
        title: '仓库编码',
        dataIndex: 'ckNum',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '仓库名称',
        dataIndex: 'ckName',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '仓库级别',
        dataIndex: 'ckIsDuli',
        slots: { customRender: 'ckIsDuli' },
      },
      {
        title: '管理属性',
        dataIndex: 'ckType',
        slots: { customRender: 'ckType' },
      },
      {
        title: '所在城市',
        width: 100,
        dataIndex: 'ckCity',
      },
      {
        title: '仓库注释',
        width: 100,
        dataIndex: 'ckRemark',
      }]
  };
  const pageParameter = reactive({
    showRulesSize: 'MIN',
    companyCode: '',
    companyName: '',
    ifUnit: false,
    total: 0,
    thisAdInfo: {},
    thisLeftKey: '',
    flag: '1',
    database: database.value,
    accId: accId.value,
    username: useUserStoreWidthOut().getUserInfo.username,
    uniqueCustclass: '',
    searchConditon: {
      requirement: 'ckNum',
      value: '',
    },
  });
  // 这是示例组件
  const [
    registerTable,
    {
      reload,
      getColumns,
      setColumns,
      setTableData,
      getPaginationRef,
      setPagination,
      getSelectRows,
      getDataSource,
      clearSelectedRowKeys,
    },
  ] = useTable({
    api: useRouteApi(CrudApi.list, { schemaName: database }),
    columns: CrudApi.columns,
    bordered: true,
    showIndexColumn: false,
    loading: loadMark.value,
    pagination: {
      pageSize: 50,
      showSizeChanger: true,
      pageSizeOptions: ['50', '100'],
      showTotal: (t) => `总共${t}条数据`,
    },
    searchInfo: pageParameter,
  });

  const [registerEditPage, { openModal: openEditPage }] = useModal();
  const [registerExcelPage, { openModal: openExcelPage }] = useModal();
  const [registerTreeAddPage, { openModal: openCusClassTreePage }] = useModal();
  const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();

  const pageSearch = async () => {
    // 搜索前校验格式
    if ('' == pageParameter.searchConditon.requirement.trim()) {
      message.warn('请选择检索条件');
      return false;
    }
    // 校验完成后搜索
    visible.value = false;
    reloadColumns();
    reload();
  };

  const openAddPage = async () => {
    openEditPage(true, {
      data: '',
      database: database.value,
      databaseId: databaseId.value,
      isEdit: true,
      openType:'add'
    });
  };
  async function openImportExcel() {
    let ckLevelList:any=[]
    await cangkuLevelFindAll().then((res) => {
      res.forEach(item=>{
        let name=item.levelOrder==='1'?'独立'+item.level1:item.level1
        let str=''
        if(item.level1!=null && item.level1!=''){
          str+=name+'\\'
        } if(item.level2!=null && item.level2!=''){
          str+=item.level2+'\\'
        } if(item.level3!=null && item.level3!=''){
          str+=item.level3+'\\'
        } if(item.level4!=null && item.level4!=''){
          str+=item.level4+'\\'
        } if(item.level5!=null && item.level5!=''){
          str+=item.level5+'\\'
        } if(item.level6!=null && item.level6!=''){
          str+=item.level6+'\\'
        }
        ckLevelList.push(
          {title:str.substring(0,str.length-1),value:item.id,levelOrder:item.levelOrder}
        )
      })
    });
    openExcelPage(true, {
      data: useUserStoreWidthOut().getUserInfo.username,
      databaseName: databaseName.value,
      databaseId: databaseId.value,
      database:database.value,
      ckLevelList:ckLevelList,
    });
  }

  async function rowOpenEdit() {
    if (getSelectRows().length !== 1) {
      message.warn('只能选择一条数据进行编辑！');
      return false;
    }
    openEditPage(true, {
      data: getSelectRows()[0],
      database: database.value,
      databaseId: databaseId.value,
      isEdit: true,
      openType:'edit'
    });
  }

  async function rowOpenDel() {
    if (getSelectRows().length == 0) {
      message.warn('至少选择一条数据进行删除！');
      return false;
    }
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '确定删除吗?',
      onOk: async () => {
        await useRouteApi(delById, { schemaName: database })(getSelectRows()).then((item) => {
          reload();
        });
      },
    });
  }

  const dynamicAdReload = async (obj) => {
    databaseName.value=obj.baseName
    await findDataBase(obj.accId, obj.year).then(async (item) => {
      accId.value = item.accountId;
      databaseId.value = item.databaseId;
      database.value = item.accountMode;
      reload();

      tableTotal.value=getPaginationRef().total
    });
  };

  /******************************************************************************************栏目设置**************************************************************************************************/
  const confirm = (e: MouseEvent) => {
    // 询问
    createConfirm({
      iconType: 'warning',
      title: '栏目同步',
      content: '是否将刚才设置同步数据库!',
      onOk: async () => {
        // 调整数据库 列参数
        lanMuData.accId = database.value;
        lanMuData.objects = JSON.stringify(
          filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy),
        );
        if (lanMuData.objects == '[]') {
          createWarningModal({ content: '请先做修改后再进行确认同步数据库！' });
        } else {
          saveLanMuList(lanMuData).then((res) => {
            message.success('数据库同步成功！');
          });
          // 重新赋值
          dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value));
        }
      },
    });
    // 重新获取数据
    reloadColumns();
  };
  const cancel = (e: MouseEvent) => {
    // 恢复默认
    dynamicColumnData.value = [];
    dynamicColumnData.value = dynamicColumnDataCopy;
  };
  const edit = (key: string) => {
    if (key.toString().indexOf('-') != -1) {
      let arr = key.split('-');
      let one = parseInt(arr[0]);
      if (arr.length == 2) {
        editableData[key] = cloneDeep(
          dynamicColumnData.value[one].children.filter((item) => key === item.key)[0],
        );
      } else {
        let two = parseInt(arr[1] - 1);
        editableData[key] = cloneDeep(
          dynamicColumnData.value[one].children[two].children.filter((item) => key === item.key)[0],
        );
      }
    } else {
      editableData[key] = cloneDeep(dynamicColumnData.value.filter((item) => key === item.key)[0]);
    }
  };
  const save = (key: string, min: number, max: number) => {
    editableData[key].width =
      editableData[key].width > max
        ? max
        : editableData[key].width < min
        ? min
        : editableData[key].width;
    if (key.toString().indexOf('-') != -1) {
      let arr = key.split('-');
      let one = parseInt(arr[0]);
      if (arr.length == 2) {
        Object.assign(
          dynamicColumnData.value[one].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
        Object.assign(
          dynamicColumnData.value[one].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
      } else {
        let two = parseInt(arr[1] - 1);
        Object.assign(
          dynamicColumnData.value[one].children[two].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
      }
    } else {
      Object.assign(
        dynamicColumnData.value.filter((item) => key === item.key)[0],
        editableData[key],
      );
    }
    delete editableData[key];
  };
  const saveName = (key: string) => {
    if (key.toString().indexOf('-') != -1) {
      let arr = key.split('-');
      let one = parseInt(arr[0]);
      if (arr.length == 2) {
        Object.assign(
          dynamicColumnData.value[one].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
        Object.assign(
          dynamicColumnData.value[one].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
      } else {
        let two = parseInt(arr[1] - 1);
        Object.assign(
          dynamicColumnData.value[one].children[two].children.filter((item) => key === item.key)[0],
          editableData[key],
        );
      }
    } else {
      Object.assign(
        dynamicColumnData.value.filter((item) => key === item.key)[0],
        editableData[key],
      );
    }
    delete editableData[key];
  };

  function filterModifyData(lanMuList: any, copyList) {
    let a = lanMuList.filter((item) => {
      try {
        copyList.forEach((item2) => {
          if (item.key === item2.key && item.name == item2.name) {
            if (
              item.nameNew != item2.nameNew ||
              item.width != item2.width ||
              item.check != item2.check ||
              item.align != item2.align
            )
              throw new Error('ok');
          }
        });
        return false;
      } catch (e) {
        if (e.message == 'ok') {
          return true;
        } else {
          return false;
        }
      }
    });
    return a;
  }

  function combineParameters(staticList: any, dbList: any) {
    staticList.forEach((item) => {
      dbList.forEach((item2) => {
        if (item.key === item2.key && item.name === item2.name) {
          item.nameNew = item2.nameNew;
          item.width = parseInt(item2.width);
          item.check = item2.check == 'true';
          item.align = item2.align;
        }
      });
    });
    return staticList;
  }

  const reloadColumns = () => {
    let a = [];
    a = getColumns();
    let last = a.pop();
    let newA = JSON.parse(JSON.stringify(CrudApi.columns));
    newA = assemblyDynamicColumn(dynamicColumnData.value, newA);
    newA.push(last);
    setColumns(newA);
    initTableWidth(newA);
    searchConditonList.value = newA;
  };

  function resetDynamicColumnData() {
    // 先从数据查询是否已经设置
    lanMuData.accId = database.value;
    findDbLanMuList(lanMuData).then((res) => {
      // 栏目列
      let dbList = res.items;
      if (dbList.length > 0) {
        let statiList = initDynamics()['DATA'];
        dbList = combineParameters(statiList, dbList);
        // if(defaultPage.value){ dbList.splice(dbList.findIndex(v=> v.name==='申请状态'),1) }
        dynamicColumnData.value = dbList;
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList));
      } else {
        let statiList = initDynamics()['DATA'];
        // if(defaultPage.value){ statiList.splice(statiList.findIndex(v=> v.name==='申请状态'),1) }
        dynamicColumnData.value = statiList;
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList));
      }
      // 表格列
      reloadColumns();
      // pageReload()
    });
  }

  function initTableWidth(thisCs) {
    let total = 60;
    thisCs.forEach((item) => {
      if (item.ifShow == null || item.ifShow) total += parseInt(item.width);
    });
    /*  // 去除操作咧宽
    total -= 100*/
    if (total > windowWidth) {
      let f = 0;
      if (visible.value) f = 260;
      totalColumnWidth.value = Number(windowWidth) - f;
      tableRef.value.$el.style.setProperty('width', windowWidth + 190 - f + 'px');
    } else {
      if (visible.value && windowWidth - 260 < total) total -= total - (windowWidth - 260);
      totalColumnWidth.value = total;
      tableRef.value.$el.style.setProperty('width', total + 190 + 'px');
    }
  }

  const pageReload = () => {
    setTableData([]); // 清空可能残留的数据
    reload({
      searchInfo: pageParameter,
    });
  };

  /*栏目设置end*/
  function getUniqueCustClassValue() {
    return new Promise((resolve, reject) => {
      let i = 0;
      const inte = setInterval(() => {
        i++;
        if (i == 20) {
          reject(false);
        }
        if (null != pageParameter.thisLeftKey || pageParameter.thisLeftKey != '') {
          resolve(true);
        }
        window.clearInterval(inte);
      });
    }, 100);
  }

  // 导出当前
  function thisPageImport(){
    const data = JSON.parse(JSON.stringify(getDataSource()))
    let columns:any =[{title: '仓库编码', dataIndex: 'ckNum',key: "ckNum"},{title: '仓库名称', dataIndex: 'ckName',key: "ckName"},{title: '仓库级别', dataIndex: 'ckLevel',key: "ckLevel"},{title: '管理属性', dataIndex: 'ckType',key: "ckType"},
      {title: '所在城市',dataIndex: 'ckCity',key: "ckCity"},{title: '仓库注释', dataIndex: 'ckRemark',key: "ckRemark"}]
    const title = []
    const multiHeader:any = [[],[]]
    const keys:any = []
    const merges:any = []
    const cellStyle = [
      {
        cell: 'A1',
        font: {
          sz: 16,
          color: { rgb: "000000" },
          bold: true,
        },
        fill: {
          fgColor: { rgb: "ffffff" },
        },
      }
    ]
    const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    let flg = 0;
    columns.forEach((v,index)=>{
        multiHeader[0].push(v.title)
        multiHeader[1].push('')
        keys.push(v.key)
        //合并上下单元格
        merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
        flg = flg + 1
    })
    merges.push('`A2:' + cell[keys.length-1] +'2`');
    data.forEach(v=>{
      v.ckLevel=v.ckLevel=='1'?'独立仓库':'库位仓库'
      v.ckType=v.ckType=='1'?'自有仓库':'供应商直发库'
    })
    const sheet =[
      {
        title: '仓库信息',
        tHeader: title,
        multiHeader: multiHeader,
        table: data,
        keys: keys,
        merges: merges,
        sheetName: 'sheet1',
        cellStyle: cellStyle,
        rightrow:[],
        leftrow:[],
      },
    ]
    exportExcel(sheet, 'xlsx',databaseName.value+'-仓库信息')
  }

  function stockCangKuModalShow() {
    openStockCangKuModalPage(true,{
      database:database.value,
    })
  }
  function throwStockCangKuData(data) {
    console.log(data)
  }
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style lang="less" scoped>
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;

    >div:nth-of-type(1){
      .ant-btn-me {
        color: #0096c7;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
  }
}
a {
  color: #0096c7;
  text-decoration: none;
  cursor: pointer;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 4px 8px !important;
  border-color: #aaaaaa !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}
.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
  //background-color: #f2f2f2 !important;
  background-color: #cccccc !important;
  border-color: #aaaaaa !important;
}

:deep(.vben-basic-table) .ant-table-wrapper {
  padding: 0px;
}

:deep(.vben-basic-table) .ant-table {
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  height: calc(100% - 160px);
  min-height: 500px;
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

</style>
