<template>
  <!-- 模版位置：web/src/views/boozsoft/stock/stock-caigou-dh/print/settings/index.vue-->
  <Layout>
    <Header name="打印模版设置">
      <template #defDiv>
        <div style="display:flex;position:relative;height:100%">
          <div style="width:100px;position:absolute;top:25px;left:5px">
            <SettingFilled  :style="{color:'#0096c7', fontSize: '44px' }"/>
          </div>
          <div style="width:100%;display:flex;justify-content: space-between;position:absolute;bottom:10px;padding-left:63px;width:100%">
            <div style="width:300px">
              <Input >
              <template #addonBefore>
                打印标题名称
              </template>
            </Input>
            </div>
            <div style="width:300px">
              <Input >
                <template #addonBefore>
                  对应名称
                </template>
              </Input>
            </div>
          </div>
        </div>
      </template>
      <template #buttons>
        <div>
          <Button>重置</Button>
          <Button>文本</Button>
          <Button>删除</Button>
          <Button>导入</Button>
          <Button>导出</Button>
          <Button>退出</Button>
        </div>
      </template>
      <template #iconButtons>
        <div>
          <Button><template #icon><ReloadOutlined /></template></Button>
          <Button><template #icon><SettingFilled /></template></Button>
          <Button><template #icon><PrinterOutlined /></template></Button>
        </div>
      </template>
    </Header>
    <div class="a1">

      <div style="display: flex;">
        <div>
          <BasicTree
            class="thistree"
            defaultExpandAll :tree-data="treeDatas"/>
        </div>
        <div style="width:10px"></div>
        <div style="width:calc(100vw - 300px)">
          <BasicTable
            ref="tableRef"
            size="small"
            @register="registerTable"
          >
            <template #bodyCell="{ column, text, record }">
              aaaa
            </template>

          </BasicTable>
        </div>
      </div>
    </div>
  </Layout>

</template>
<script setup>
// 这是示例组件
import {useTable, BasicTable} from "/@/components/Table";
import {BasicTree} from '/@/components/Tree';
import {onMounted, ref} from 'vue'
import {Button,Input} from 'ant-design-vue'
import {ReloadOutlined,PrinterOutlined,SyncOutlined, SettingFilled, PicLeftOutlined} from '@ant-design/icons-vue';

import {
  printSettingColumns
} from "/@/views/boozsoft/stock/stock-caigou-dh/print/settings/funs/table";
import {printSettingTreeDatas} from "/@/views/boozsoft/stock/stock-caigou-dh/print/settings/funs";

import Layout from '../layouts/index.vue'
import Header from '../layouts/header/index.vue'

const treeDatas = printSettingTreeDatas
const columns = printSettingColumns
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    hideOnSinglePage: true,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },

})
const tableRef = ref()
onMounted(() => {

  setTableData([
    {
      id: '',  // 主键
      tenantId: '', // 公司唯一码
      ccode: '11', // 对应模板唯一码
      printClass: '自定义', // 栏目属性（1系统、0自定义、2文本）
      printName: 'dept',  // 表体对应字段名称（原表格所有表体字段，文本类型不用读）
      printNameP: '部门',  // 表体字段打印名称
      isPrint: '5',  // 是否打印（1打印、0不打印）
      printNum: '6', // 位置编码（1开始）
      printDq: '左',  // 对齐方式（L左，B中间，R右）
      printKd: '100',  // 打印宽度（1——1000）
      fontSime: '9', // 字体大小
      cfree1: '',  //
      cfree2: '',  //
      cfree3: '',  //
      cfree4: '',  //
      cfree5: '',  //
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ])
})
</script>
<style>
.a1 {
  width: 100%;
  height: 100vh;
  z-index: 100000;
  padding: 10px 0
}

.thistree {
  width: 300px;
  height: 500px;
  background: white
}
</style>
