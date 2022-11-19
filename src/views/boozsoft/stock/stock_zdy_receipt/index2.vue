<template>
  <div>
    <div class="app-container">
      <div class="app-container-head"
        ><img :src="getThisIndexImg()" class="container-head-img" draggable="false" />
        <div class="container-head-title">
          <b class="noneSpan">单据表头自定义项</b>
        </div>
        <div class="ant-btn-group" data-v-a1ccd506="" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="addRigthRow()"
            ><span>增行</span></button
          >
          <button type="button" class="ant-btn ant-btn-me" @click="delRigthRowData()"
            ><span>删行</span></button
          >
          <button type="button" class="ant-btn ant-btn-me" @click="openImportExcel"><span>导入</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="exportExcel"><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            ><span>打印</span></button
          >
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent(), router.push('/one/home/welcome')"
            ><span>退出</span></button
          >
        </div>
      </div>

      <div class="app-container-neck">
        <div style="float: left; width: 600px">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload" />
        </div>
        <div style="float: right; margin-left: 10px">
          <a-button style="padding: 0px 12px !important; margin-right: 10px" @click="findAllStockDefineHead();findAllStockDefineBody()">
            <SyncOutlined :style="{ fontSize: '14px' }" />
          </a-button>
        </div>
        <div style="float: right; position: relative">
          <a-input-search
            placeholder=""
            style="width: 200px; border-radius: 4px"
            v-model:value="pageParameter.searchValue"
            @search="serachRightData"
          />
        </div>
      </div>
      <ImprotExcel @save="findAllStockDefineBody" @register="registerExcelPage" />
    </div>
    <div class="app-container">
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <div
          class="bg-white m-4 mr-0 overflow-hidden"
          style="margin-top: -0.5px; margin-left: -5px"
        >
          <div style="width: 100%; height: 50px">
            <label style="font-size: 20px; line-height: 50px; margin-left: 70px">自定义项</label>
          </div>
          <div style="margin-left: 10%">
            <a class="ant-btn-me" @click="addLeftRow()" style="margin-left: 10%">新增</a>
            <a class="ant-btn-me" @click="delLeftData()" style="margin-left: 10%">删除</a>
            <a class="ant-btn-me" @click="editLeftFlag()" style="margin-left: 10%">状态</a>
          </div>
          <!--  左边 -->
          <a-table
            :class="'leftTable'"
            style="height: calc(100% - 76px); overflow: auto; margin-top: 5px"
            :columns="leftColumns"
            :rowClassName="tableRow"
            :pagination="false"
            :showHeader="false"
            :bordered="true"
            :data-source="leftDataSource"
            :row-selection="{
              type: 'radio',
              selectedRowKeys: selectedLeftRowKeys,
              onChange: rowLeftSelection,
            }"
          >
            <template #defineName="{ record }">
              <u class="tableUStyle" @click="leftRowChange(record)">{{
                  setString(record.defineName, 20)
                }}</u>
            </template>
          </a-table>
        </div>
        <div style="width: calc(100% - 800px); float: right; margin-left: 5px">
          <!--  you边 -->
          <a-table
            :class="'leftTable'"
            :scroll="{ y: 655 }"
            style="overflow: auto; margin-top: 5px"
            :columns="rightColumns"
            :pagination="false"
            :bordered="true"
            :data-source="rightDataSource"
            :row-selection="{
              type: 'checkbox',
              selectedRowKeys: selectedRightRowKeys,
              onChange: rowRightSelection,
            }"
          >
            <template #deType="{ record }">
              {{ record.deType }}
            </template>
            <template #defineName="{ record }">
              <span v-if="addflag == '1' && record.id == null">
                <a-input class="abc" style="width: 220px" v-model:value="record.deName" />
                &nbsp;&nbsp;
                <CheckOutlined @click="saveRightRow(record)" />
                &nbsp;&nbsp;
                <CloseOutlined @click="delRightRow(record.key)" />
              </span>
              <span v-else>
                {{ record.deName }}
              </span>
            </template>
          </a-table>
        </div>
      </PageWrapper>

      <a-modal v-model:visible="leftModal" title="自定义项" cancelText="关闭" okText="确定" @ok="leftModalOk" @cancel="leftModalClose" centered="true">
        <br>
        <span style="margin-left: 20px;">
          <label>自定义项名称：</label>
          <a-input class="abc" style="width: 310px" v-model:value="leftInputValue" />
        </span>
        <br>
        <br>
        <span style="margin-left: 50px;">
          <label>字段类型：</label>
          <a-select v-model:value="leftSelectValue" style="width: 120px;">
            <a-select-option
              :value="item2.title"
              :key="item2.title"
              v-for="(item2, j) in deTypeList"
            >
              {{ item2.title }}
            </a-select-option>
          </a-select>
        </span>
        <br>
        <br>
        <span style="margin-left: 150px;color: red;">{{errorText}}</span>
      </a-modal>
    </div>
  </div>
