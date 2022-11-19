<template>
  <div>
    <slot :fun="teleportState.fun" :info="datasourcePicker.params"></slot>
    <!--  公司代码  -->
    <teleport :to="teleportState.ref.code">
      <Popover v-model:visible="visible" placement="bottomLeft" trigger="contextmenu">
        <Input
          v-model:value="datasourcePicker.params.coCode"
          v-on="codeInputEvents"
          class="accountCodeInput"
        >
          <template #suffix>
            <SearchOutlined @click="codeInputEvents.openSearchPage" />
          </template>
        </Input>
        <template #content>
          <AccountPopover
            v-model="authorizedList"
            :visible="visible"
            @modify="codeInputEvents.coInfoChange"
            @reset="codeInputEvents.setDefaultCode"
          />
        </template>
      </Popover>
    </teleport>
    <!--  公司名称  -->
    <teleport :to="teleportState.ref.name">
      <NameText :len="props.theme == 'three'?16:8">{{ datasourcePicker.params.companyName }}</NameText>
    </teleport>

    <!--  年度选择  -->
    <teleport :to="teleportState.ref.year">
      <Select
        class="thisDateSelect"
        :options="yearList.map((it) => ({ key: it.iyear, value: it.iyear }))"
        v-model:value="datasourcePicker.params.iyear"
        @change="yearSelectChange"
      >
        <template #suffixIcon><CalendarOutlined /></template>
      </Select>
    </teleport>
  </div>
</template>
<script setup>
  import { onMounted, ref, provide } from 'vue';
  import NameText from './NameText.vue';
  import AccountPopover from './AccountPopover.vue';
  import { useUserStore, useUserStoreWidthOut } from '/@/store/modules/user';
  import { useCompanyOperateStoreWidthOut } from '/@/store/modules/operate-company';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message, Input, Popover, Select } from 'ant-design-vue';
  import { SearchOutlined, CalendarOutlined } from '@ant-design/icons-vue';
  import {
    filterAccListByAuth,
    getAvailableYearList,
    useAccountPickerModel,
    useDatasourcePicker,
  } from '../utils/accountUtils';
  import {
    resetDefaultAccount,
  } from '../../../../api/record/system/financial-settings';
  import { useAccountPickerCache } from '../../../../store/modules/boozsoft/components/AccountPicker/cache';

  const { createWarningModal } = useMessage();
  const userStore = useUserStore();

  const emit = defineEmits(['reloadTable']);
  const props = defineProps(['theme'])

  const datasourcePicker = useDatasourcePicker();
  // 公司代码、公司名称、年度的穿梭门 start
  const teleportState = ref({
    ref: {
      code: ref(document.createElement('div')),
      name: ref(document.createElement('div')),
      year: ref(document.createElement('div')),
    },
    fun: {
      one: (e) => {
        teleportState.value.ref.code = e;
      },
      two: (e) => {
        teleportState.value.ref.name = e;
      },
      three: (e) => {
        teleportState.value.ref.year = e;
      },
    },
  });
  // 公司代码、公司名称、年度的穿梭门 end

  const visible = ref(false);

  // 账套授权详细信息
  const authorizationDetails = ref([]);
  // 已授权账套列表
  const authorizedList = ref([]);
  const yearList = ref([]);
  provide('authorizationDetails', authorizationDetails);

  const { resetParams } = useAccountPickerModel(datasourcePicker, authorizationDetails, yearList);

  const codeInputEvents = {
    keydown(e) {
      switch (e.key) {
        case ' ':
          codeInputEvents.openSearchPage(e);
          e.preventDefault();
          break;
      }
    },
    async keyup(e) {
      switch (e.key) {
        case 'Enter':
          const coInfo = authorizedList.value.filter((item) => item.coCode === e.target.value)[0];

          if (!coInfo) {
            createWarningModal({ title: '温馨提示', content: '当前账套代码系统不存在或已停用！' });
            return;
          }

          await resetParams({ coInfo });
          e.target.select();

          emitReloadTable();
          break;
      }
    },
    focus: (e) => e.target.select(),
    blur() {
      datasourcePicker.value.params.coCode = datasourcePicker.value.params.target.coCode;
    },
    openSearchPage(e) {
      // var e = window.event || event;
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
      }
      visible.value = !visible.value;
    },
    // 弹框选择回调
    async coInfoChange(coCode) {
      await resetParams({
        coInfo: authorizedList.value.filter((item) => item.coCode === coCode)[0],
      });
      visible.value = false;
      emitReloadTable();
    },
    // 设置默认登入code
    async setDefaultCode(data) {
      data['userId'] = userStore.getUserInfo.id;
      resetDefaultAccount(data)
        .then(() => message.success('默认登入账套设置成功！'))
        .catch(() => message.error('默认登入账套设置失败,请稍候再试!'));
    },
  };

  async function yearSelectChange() {
    await resetParams({
      coInfo: datasourcePicker.value.params.target,
      year: datasourcePicker.value.params.iyear,
    });
    emitReloadTable();
  }

  function emitReloadTable() {
    emit('reloadTable', datasourcePicker.value.getParams());
  }

  const companyOperateStore = useCompanyOperateStoreWidthOut();

  onMounted(async () => {
    // 获取当前用户的权限信息
    authorizationDetails.value = companyOperateStore.getAuthorizeList;
    // 获取所有账套信息 并过滤已授权的账套
    authorizedList.value = filterAccListByAuth(
      useCompanyOperateStoreWidthOut().getAccountList,
      authorizationDetails.value,
    );
    if (datasourcePicker.value.enable) {
      initYearList()
      emitReloadTable();
      return;
    }
    datasourcePicker.value.enable = true;

    // 获取缓存的账套信息
    const accountPickerInfoCacheParams = useAccountPickerCache().get();
    if (accountPickerInfoCacheParams) {
      // 有缓存
      datasourcePicker.value.resetParams(accountPickerInfoCacheParams);
      initYearList()
    } else {
      // 无缓存
      let arr = authorizationDetails.value.filter((it) => it?.defaultLogin == '1');
      let thisCoIno = null;
      if (arr.length > 0) {
        thisCoIno = authorizedList.value.filter((item) => item.accId === arr[0].accId)[0];
      } else {
        thisCoIno = authorizedList.value[0];
      }
      await resetParams({
        coInfo: thisCoIno,
        year: useCompanyOperateStoreWidthOut().loginDate.split('-')[0],
      });
    }
    emitReloadTable();
  });

  function initYearList(){
    yearList.value = getAvailableYearList(
      authorizationDetails,
      datasourcePicker.value.params.target,
    );
  }
</script>
<style src="../styles/account-theme-one.less" lang="less" scoped></style>
