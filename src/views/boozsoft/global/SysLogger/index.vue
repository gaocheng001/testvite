<template>
  <RecordLayout>
    <Edit @save="recordData.saveData" @register="recordData.registerEditPage" />
    <DefaultView v-if="recordData.activeKey" />
    <CardView v-else />
    <SelectModal />
  </RecordLayout>
</template>
<script setup lang="ts">
  import { provide, ref } from 'vue';

  import {
    defineRecrodData,
    useNcAudit,
    useNcLogger,
    useNcTask,
  } from '/@/utils/boozsoft/record/recordUtils';

  import Edit from './popup/edit.vue';
  import RecordLayout from './layout/RecordLayout.vue';
  import SelectModal from './layout/SelectModal/Modal/index.vue';
  import DefaultView from './layout/content/index.vue';
  import CardView from './other/CardView.vue';

  import { findAllApi, findByIdApi, saveApi, deleteByIdApi } from '/@/api/group/SysLogger';

  import { useGroupSystemLoggerStore } from '/@/store/modules/boozsoft/group/SystemLoggerStore';
  import { useModal } from '/@/components/Modal';

  const recordName = 'SystemLogger';

  // // // 任务管理器
  // ncTask.info('')
  // // // 审计（回滚）
  // ncAudit.info('')
  const { ncLogger } = useNcLogger({ recordName });
  const { ncTask } = useNcTask({ recordName });
  const { ncAudit } = useNcAudit({ recordName });

  // 日志
  ncLogger.info('进入了日志档案页面');

  const store = useGroupSystemLoggerStore();
  const { openEditPageByAddFun, openEditPageByEditFun, deleteFun, printFun, excelFun, importFun } =
    store;

  const recordData = ref(
    defineRecrodData({
      crud: {
        findAllApi,
        findByIdApi,
        saveApi,
        deleteByIdApi,
      },
      columns: [
        // { field: 'id', label: 'ID' },
        { field: 'creatby', label: '创建人' },
        { field: 'creattime', label: '创建时间' },
        { field: 'title', label: '标题' },
        { field: 'type', label: '类型' },
        { field: 'exectime', label: '执行时间' },
        { field: 'commitdata', label: '提交数据' },
        { field: 'errorinfo', label: '错误信息' },
        { field: 'method', label: '方法类型' },
        { field: 'ip', label: 'ip' },
        // { field: 'chrome', label: '浏览器' },
        // { field: 'appflag', label: '应用标识' },
        { field: 'agent', label: '代理' },
      ],
      crudFuns: [
        [
          '新增',
          (params) => {
            ncLogger.info('进入新增页面');
            ncTask.info({ functionModule: '新增页面' });
            openEditPageByAddFun(params, recordData);
          },
        ],
        [
          '修改',
          (params) => {
            ncLogger.info('进入修改页面');
            ncTask.info({ functionModule: '修改页面' });
            openEditPageByEditFun(params, recordData);
          },
        ],
        [
          '删除',
          (params) => {
            ncLogger.info('删除数据' + JSON.stringify(recordData));
            deleteFun(params, recordData);
          },
        ],
        [
          '打印',
          (params) => {
            ncLogger.info('打印数据');
            printFun(params, recordData);
          },
        ],
        [
          '导出',
          (params) => {
            ncLogger.info('导出数据');
            excelFun(params, recordData);
          },
        ],
        [
          '导入',
          (params) => {
            ncLogger.info('倒入数据');
            importFun(params, recordData);
          },
        ],
      ],
      action: {
        async saveData(params) {
          const { reload } = recordData.value.useTableParams[1];
          const [data, { editorPreData }] = params;

          // 保存日志
          ncLogger.info('保存数据' + JSON.stringify(editorPreData.value));

          // 保存回滚记录
          ncAudit.info({ data: [editorPreData.value] });

          // 删除任务记录
          ncTask.delete('SystemLogger');

          // 保存记录
          await recordData.value.crud.saveApi(data);

          reload();
        },
        dynamicAdReload() {},
      },
    }),
  );

  provide('recordData', recordData);
</script>
