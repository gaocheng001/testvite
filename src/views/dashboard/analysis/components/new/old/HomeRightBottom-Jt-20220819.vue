<template>
  <div class="nc-hr-tags">
    <Row type="flex">
      <Col :span="8" >
        <div><ProfileOutlined style="font-size: 30px;padding: 5px" /><span>档案生效批准</span></div>
        <div>
          <BasicTable
            :pagination="false"
            :showIndexColumn="false"
            :rowKey='record=>record.id'
            :columns="[
          {title: '编码',dataIndex: 'id',width: 100,align: 'left',slots: {customRender: 'code'}},
          {title: '名称',dataIndex: 'name',align: 'left',slots: {customRender: 'name'}},
          {title: '类型',dataIndex: 'operate',width: 100,align: 'center',slots: {customRender: 'operate'}},
          {title: '申请时间',dataIndex: 'time',width: 120,align: 'center',slots: {customRender: 'time'}}
      ]"
            :data-source="[]"
            :scroll="{y: 260} "
            class="alone-basic-table"
            size="small"
          >
            <template #operate="{ record }">
            </template>
          </BasicTable>
        </div>
      </Col>
      <Col :span="8">
        <div><MessageOutlined style="font-size: 30px;padding: 5px"/><span>消息</span></div>
        <div>
          <List item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
              <ListItem>
                <ListItemMeta
                  description="Ant Design, a design language for background applications"
                >
                  <template #title>
                    <a href="https://www.antdv.com/">{{ item.title }}</a>
                  </template>
                  <template #avatar>
                    <Avatar v-if="Math.round(Math.random())==0" src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 55, xxl: 55 }" style="margin-left: 10%;background-color: #146dc1;">
                      <span style="font-size: 20px;color: white;">系统</span>
                    </Avatar>
                    <Avatar v-else src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 55, xxl: 55 }" style="margin-left: 10%;background-color: plum;">
                      <span style="font-size: 20px;color: white;">系统</span>
                    </Avatar>
                  </template>
                </ListItemMeta>
              </ListItem>
            </template>
          </List>
        </div>
      </Col>
      <Col :span="8" >
        <div><KeyOutlined style="font-size: 30px;padding: 5px"/><span>任务锁定</span></div>
        <BasicTable
          :pagination="false"
          :showIndexColumn="false"
          :rowKey='record=>record.id'
          :columns="[
          {title: '来源',dataIndex: 'id',width: 100,align: 'left',slots: {customRender: 'code'}},
          {title: '操作员&时间',dataIndex: 'name',align: 'left',slots: {customRender: 'name'}},
          {title: '模块',dataIndex: 'operate',width: 100,align: 'center',slots: {customRender: 'operate'}},
          {title: '操作',dataIndex: 'time',width: 80,align: 'center',slots: {customRender: 'time'}},
          {title: '年度',dataIndex: 'time2',width: 80,align: 'center',slots: {customRender: 'time'}},
          {title: '状态',dataIndex: 'time3',width: 80,align: 'center',slots: {customRender: 'time'}}
      ]"
          :data-source="[]"
          :scroll="{y: 260} "
          class="alone-basic-table"
          size="small"
        >
          <template #operate="{ record }">
          </template>
        </BasicTable>
        <div></div>
      </Col>
    </Row>
  </div>
</template>
<script setup lang="ts">
import {message, Row ,Col,List,Avatar} from "ant-design-vue";
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;
import {ProfileOutlined,MessageOutlined,KeyOutlined} from '@ant-design/icons-vue';
import {ref} from "vue";
import router from "/@/router";
import BasicTable from "/@/components/Table/src/BasicTable.vue";
const data= [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
</script>
<style lang="less" scoped>
.nc-hr-tags{
  :deep(.ant-row) {
    .ant-col {
      background-color: white;
      height: 360px;
      margin: 0 .4%;
      padding: 0px;
      flex: 0 0 32.5%;
      max-width: 32.5%;
      >div:nth-of-type(1){
        position: relative;
        height: 40px;
        font-weight: bold;
        color: #128ecb;
        span:nth-of-type(2){
          position: absolute;
          font-size: 20px;
          top: 5px
        }
      }
      >div:nth-of-type(2){

      }

    }
  }
}

</style>
