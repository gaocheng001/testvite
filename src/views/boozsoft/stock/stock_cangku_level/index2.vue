<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div style="display: inline-block;position:absolute;top:60px;left:80px;font-size: 10px;color:#999999;">共 {{ tableTotal }} 条记录</div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">设置仓库级别</b></div>
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
            @click="rowOpenDel"
          ><span>删除</span>
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
              <a-select-option value="stockNum">存货编码</a-select-option>
              <a-select-option value="stockBarcode">条形码</a-select-option>
              <a-select-option value="stockName">存货名称</a-select-option>
              <a-select-option value="stockGgxh">规格型号</a-select-option>
              <a-select-option value="stockClass">存货分类</a-select-option>
              <a-select-option value="stockJiliang">计量单位</a-select-option>
            </a-select>
            <a-input-search placeholder="" style="width: 200px; border-radius: 4px" v-model:value="pageParameter.searchConditon.value" @search="findAllStock"/>
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
        :bordered="true"
        :class="
          pageParameter.showRulesSize == 'MAX' ? 'a-table-font-size-16' : 'a-table-font-size-12'
        "
        :scroll="{ x: totalColumnWidth, y: windowHeight }"
        :row-selection="{ type: 'checkbox' ,getCheckboxProps:rowSelection.getCheckboxProps}"
        @register="registerTable"
      >

      </BasicTable>
  </div>
    <AddPage @save="reload" @register="registerSavePage" />
  </div>
</template>
<script setup lang="ts">
import router from '/@/router';
import {BasicTable, useTable} from '/@/components/Table';
import {
  CheckOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  ProfileOutlined
} from '@ant-design/icons-vue';
import AddPage from './popup/save.vue';
import {delByIdList, findAll} from '/@/api/record/stock/stock-cangku-level';
import {
  countByLevelName,
  delById,
  findAllLevelName,
  levelNamesave
} from '/@/api/record/stock/stock-cangku-level-name';
import {
  Input as AInput,
  message,
  Popconfirm as APopconfirm,
  Popover as APopover,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Table as ATable,
  Tabs as ATabs
} from 'ant-design-vue';
import {reactive, ref} from 'vue';
import {useMessage} from '/@/hooks/web/useMessage';
import {useTabs} from '/@/hooks/web/useTabs';
import AButton from "/@/components/Button/src/BasicButton.vue";
import {useModal} from "/@/components/Modal";

const { createConfirm, createWarningModal, createMessage } = useMessage();
  const windowHeight = document.documentElement.clientHeight - 302;
  const totalColumnWidth = ref(0);
  const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const ATabPane = ATabs.TabPane;
  const ARadioButton = ARadio.Button;
  const ARadioGroup = ARadio.Group;

  const tableTotal = ref(0);
  const visible = ref(false);
  const visible2 = ref(false);
  const loadMark = ref(false);
  const { closeCurrent } = useTabs();

  const levelNameData=ref([])
  const levelNameTableRowKeys=ref([])
  const levelName=ref('')

  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.levelOrder=='1',
    }),
  };
  const levelNameRowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.levelName=='仓库' || record.levelName=='通道' ||record.levelName=='货架' || record.levelName=='库位' ,
    }),
  };

  const CrudApi = {
    list: findAll,
    columns: [
      {
        title: '级别1',
        dataIndex: 'level1',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '级别2',
        dataIndex: 'level2',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '级别3',
        dataIndex: 'level3',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '级别4',
        dataIndex: 'level4',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '级别5',
        dataIndex: 'level5',
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '级别6',
        dataIndex: 'level6',
        ellipsis: true,
        fixed: 'left',
      },
      ]
  };
  const pageParameter = reactive({
    showRulesSize: 'MIN',
    searchConditon: {
      requirement: 'level1',
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
      getRawDataSource
    },
  ] = useTable({
    api: CrudApi.list,
    columns: CrudApi.columns,
    bordered: true,
    showIndexColumn: false,
    loading: loadMark.value,
    fetchSuccess:fetchSuccess(),
    pagination: {
      pageSize: 50,
      showSizeChanger: true,
      pageSizeOptions: ['50', '100'],
      showTotal: (t) => `总共${t}条数据`,
    },
    searchInfo: pageParameter,
  });
  const [registerSavePage, { openModal: openSavePage }] = useModal();

  async function fetchSuccess() {
    let list=await findAll()
    tableTotal.value=list.length
  }
  const pageSearch = async () => {
    // 搜索前校验格式
    if ('' == pageParameter.searchConditon.requirement.trim()) {
      message.warn('请选择检索条件');
      return false;
    }
    reload();
  };

  const openAddPage = () => {
    openSavePage(true, {
      data: ''
    });
  };

  async function rowOpenDel() {
    if (getSelectRows().length == 0) {
      message.warn('至少选择一条数据进行删除！');
      return false;
    }
    let map = {
      id: getSelectRows().map((item) => item.id).join(','),
    };
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '确定删除吗?',
      onOk: async () => {
        await delByIdList(map)
        reload();
      },
    });
  }

  /************************************ 级别名称 ***********************************************/
  // 查看级别名称
 async function findByLevelNameCheck() {
    visible.value=true
   levelNameData.value=[]
   levelNameTableRowKeys.value=[]
   let temp= await findAllLevelName()
   temp.forEach(item=>{
     levelNameData.value.push(
       {levelName:item.levelName,key:item.id}
     )
   })
  }

  // 选中 级别名称表格触发
  function levelNameTableCheck(a) {
    levelNameTableRowKeys.value=a
  }

  // 增加 级别名称触发
  async function levelNameSaveConfirm() {
    let namesize=await countByLevelName(levelName.value)
    if(namesize>0){
     return message.error("名称已存在,不能重复!")
    }
    await levelNamesave(levelName.value)
    visible2.value=false
    levelName.value=''
    findByLevelNameCheck()
  }
 async function levelNameTableDel(){
   if(levelNameTableRowKeys.value.length==0){
    return message.warn('至少选择一条数据进行删除！');
   }
   let map={
     id:levelNameTableRowKeys.value.join(',')
   }
   await delById(map)
   findByLevelNameCheck()
  }
  /************************************ END ***********************************************/

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
