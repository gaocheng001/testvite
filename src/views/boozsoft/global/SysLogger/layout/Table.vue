<template>
  <div style="width: 100%; display: flex">
    <BasicTable
      v-show="activeKey"
      class="w-4/5 xl:w-5/6"
      ref="tableRef"
      :class="
        pageParameter.showRulesSize == 'MAX' ? 'a-table-font-size-16' : 'a-table-font-size-12'
      "
      :scroll="{ x: totalColumnWidth, y: windowHeight }"
      :style="{
        height: windowHeight + 60 + 'px',
        width: '100%',
        background: 'inherit !important',
      }"
      @register="registerTable"
    >
      <template #action="{ record }">
        <div>
          <Popover placement="bottom">
            <Button style="padding: 0px 4px; height: 20px">
              <CaretDownFilled />
            </Button>
            <template #content>
              <p class="p_specifics" @click="recordData.arr[1].fun(record, false)">
                <FormOutlined />
                修改
              </p>
              <p class="p_specifics" @click="recordData.arr[2].fun(record)">
                <DeleteOutlined />
                删除
              </p>
            </template>
          </Popover>
        </div>
      </template>
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { computed, onMounted, ref, reactive, watch, inject } from 'vue';
  import { getOrganizeList, getOrganizeAll } from '/@/api/record/group/im-organize';
  import { assemblyDynamicColumn } from '../data/data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStoreWidthOut } from '/@/store/modules/user';
  import { CaretDownFilled, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Popover, Button } from 'ant-design-vue';
  //选择项目大类
  const cateCode: any = ref();
  const currentCateCode = computed(() => cateCode.value);
  const recordData = inject('recordData');
  watch(currentCateCode, (abc) => {
    // projectStore.projectClassTree()
    reload({
      searchInfo: {},
    });
  });

  function createColumn({ label, field }) {
    return {
      key: '0',
      title: label,
      dataIndex: field,
      align: 'center',
      width: 150,
    };
  }

  // const arr=[
  //   $$columnModel$$
  // ]

  function createCurdModel({ api, columns }) {
    return {
      list: api,
      columns,
      editData: {
        id: '',
        uniqueCode: '',
        orgCode: '',
        orgName: '',
        orgSimpName: '',
        uniqueGroupCode: '',
        orgSuperior: '',
        industryclassCode: '',
        uniqueCodeZone: '',
        countryId: '',
        createDate: '',
        personInCharge: '',
        uniqueAccStandard: '',
        telephone: '',
        address: '',
        ccodeLevel: '',
        remarks: '',
      },
    };
  }

  const CrudModel = createCurdModel({
    api: getOrganizeList,
    columns: [
      ...recordData.value.columns.map((it) => {
        return createColumn({ label: it.label, field: it.field });
      }),
    ],
  });
  const CrudApi = CrudModel;

  const cardList: any = ref([]);
  const activeKey = ref(true);

  import { findAllByYearAndMonthApi } from '/@/api/group/SysLogger';

  const [registerTable, { reload, setTableData, getDataSource, setColumns, getColumns }] = useTable(
    {
      api: findAllByYearAndMonthApi,
      columns: CrudApi.columns,
      bordered: true,
      showIndexColumn: false,
      pagination: {
        pageSize: 15,
        showSizeChanger: true,
        pageSizeOptions: ['10', '30', '50', '100'],
        showTotal: (t) => `总共${t}条数据`,
      },
      actionColumn: {
        width: 100,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
      searchInfo: {
        year: '2022',
        month: '11',
      },
    },
  );
  const [registerEditPage, { openModal: openEditPage }] = useModal();

  async function cardReload() {
    if (!activeKey.value) cardList.value = await getOrganizeAll();
  }

  /**********************栏目设置**********************/

  const { createConfirm, createWarningModal } = useMessage();
  const pageParameter = reactive({
    showRulesSize: 'MIN',
  });
  const visible = ref(false);
  const windowWidth = document.documentElement.clientWidth - 70; /*+280*/
  const windowHeight = document.documentElement.clientHeight - 350;
  const totalColumnWidth = ref(0);
  const dynamicColumnData = ref([]);
  let dynamicColumnDataCopy = [];
  const tableRef = ref(null);
  const lanMuData = {
    accId: 'postgre',
    menuName: '组织信息',
    type: '集团',
    objects: '',
    username: useUserStoreWidthOut().getUserInfo.username,
  };

  function initTableWidth(thisCs) {
    let total = 60;
    // debugger
    thisCs.forEach((item) => {
      if (item.ifShow == null || item.ifShow) total += parseInt(item.width);
    });
    /*  // 去除操作咧宽
  total -= 100*/
    if (total > windowWidth) {
      let f = 0;
      if (visible.value) f = 260;
      totalColumnWidth.value = Number(windowWidth) - f;
      tableRef.value.$el.style.setProperty('width', windowWidth + 20 - f + 'px');
    } else {
      if (visible.value && windowWidth - 260 < total) total -= total - (windowWidth - 260);
      totalColumnWidth.value = total;
      tableRef.value.$el.style.setProperty('width', total + 20 + 'px');
    }
  }

  /*栏目设置end*/
  const tableSelectedRowKeys = ref([]);
  recordData.value.tableSelectedRowKeys = tableSelectedRowKeys;
  const tableSelectedRowObjs = ref([]);
  recordData.value.tableSelectedRowObjs = tableSelectedRowObjs;

  watch(activeKey, async (v) => {
    if (!v && getDataSource().length != cardList.value.length) await cardReload();
  });

  const emit = defineEmits(['register']);
  emit('register', {
    reloadTableByYearAndMonth(e) {
      reload({
        searchInfo: {
          year: '2022',
          month: '12',
        },
      });
      console.log(e);
    },
    reloadTableByYearAndMonthAndDay(e) {
      console.log(e);
    },
  });
</script>
<style
  src="../../../../../assets/styles/generate-code-record-style/record.less"
  lang="less"
  scoped
></style>
<style>
  .ant-table-thead th {
    border: 1px solid #c9c9c9 !important;
    background-color: #d8d8d8 !important;
  }
</style>