</template>
<script setup lang="ts">
  import router from '/@/router';
  import ImprotExcel from './popup/improtExcel.vue';
  import { useModal } from '/@/components/Modal';
  import { SyncOutlined } from '@ant-design/icons-vue';
  import {
    Modal as AModal,
    Table as ATable,
    Input as AInput,
    Select as ASelect,
    Statistic as AStatistic,
    Tabs as ATabs,
  } from 'ant-design-vue';
  import { reactive, ref } from 'vue';
  import { useUserStoreWidthOut } from '/@/store/modules/user';
  import { getCurrentAccountName, getThisIndexImg } from '/@/api/task-api/tast-bus-api';
  import { useRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
  import AccountPicker from '/@/boozsoft/components/AccountPicker/AccountPicker.vue';
  import { findDataBase } from '/@/api/record/system/account';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import {
    CheckOutlined,
    CloseOutlined,
  } from '@ant-design/icons-vue';
  import {
    stockDefineHeadFindByAll,
    countByDefineName,
    stockDefineHeadSave,
    stockDefineHeadDeleteAllById,
    stockDefineHeadEditByFlag,
    stockDefineHeadfindByName,
  } from '/@/api/record/stock/stock-define-receipt-head';
  import {
    countBodyByHeadIdAndDeName,
    stockDefineBodyDelById,
    stockDefineBodyFindByAll,
    stockDefineBodySave,stockDefineBodyDelByHeadId
  } from '/@/api/record/stock/stock-define-receipt-body';
  import {aoaToSheetXlsx} from "/@/components/Excel";

  const windowHeight = document.documentElement.clientHeight - 330;
  const { createConfirm, createWarningModal, createMessage } = useMessage();
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;

  const username = ref(useUserStoreWidthOut().getUserInfo.username);
  const usernum = ref(useUserStoreWidthOut().getUserInfo.username);
  const database = ref(getCurrentAccountName(true));
  const accId = ref(getCurrentAccountName(false));
  const databaseName = ref('');
  const errorText = ref('');
  const leftModal = ref(false);
  const leftInputValue = ref('');
  const leftSelectValue = ref('');

  const leftColumns: any = [
    {
      title: '表头',
      dataIndex: 'defineName',
      slots: { customRender: 'defineName' },
    },
  ];
  const leftDataSource: any = ref([]);
  const selectedLeftRowKeys: any = ref([]);
  const selectedLeftRowData: any = ref([]);

  const rightColumns: any = [
    {
      title: '自定义项名称',
      dataIndex: 'defineHeadId',
      slots: { customRender: 'defineHeadId' },
      width: 250,
    },
    {
      title: '字段类型',
      dataIndex: 'deType',
      slots: { customRender: 'deType' },
      width: 150,
    },
    {
      title: '档案名称',
      dataIndex: 'defineName',
      slots: { customRender: 'defineName' },
    },
  ];
  const rightDataSource: any = ref([]);
  const deTypeList: any = ref([
    { title: '浮点数' },
    { title: '文本' },
    { title: '日期' },
    { title: '整数' },
  ]);
  const selectedRightRowKeys = ref([]);
  const selectedRightRowData = ref([]);

  // 状态：0不是增加，1是
  const addflag = ref('0');

  const loadMark = ref(true);

  const searchValue = ref('');
  const { closeCurrent } = useTabs();

  const searchConditonList = ref([
    {title:'',value:''}
  ]);
  const pageParameter = reactive({
    searchValue: ''
  });
  // 这是示例组件
  const [registerExcelPage, { openModal: openExcelPage }] = useModal();
  function openImportExcel() {
    openExcelPage(true, {
      database: database.value,
    });
  }

  const dynamicAdReload = async (obj) => {
    loadMark.value = true;
    await findDataBase(obj.accId, obj.year).then(async (item) => {
      databaseName.value = obj.target.accName;
      if (item.accountMode != database.value) {
        accId.value = item.accountId;
        database.value = item.accountMode;
      }
      findAllStockDefineHead();
      loadMark.value = false;
    });
  };
  //js切割字符串
  function setString(str, len) {
    var strlen = 0;
    var s = '';
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 128) {
        strlen += 2;
      } else {
        strlen += 1.2;
      }
      s += str.charAt(i);
      if (strlen >= len) {
        return s + '...';
      }
    }
    return s;
  }
  
  function exportExcel() {
    let a:any=['自定义项名称','字段类型','档案名称']
    const dataArr:any=[]
    rightDataSource.value.forEach(item=>{
      let temp:any=[]
      temp[0]=item.defineHeadId,
      temp[1]=item.deType,
      temp[2]=item.deName,
      dataArr.push(temp)
    })
    aoaToSheetXlsx({
      data: dataArr,
      header: a,
      filename: databaseName.value+'-单据表头自定义项.xlsx',
    });
  }

  /************************************************** 右边table ***********************************************************/
  async function delRigthRowData() {
    if (selectedRightRowData.value.length == 0) {
      return createConfirmPop('至少选择一条!');
    }
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '确定删除吗？',
      onOk: async () => {
        let temp = selectedRightRowData.value
          .filter((item) => item.id != null)
          .map((item) => item.id);
        let map = { id: temp.join(',') };
        await useRouteApi(stockDefineBodyDelById, { schemaName: database })(map);
        findAllStockDefineBody();
      },
    });
  }
  function addRigthRow() {
    if(selectedLeftRowData.value==''){
      return createConfirmPop('请选择自定义项！');
    }
    addflag.value = '1';
    rightDataSource.value.push({
      defineHeadId: selectedLeftRowData.value.defineName,
      deName: '',
      deType: selectedLeftRowData.value.defineType,
      flag: '1',
      key: rightDataSource.value.length + 1,
    });
  }
  function delRightRow(key) {
    var index = rightDataSource.value.findIndex((item) => {
      if (item.key == key) {
        return true;
      }
    });
    rightDataSource.value.splice(index, 1);
  }
  async function saveRightRow(data) {
    if (data.deType == '') {
      return createConfirmPop('字段类型不可为空！');
    }
    if (data.deName == '') {
      return createConfirmPop('名称不可为空！');
    }
    // 获取自定义项表头 ID
    let headData = await useRouteApi(stockDefineHeadfindByName, { schemaName: database })(
      data.defineHeadId,
    );
   let findBysize= await useRouteApi(countBodyByHeadIdAndDeName, { schemaName: database })({headId:headData.id,deName:data.deName});
    if(findBysize>0){
      return createConfirmPop('名称不可重复！');
    }
    data.defineHeadId = headData.id;
    await useRouteApi(stockDefineBodySave, { schemaName: database })(data);
    findAllStockDefineBody();
  }
  async function findAllStockDefineBody() {
    if (selectedLeftRowData.value.flag == '1') {
      selectedRightRowData.value = [];
      selectedRightRowKeys.value = [];
      rightDataSource.value = [];
      let temp = await useRouteApi(stockDefineBodyFindByAll, { schemaName: database })( selectedLeftRowData.value.defineName);
      temp.forEach((item, index) => {
        rightDataSource.value.push({
          key: index + 1,
          defineHeadId: item.defineHeadId,
          deName: item.deName,
          deType: item.deType,
          id: item.id,
        });
      });
    }
  }
  function rowRightSelection(a, b) {
    selectedRightRowKeys.value = a;
    selectedRightRowData.value = b;
  }
  /************************************************** 右边table END ***********************************************************/
  /************************************************** 左边table ***********************************************************/
  async function leftModalOk() {
    if (leftInputValue.value == '') {
      errorText.value='名称不可为空'
      return
    }
    let findByName = await useRouteApi(countByDefineName, { schemaName: database })(leftInputValue.value);
    if (findByName > 0) {
      errorText.value='名称已存在,不可重复！'
      return
    }
    errorText.value=''
    let map={
      defineName:leftInputValue.value,
      defineType:leftSelectValue.value,
      flag:'1',
    }
    await useRouteApi(stockDefineHeadSave, { schemaName: database })(map);
    leftModal.value=false
    leftInputValue.value=''
    leftSelectValue.value=''
    findAllStockDefineHead();
  }
  function leftModalClose() {

  }
  function tableRow(row: any, num: any) {
    return row.flag == '0' ? 'table-month-striped' : null;
  }

  // 重新加载
  function leftReload(keys,data) {
    selectedLeftRowKeys.value = keys;
    selectedLeftRowData.value = data;
    findAllStockDefineBody();
  }
  // 左边名称点击
  function leftRowChange(data) {
    leftReload([data.key],data)
  }
  function rowLeftSelection(a, b) {
    leftReload(a,b[0])
  }
  async function findAllStockDefineHead() {
    selectedLeftRowKeys.value = [];
    selectedLeftRowData.value = [];
    leftDataSource.value = [];
    let test = await useRouteApi(stockDefineHeadFindByAll, { schemaName: database })('');
    test.forEach((item, index) => {
      leftDataSource.value.push({
        key: index + 1,
        defineName: item.defineName,
        defineType: item.defineType,
        flag: item.flag,
        id: item.id,
      });
    });

    // 默认查第一个
    if(leftDataSource.value.length>0){
      if(leftDataSource.value[0].flag=='1'){
        leftReload([leftDataSource.value[0].key],leftDataSource.value[0])
      }
    }
  }

  function addLeftRow() {
    leftModal.value=true
    leftSelectValue.value=deTypeList.value[0].title
  }
  function delLeftRow(defineName) {
    var index = leftDataSource.value.findIndex((item) => {
      if (item.defineName == defineName) {
        return true;
      }
    });
    leftDataSource.value.splice(index, 1);
  }

  function delLeftData() {
    if (selectedLeftRowData.value.length == 0) {
      return createConfirmPop('至少选择一条!');
    }
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '确定删除吗？',
      onOk: async () => {
        await useRouteApi(stockDefineHeadDeleteAllById, { schemaName: database })(selectedLeftRowData.value.id);
        await useRouteApi(stockDefineBodyDelByHeadId, { schemaName: database })(selectedLeftRowData.value.id);
        findAllStockDefineHead();
      },
    });
  }
  async function editLeftFlag() {
    let flag = selectedLeftRowData.value;
    let map = { flag: flag.flag=='1'?'0':'1', id: flag.id };
    await useRouteApi(stockDefineHeadEditByFlag, { schemaName: database })(map);
    findAllStockDefineHead();
  }

  function serachRightData() {
    if(pageParameter.searchValue==''){
      findAllStockDefineBody()
    }else{
      rightDataSource.value=rightDataSource.value.filter(v=>v.deName===pageParameter.searchValue)
    }
  }
  /************************************************** 左边table END ***********************************************************/
  function createConfirmPop(text) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: text,
      onOk: async () => {},
    });
  }
</script>
<style src="../../../../assets/styles/global-menu-index-block.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style src="../../../../assets/styles/global-container-index.less" lang="less" scoped></style>
<style scoped>
  .bg-white {
    width: 250px;
    min-height: 250px;
    height: calc(100% - 228px);
    border: 1px #cccccc solid;
    background: white;
    margin-top: -0.5%;
  }
  .app-container:nth-of-type(1) {
    background-color: #f2f2f2;
    padding: 10px 5px;
    margin: 10px 10px 5px;
  }
  .app-container:nth-of-type(2) {
    padding: 0px;
    margin: 5px 10px;
    height: 720px;
  }
  :deep(.ant-checkbox) {
    border: 1px solid #2f2a2a;
    border-radius: 4px;
  }
  :deep(.ant-radio) {
    border: 1px solid;
    border-radius: 10px;
  }
  .a-table-font-size-12 :deep(td),
  .a-table-font-size-12 :deep(th) {
    font-size: 14px !important;
    padding: 2px 8px !important;
  }

  .leftTable :deep(td),
  .leftTable :deep(th) {
    font-size: 14px !important;
    padding: 2px 8px !important;
  }

  .abc {
    border-bottom: 2px solid #666666 !important;
  }
  :deep(.table-month-striped) {
    background-color: #d7d7d7;
  }
</style>
